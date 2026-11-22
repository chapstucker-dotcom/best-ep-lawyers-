BEGIN;

-- Status belongs to the individual authorized firm assignment, not the shared lead.
ALTER TABLE public.lead_assignments
  ADD COLUMN workflow_status text NOT NULL DEFAULT 'new',
  ADD COLUMN workflow_updated_at timestamptz,
  ADD CONSTRAINT lead_assignments_workflow_status_check
    CHECK (workflow_status IN ('new', 'contacted', 'consultation_scheduled', 'retained', 'closed'));

-- Fail closed if an unexpected direct grant exists.
DO $check$
BEGIN
  IF has_column_privilege('anon', 'public.lead_assignments', 'workflow_status', 'UPDATE')
    OR has_column_privilege('authenticated', 'public.lead_assignments', 'workflow_status', 'UPDATE')
    OR has_column_privilege('anon', 'public.lead_assignments', 'workflow_updated_at', 'UPDATE')
    OR has_column_privilege('authenticated', 'public.lead_assignments', 'workflow_updated_at', 'UPDATE') THEN
    RAISE EXCEPTION 'Unexpected direct inquiry update privileges';
  END IF;
END;
$check$;

-- Keep the original read RPC available to the currently deployed application.
CREATE FUNCTION public.get_owned_firm_inquiries_v2(
  p_firm_id text,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  assignment_id uuid,
  assigned_at timestamptz,
  full_name text,
  email text,
  phone text,
  practice_area text,
  legal_issue text,
  matter_location text,
  matter_timing text,
  notification_status text,
  workflow_status text,
  workflow_updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT i.assignment_id, i.assigned_at, i.full_name, i.email, i.phone,
    i.practice_area, i.legal_issue, i.matter_location, i.matter_timing,
    i.notification_status, a.workflow_status, a.workflow_updated_at
  FROM public.get_owned_firm_inquiries(p_firm_id, p_offset) i
  JOIN public.lead_assignments a ON a.id = i.assignment_id
  ORDER BY i.assigned_at DESC, i.assignment_id DESC;
$function$;

CREATE FUNCTION public.update_owned_firm_inquiry_status(
  p_assignment_id uuid,
  p_status text
)
RETURNS timestamptz
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
  v_user uuid := auth.uid();
  v_firm_id text;
  v_updated_at timestamptz;
BEGIN
  IF v_user IS NULL OR p_status IS NULL OR p_status NOT IN
    ('new', 'contacted', 'consultation_scheduled', 'retained', 'closed') THEN
    RAISE EXCEPTION 'Invalid inquiry status request' USING ERRCODE = '22023';
  END IF;

  -- Lock the current owner row against concurrent transfer while saving.
  SELECT f.id INTO v_firm_id
  FROM public.firms f
  JOIN public.lead_assignments a ON a.firm_id = f.id
  WHERE a.id = p_assignment_id
    AND f.user_id = v_user
    AND a.recipient_user_id = v_user
    AND a.consent_version = 'epbl-inquiry-v1'
  FOR SHARE OF f;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inquiry unavailable' USING ERRCODE = '42501';
  END IF;

  UPDATE public.lead_assignments
  SET workflow_status = p_status, workflow_updated_at = now()
  WHERE id = p_assignment_id
    AND firm_id = v_firm_id
    AND recipient_user_id = v_user
    AND consent_version = 'epbl-inquiry-v1'
  RETURNING workflow_updated_at INTO v_updated_at;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inquiry unavailable' USING ERRCODE = '42501';
  END IF;
  RETURN v_updated_at;
END;
$function$;

REVOKE ALL ON FUNCTION public.get_owned_firm_inquiries_v2(text, integer)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_owned_firm_inquiry_status(uuid, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_owned_firm_inquiries_v2(text, integer)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_owned_firm_inquiry_status(uuid, text)
  TO authenticated;

COMMIT;
