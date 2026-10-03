-- Add lead attribution and qualification fields already submitted by LeadCaptureForm.
-- All columns are nullable to preserve existing leads and the current public insert flow.

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS firm_id text,
  ADD COLUMN IF NOT EXISTS firm_name text,
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS medium text,
  ADD COLUMN IF NOT EXISTS campaign text,
  ADD COLUMN IF NOT EXISTS matter_location text,
  ADD COLUMN IF NOT EXISTS matter_timing text;
