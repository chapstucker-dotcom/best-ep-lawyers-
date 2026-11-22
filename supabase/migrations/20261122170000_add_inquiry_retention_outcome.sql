BEGIN;

ALTER TABLE public.lead_assignments
  ADD COLUMN retained_at timestamptz;

-- Only backfill known current outcomes; do not infer past retention from Closed.
UPDATE public.lead_assignments
SET retained_at = COALESCE(workflow_updated_at, assigned_at)
WHERE workflow_status = 'retained';

ALTER TABLE public.lead_assignments
  ADD CONSTRAINT lead_assignments_retained_outcome_check
  CHECK (workflow_status <> 'retained' OR retained_at IS NOT NULL);

DO $check$
BEGIN
  IF has_column_privilege('anon', 'public.lead_assignments', 'retained_at', 'UPDATE')
    OR has_column_privilege('authenticated', 'public.lead_assignments', 'retained_at', 'UPDATE') THEN
    RAISE EXCEPTION 'Unexpected direct retention update privileges';
  END IF;
END;
$check$;

-- Keep the old RPC usable while the new dashboard deploys.
CREATE OR REPLACE FUNCTION public.update_owned_firm_inquiry_status(p_assignment_id uuid, p_status text)
RETURNS timestamptz
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog
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
  SELECT f.id INTO v_firm_id
  FROM public.firms f
  JOIN public.lead_assignments a ON a.firm_id = f.id
  WHERE a.id = p_assignment_id AND f.user_id = v_user
    AND a.recipient_user_id = v_user AND a.consent_version = 'epbl-inquiry-v1'
  FOR SHARE OF f;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inquiry unavailable' USING ERRCODE = '42501';
  END IF;
  UPDATE public.lead_assignments
  SET workflow_status = p_status, workflow_updated_at = now(),
      retained_at = CASE WHEN p_status = 'retained' THEN COALESCE(retained_at, now()) ELSE retained_at END
  WHERE id = p_assignment_id AND firm_id = v_firm_id AND recipient_user_id = v_user
    AND consent_version = 'epbl-inquiry-v1'
  RETURNING workflow_updated_at INTO v_updated_at;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inquiry unavailable' USING ERRCODE = '42501';
  END IF;
  RETURN v_updated_at;
END;
$function$;

CREATE FUNCTION public.update_owned_firm_inquiry_outcome(
  p_assignment_id uuid, p_status text, p_clear_retention boolean DEFAULT false
)
RETURNS TABLE (workflow_updated_at timestamptz, retained_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog
AS $function$
BEGIN
  IF p_clear_retention IS NULL OR (p_clear_retention AND p_status = 'retained') THEN
    RAISE EXCEPTION 'Choose a non-retained status before correcting retention' USING ERRCODE = '22023';
  END IF;
  -- Original RPC checks ownership and locks the firm and assignment for this transaction.
  PERFORM public.update_owned_firm_inquiry_status(p_assignment_id, p_status);
  IF p_clear_retention THEN
    UPDATE public.lead_assignments a SET retained_at = NULL
    WHERE a.id = p_assignment_id AND a.recipient_user_id = (SELECT auth.uid());
  END IF;
  RETURN QUERY SELECT a.workflow_updated_at, a.retained_at
  FROM public.lead_assignments a WHERE a.id = p_assignment_id
    AND a.recipient_user_id = (SELECT auth.uid());
END;
$function$;

CREATE FUNCTION public.get_owned_firm_inquiries_v3(p_firm_id text, p_offset integer DEFAULT 0)
RETURNS TABLE (
  assignment_id uuid, assigned_at timestamptz, full_name text, email text, phone text,
  practice_area text, legal_issue text, matter_location text, matter_timing text,
  notification_status text, workflow_status text, workflow_updated_at timestamptz,
  retained_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog
AS $function$
  SELECT i.*, a.retained_at
  FROM public.get_owned_firm_inquiries_v2(p_firm_id, p_offset) i
  JOIN public.lead_assignments a ON a.id = i.assignment_id
  ORDER BY i.assigned_at DESC, i.assignment_id DESC;
$function$;

CREATE FUNCTION public.get_owned_firm_inquiry_summary_v2(p_firm_id text)
RETURNS TABLE (
  total bigint, new_count bigint, contacted_count bigint, scheduled_count bigint,
  retained_count bigint, closed_count bigint, recorded_retained_count bigint
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog
AS $function$
  SELECT count(a.id),
    count(a.id) FILTER (WHERE a.workflow_status = 'new'),
    count(a.id) FILTER (WHERE a.workflow_status = 'contacted'),
    count(a.id) FILTER (WHERE a.workflow_status = 'consultation_scheduled'),
    count(a.id) FILTER (WHERE a.workflow_status = 'retained'),
    count(a.id) FILTER (WHERE a.workflow_status = 'closed'),
    count(a.id) FILTER (WHERE a.retained_at IS NOT NULL)
  FROM public.firms f
  LEFT JOIN public.lead_assignments a ON a.firm_id = f.id
    AND a.recipient_user_id = (SELECT auth.uid())
    AND a.consent_version = 'epbl-inquiry-v1'
  WHERE f.id = p_firm_id AND f.user_id = (SELECT auth.uid())
  GROUP BY f.id;
$function$;

REVOKE ALL ON FUNCTION public.update_owned_firm_inquiry_outcome(uuid,text,boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_owned_firm_inquiries_v3(text,integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_owned_firm_inquiry_summary_v2(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_owned_firm_inquiry_outcome(uuid,text,boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_owned_firm_inquiries_v3(text,integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_owned_firm_inquiry_summary_v2(text) TO authenticated;

COMMIT;
