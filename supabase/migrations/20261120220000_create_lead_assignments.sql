BEGIN;

CREATE TABLE public.lead_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id uuid NOT NULL
        REFERENCES public.leads(id) ON DELETE CASCADE,
    firm_id text NOT NULL
        REFERENCES public.firms(id) ON DELETE RESTRICT,
    firm_name text NOT NULL,
    firm_tier text,
    assignment_source text NOT NULL
        CHECK (assignment_source IN (
            'consumer_selected',
            'consumer_authorized_matching'
        )),
    consent_at timestamptz NOT NULL,
    consent_version text NOT NULL,
    assigned_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (lead_id, firm_id)
);

CREATE INDEX lead_assignments_firm_id_idx
    ON public.lead_assignments (firm_id);

ALTER TABLE public.lead_assignments
    ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.lead_assignments
    FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
    ON public.lead_assignments TO service_role;

CREATE UNIQUE INDEX
    attribution_events_one_consultation_per_firm_lead_idx
    ON public.attribution_events (lead_id, firm_id)
    WHERE action = 'consultation_submit'
      AND lead_id IS NOT NULL;

DROP INDEX public.attribution_events_one_consultation_per_lead_idx;

COMMIT;
