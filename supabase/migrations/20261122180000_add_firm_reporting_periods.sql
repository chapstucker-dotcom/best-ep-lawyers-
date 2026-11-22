BEGIN;

-- Date bounds are inclusive local calendar dates in El Paso (Mountain time).
-- NULL/NULL means all retained history; invalid or partial bounds return no row.
CREATE FUNCTION public.get_owned_firm_attribution_period(
  p_firm_id text, p_start date DEFAULT NULL, p_end date DEFAULT NULL
)
RETURNS TABLE (
  listing_impressions bigint, total_views bigint, phone_clicks bigint,
  email_clicks bigint, website_clicks bigint, total_clicks bigint,
  consultation_submissions bigint
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog
AS $function$
  SELECT
    count(e.id) FILTER (WHERE e.action = 'listing_impression'),
    count(e.id) FILTER (WHERE e.action = 'profile_view'),
    count(e.id) FILTER (WHERE e.action = 'click_phone'),
    count(e.id) FILTER (WHERE e.action = 'click_email'),
    count(e.id) FILTER (WHERE e.action = 'click_website'),
    count(e.id) FILTER (WHERE e.action IN ('click_phone','click_email','click_website')),
    count(e.id) FILTER (WHERE e.action = 'consultation_submit')
  FROM public.firms f
  LEFT JOIN public.attribution_events e ON e.firm_id = f.id
    AND (p_start IS NULL OR e.occurred_at >= (p_start::timestamp AT TIME ZONE 'America/Denver'))
    AND (p_end IS NULL OR e.occurred_at < ((p_end + 1)::timestamp AT TIME ZONE 'America/Denver'))
  WHERE f.id = p_firm_id AND f.user_id = (SELECT auth.uid())
    AND ((p_start IS NULL AND p_end IS NULL) OR
         (p_start IS NOT NULL AND p_end IS NOT NULL AND p_start <= p_end))
  GROUP BY f.id;
$function$;

CREATE FUNCTION public.get_owned_firm_inquiry_period(
  p_firm_id text, p_start date DEFAULT NULL, p_end date DEFAULT NULL
)
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
    AND (p_start IS NULL OR a.assigned_at >= (p_start::timestamp AT TIME ZONE 'America/Denver'))
    AND (p_end IS NULL OR a.assigned_at < ((p_end + 1)::timestamp AT TIME ZONE 'America/Denver'))
  WHERE f.id = p_firm_id AND f.user_id = (SELECT auth.uid())
    AND ((p_start IS NULL AND p_end IS NULL) OR
         (p_start IS NOT NULL AND p_end IS NOT NULL AND p_start <= p_end))
  GROUP BY f.id;
$function$;

REVOKE ALL ON FUNCTION public.get_owned_firm_attribution_period(text,date,date) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_owned_firm_inquiry_period(text,date,date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_owned_firm_attribution_period(text,date,date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_owned_firm_inquiry_period(text,date,date) TO authenticated;

COMMIT;
