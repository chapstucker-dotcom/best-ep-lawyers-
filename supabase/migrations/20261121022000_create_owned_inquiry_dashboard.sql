BEGIN;

-- Bind an inquiry to the account that owned the firm at the time of consent.
-- Older assignments without a recorded owner remain invisible to this RPC.
ALTER TABLE public.lead_assignments
  ADD COLUMN IF NOT EXISTS recipient_user_id uuid;

-- Historical notification rows may have no firm identifier. Do not infer
-- ownership or delivery from a firm's current email address.
ALTER TABLE public.lead_notifications
  ADD COLUMN IF NOT EXISTS firm_id text;

CREATE INDEX IF NOT EXISTS lead_notifications_firm_lead_idx
  ON public.lead_notifications (firm_id, lead_id)
  WHERE recipient_type = 'firm';

CREATE OR REPLACE FUNCTION public.get_owned_firm_inquiries(
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
  notification_status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT
    a.id,
    a.assigned_at,
    l.full_name,
    l.email,
    l.phone,
    l.practice_area,
    l.legal_issue,
    l.matter_location,
    l.matter_timing,
    COALESCE(n.status, 'not_confirmed')::text
  FROM public.lead_assignments a
  JOIN public.firms f ON f.id = a.firm_id
  JOIN public.leads l ON l.id = a.lead_id
  LEFT JOIN LATERAL (
    SELECT ln.status
    FROM public.lead_notifications ln
    WHERE ln.lead_id = a.lead_id
      AND ln.firm_id = a.firm_id
      AND ln.recipient_type = 'firm'
    ORDER BY ln.updated_at DESC, ln.id
    LIMIT 1
  ) n ON true
  WHERE a.firm_id = p_firm_id
    AND f.user_id = (SELECT auth.uid())
    AND a.recipient_user_id = (SELECT auth.uid())
    AND a.consent_version = 'epbl-inquiry-v1'
  ORDER BY a.assigned_at DESC, a.id DESC
  LIMIT 26 OFFSET GREATEST(0, LEAST(COALESCE(p_offset, 0), 100000));
$function$;

REVOKE ALL ON FUNCTION public.get_owned_firm_inquiries(text, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_owned_firm_inquiries(text, integer)
  TO authenticated;

COMMIT;
