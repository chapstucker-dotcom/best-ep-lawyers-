-- Attribution events for the active firms directory.
-- This table is intentionally separate from:
--   public.analytics        (legacy event tracking)
--   public.analytics_events (older category-based architecture)

CREATE TABLE public.attribution_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  firm_id text NOT NULL
    REFERENCES public.firms(id)
    ON DELETE CASCADE,

  action text NOT NULL
    CHECK (
      action IN (
        'listing_impression',
        'profile_view',
        'click_phone',
        'click_email',
        'click_website',
        'consultation_submit'
      )
    ),

  market text,
  specialty text,
  page text,

  source text,
  medium text,
  campaign text,
  referrer text,

  lead_id uuid
    REFERENCES public.leads(id)
    ON DELETE SET NULL,

  occurred_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX attribution_events_firm_id_idx
  ON public.attribution_events (firm_id);

CREATE INDEX attribution_events_action_idx
  ON public.attribution_events (action);

CREATE INDEX attribution_events_occurred_at_idx
  ON public.attribution_events (occurred_at DESC);

CREATE INDEX attribution_events_firm_action_occurred_at_idx
  ON public.attribution_events (firm_id, action, occurred_at DESC);

CREATE INDEX attribution_events_market_specialty_idx
  ON public.attribution_events (market, specialty);

CREATE INDEX attribution_events_lead_id_idx
  ON public.attribution_events (lead_id)
  WHERE lead_id IS NOT NULL;

ALTER TABLE public.attribution_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY attribution_events_public_insert
ON public.attribution_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.firms
    WHERE firms.id = attribution_events.firm_id
      AND firms.is_active = true
  )
  AND attribution_events.lead_id IS NULL
);

CREATE POLICY attribution_events_owner_select
ON public.attribution_events
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.firms
    WHERE firms.id = attribution_events.firm_id
      AND firms.user_id = auth.uid()
  )
);

CREATE POLICY attribution_events_admin_select
ON public.attribution_events
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
  OR ((auth.jwt() ->> 'role') = 'superadmin')
);
