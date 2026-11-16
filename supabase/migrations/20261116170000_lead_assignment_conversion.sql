-- EPBL: record recipient assignment without overwriting the firm the visitor requested.
-- Apply before deploying the corresponding api/send-lead.ts update.
-- Nullable columns preserve historical inquiries; no backfill is attempted.
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS assigned_firm_id text,
  ADD COLUMN IF NOT EXISTS assigned_firm_name text,
  ADD COLUMN IF NOT EXISTS assigned_firm_tier text,
  ADD COLUMN IF NOT EXISTS assigned_at timestamptz;

CREATE INDEX IF NOT EXISTS leads_assigned_firm_id_idx
  ON public.leads (assigned_firm_id)
  WHERE assigned_firm_id IS NOT NULL;

-- Enforce at most one lead-linked consultation conversion per saved inquiry.
-- Existing anonymous/browser events have NULL lead_id and remain unaffected.
CREATE UNIQUE INDEX IF NOT EXISTS attribution_events_one_consultation_per_lead_idx
  ON public.attribution_events (lead_id)
  WHERE action = 'consultation_submit' AND lead_id IS NOT NULL;
