-- EPBL Community Submissions: private moderation queue and public-safe publication.
-- Apply independently; do not automatically run historical migrations.

CREATE TABLE IF NOT EXISTS public.community_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_type text NOT NULL CHECK (submission_type IN ('Event','Resource','Program')),
  contributor_name text NOT NULL CHECK (char_length(btrim(contributor_name)) BETWEEN 1 AND 120),
  contributor_email text NOT NULL CHECK (char_length(contributor_email) BETWEEN 3 AND 254),
  organization text NOT NULL CHECK (char_length(btrim(organization)) BETWEEN 1 AND 150),
  title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 180),
  details text NOT NULL CHECK (char_length(btrim(details)) BETWEEN 10 AND 1800),
  event_date date,
  location text CHECK (location IS NULL OR char_length(location) <= 180),
  source_url text CHECK (source_url IS NULL OR char_length(source_url) <= 500),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','published','rejected','removed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  moderated_at timestamptz,
  moderated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  moderation_notes text CHECK (
    moderation_notes IS NULL OR char_length(moderation_notes) <= 2000
  ),
  CONSTRAINT community_event_fields CHECK (
    submission_type <> 'Event' OR
    (event_date IS NOT NULL AND location IS NOT NULL AND char_length(btrim(location)) > 0)
  )
);

CREATE INDEX IF NOT EXISTS community_submissions_status_created_idx
ON public.community_submissions(status, created_at DESC);

CREATE INDEX IF NOT EXISTS community_submissions_published_date_idx
ON public.community_submissions(event_date)
WHERE status = 'published' AND submission_type = 'Event';

ALTER TABLE public.community_submissions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.community_submissions FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public.community_submissions TO authenticated;

GRANT UPDATE (
  submission_type, organization, title, details, event_date,
  location, source_url, status, moderation_notes, moderated_at, moderated_by
) ON public.community_submissions TO authenticated;

CREATE POLICY community_submissions_admin_select
ON public.community_submissions
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = (SELECT auth.uid())
    AND au.role = 'super_admin'
  )
);

CREATE POLICY community_submissions_admin_update
ON public.community_submissions
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = (SELECT auth.uid())
    AND au.role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = (SELECT auth.uid())
    AND au.role = 'super_admin'
  )
);

CREATE OR REPLACE FUNCTION public.community_submissions_touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER community_submissions_updated_at
BEFORE UPDATE ON public.community_submissions
FOR EACH ROW
EXECUTE FUNCTION public.community_submissions_touch_updated_at();

REVOKE ALL ON FUNCTION public.community_submissions_touch_updated_at()
FROM PUBLIC;

CREATE OR REPLACE VIEW public.published_community_submissions
WITH (security_invoker = false, security_barrier = true)
AS
SELECT
  id, submission_type, organization, title, details,
  event_date, location, source_url, created_at
FROM public.community_submissions
WHERE status = 'published';

REVOKE ALL ON public.published_community_submissions
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public.published_community_submissions
TO anon, authenticated;
