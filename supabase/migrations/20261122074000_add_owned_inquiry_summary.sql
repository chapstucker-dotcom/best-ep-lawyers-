BEGIN;

-- Current status snapshot across all authorized assignments, not just a UI page.
-- This deliberately does not infer historical milestones from a current status.
CREATE FUNCTION public.get_owned_firm_inquiry_summary(p_firm_id text)
RETURNS TABLE (
  total bigint,
  new_count bigint,
  contacted_count bigint,
  scheduled_count bigint,
  retained_count bigint,
  closed_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT count(a.id),
    count(a.id) FILTER (WHERE a.workflow_status = 'new'),
    count(a.id) FILTER (WHERE a.workflow_status = 'contacted'),
    count(a.id) FILTER (WHERE a.workflow_status = 'consultation_scheduled'),
    count(a.id) FILTER (WHERE a.workflow_status = 'retained'),
    count(a.id) FILTER (WHERE a.workflow_status = 'closed')
  FROM public.firms f
  LEFT JOIN public.lead_assignments a ON a.firm_id = f.id
    AND a.recipient_user_id = (SELECT auth.uid())
    AND a.consent_version = 'epbl-inquiry-v1'
  WHERE f.id = p_firm_id
    AND f.user_id = (SELECT auth.uid())
  GROUP BY f.id;
$function$;

REVOKE ALL ON FUNCTION public.get_owned_firm_inquiry_summary(text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_owned_firm_inquiry_summary(text)
  TO authenticated;

COMMIT;
