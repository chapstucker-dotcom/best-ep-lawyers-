-- Reconcile reviews with the current firm-based review workflow.
-- Production had reviews.firm_id incorrectly referencing category.id.
-- Reviews contained zero rows when this reconciliation was prepared.

ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_firm_id_fkey;

ALTER TABLE public.reviews
  ALTER COLUMN firm_id TYPE TEXT USING firm_id::text;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_firm_id_fkey
  FOREIGN KEY (firm_id)
  REFERENCES public.firms(id)
  ON DELETE CASCADE;

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS reviewer_email TEXT;

ALTER TABLE public.reviews
  ALTER COLUMN user_id DROP NOT NULL;


-- ---------------------------------------------------------------------------
-- BASELINE REVIEW RLS RECONCILIATION
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "reviews_authenticated_delete" ON public.reviews;
DROP POLICY IF EXISTS "reviews_authenticated_insert" ON public.reviews;
DROP POLICY IF EXISTS "reviews_authenticated_select" ON public.reviews;
DROP POLICY IF EXISTS "reviews_authenticated_update" ON public.reviews;
DROP POLICY IF EXISTS "reviews_public_select" ON public.reviews;
DROP POLICY IF EXISTS "reviews_public_insert" ON public.reviews;
DROP POLICY IF EXISTS "reviews_owner_update" ON public.reviews;
DROP POLICY IF EXISTS "reviews_owner_delete" ON public.reviews;

DROP POLICY IF EXISTS "Approved reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_public_insert"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (
  is_approved IS NOT TRUE
  AND user_id IS NULL
  AND EXISTS (
    SELECT 1
    FROM public.firms
    WHERE firms.id = reviews.firm_id
  )
);

CREATE POLICY "reviews_public_select"
ON public.reviews
FOR SELECT
TO anon
USING (is_approved IS TRUE);

CREATE POLICY "reviews_authenticated_select"
ON public.reviews
FOR SELECT
TO authenticated
USING (
  is_approved IS TRUE
  OR EXISTS (
    SELECT 1
    FROM public.firms
    WHERE firms.id = reviews.firm_id
      AND firms.user_id = (SELECT auth.uid())
  )
  OR ((SELECT auth.jwt()) ->> 'role') = 'superadmin'
);

CREATE POLICY "reviews_owner_update"
ON public.reviews
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.firms
    WHERE firms.id = reviews.firm_id
      AND firms.user_id = (SELECT auth.uid())
  )
  OR ((SELECT auth.jwt()) ->> 'role') = 'superadmin'
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.firms
    WHERE firms.id = reviews.firm_id
      AND firms.user_id = (SELECT auth.uid())
  )
  OR ((SELECT auth.jwt()) ->> 'role') = 'superadmin'
);

CREATE POLICY "reviews_owner_delete"
ON public.reviews
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.firms
    WHERE firms.id = reviews.firm_id
      AND firms.user_id = (SELECT auth.uid())
  )
  OR ((SELECT auth.jwt()) ->> 'role') = 'superadmin'
);


-- ---------------------------------------------------------------------------
-- FIRM RATING CALCULATION
-- ---------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.recalculate_firm_rating(uuid);

CREATE OR REPLACE FUNCTION public.recalculate_firm_rating(p_firm_id text)
RETURNS void
LANGUAGE plpgsql
SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  v_avg numeric(3,2);
  v_count integer;
BEGIN
  SELECT
    COALESCE(AVG(rating)::numeric(3,2), 0),
    COUNT(*)
  INTO v_avg, v_count
  FROM public.reviews
  WHERE firm_id = p_firm_id
    AND is_approved IS TRUE;

  UPDATE public.firms
  SET rating_avg = v_avg,
      rating_count = v_count
  WHERE id = p_firm_id;
END;
$function$;


-- ---------------------------------------------------------------------------
-- REPUTATION MANAGEMENT FOUNDATION
--
-- EPBL controls review publication.
-- Firms may respond to and dispute reviews.
-- Firms may not approve, reject, remove, or delete consumer reviews.
-- ---------------------------------------------------------------------------

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS firm_response TEXT,
  ADD COLUMN IF NOT EXISTS firm_response_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS dispute_status TEXT,
  ADD COLUMN IF NOT EXISTS dispute_reason TEXT,
  ADD COLUMN IF NOT EXISTS dispute_details TEXT,
  ADD COLUMN IF NOT EXISTS disputed_at TIMESTAMPTZ;

ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_moderation_status_check;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_moderation_status_check
  CHECK (
    moderation_status IN (
      'pending',
      'published',
      'rejected',
      'disputed',
      'removed'
    )
  );

ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_dispute_status_check;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_dispute_status_check
  CHECK (
    dispute_status IS NULL
    OR dispute_status IN (
      'submitted',
      'reviewing',
      'resolved',
      'dismissed'
    )
  );


-- ---------------------------------------------------------------------------
-- INITIAL MODERATION-STATUS BACKFILL
--
-- Preserve the publication state of any existing review.
-- ---------------------------------------------------------------------------

UPDATE public.reviews
SET moderation_status =
  CASE
    WHEN is_approved IS TRUE THEN 'published'
    ELSE 'pending'
  END;


-- ---------------------------------------------------------------------------
-- MODERATION / LEGACY COMPATIBILITY
--
-- moderation_status is authoritative.
-- is_approved and approved remain synchronized for existing application
-- code and rating infrastructure.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.sync_review_moderation_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'pg_catalog', 'public'
AS $function$
BEGIN
  NEW.is_approved := (NEW.moderation_status = 'published');
  NEW.approved := NEW.is_approved;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS sync_review_moderation_columns
ON public.reviews;

CREATE TRIGGER sync_review_moderation_columns
BEFORE INSERT OR UPDATE OF moderation_status
ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.sync_review_moderation_columns();


-- Replace the old compatibility function so legacy approved cannot
-- override moderation_status regardless of BEFORE-trigger execution order.

CREATE OR REPLACE FUNCTION public.sync_review_compatibility_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'pg_catalog', 'public'
AS $function$
BEGIN
  -- Preserve legacy body/comment compatibility.
  NEW.body := COALESCE(NEW.body, NEW.comment);
  NEW.comment := COALESCE(NEW.comment, NEW.body);

  -- moderation_status is authoritative for publication.
  IF NEW.moderation_status IS NOT NULL THEN
    NEW.is_approved := (NEW.moderation_status = 'published');
    NEW.approved := NEW.is_approved;
  ELSE
    NEW.approved := COALESCE(NEW.approved, NEW.is_approved, false);
    NEW.is_approved := COALESCE(NEW.is_approved, NEW.approved, false);
  END IF;

  RETURN NEW;
END;
$function$;


-- ---------------------------------------------------------------------------
-- REMOVE FIRM-CONTROLLED REVIEW MODERATION
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "reviews_owner_update" ON public.reviews;
DROP POLICY IF EXISTS "reviews_owner_delete" ON public.reviews;


-- ---------------------------------------------------------------------------
-- FIRM RESPONSE FUNCTION
--
-- A firm may respond only to a published review belonging to that firm.
-- EPBL super admins may also use this function.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.respond_to_review(
  p_review_id UUID,
  p_response TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  v_firm_id TEXT;
BEGIN
  SELECT firm_id
  INTO v_firm_id
  FROM public.reviews
  WHERE id = p_review_id
    AND moderation_status = 'published';

  IF v_firm_id IS NULL THEN
    RAISE EXCEPTION 'Published review not found';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.firms
    WHERE id = v_firm_id
      AND user_id = auth.uid()
  )
  AND NOT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Not authorized to respond to this review';
  END IF;

  IF NULLIF(BTRIM(p_response), '') IS NULL THEN
    RAISE EXCEPTION 'Response cannot be empty';
  END IF;

  UPDATE public.reviews
  SET
    firm_response = BTRIM(p_response),
    firm_response_at = now()
  WHERE id = p_review_id;
END;
$function$;


-- ---------------------------------------------------------------------------
-- REVIEW DISPUTE FUNCTION
--
-- A firm may flag a review for EPBL review but cannot suppress or remove it.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.dispute_review(
  p_review_id UUID,
  p_reason TEXT,
  p_details TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  v_firm_id TEXT;
BEGIN
  SELECT firm_id
  INTO v_firm_id
  FROM public.reviews
  WHERE id = p_review_id;

  IF v_firm_id IS NULL THEN
    RAISE EXCEPTION 'Review not found';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.firms
    WHERE id = v_firm_id
      AND user_id = auth.uid()
  )
  AND NOT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Not authorized to dispute this review';
  END IF;

  IF NULLIF(BTRIM(p_reason), '') IS NULL THEN
    RAISE EXCEPTION 'Dispute reason is required';
  END IF;

  UPDATE public.reviews
  SET
    dispute_status = 'submitted',
    dispute_reason = BTRIM(p_reason),
    dispute_details = NULLIF(
      BTRIM(COALESCE(p_details, '')),
      ''
    ),
    disputed_at = now()
  WHERE id = p_review_id;
END;
$function$;


-- ---------------------------------------------------------------------------
-- RPC PERMISSIONS
-- ---------------------------------------------------------------------------

REVOKE ALL
ON FUNCTION public.respond_to_review(UUID, TEXT)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.dispute_review(UUID, TEXT, TEXT)
FROM PUBLIC;

REVOKE EXECUTE
ON FUNCTION public.respond_to_review(UUID, TEXT)
FROM anon;

REVOKE EXECUTE
ON FUNCTION public.dispute_review(UUID, TEXT, TEXT)
FROM anon;

GRANT EXECUTE
ON FUNCTION public.respond_to_review(UUID, TEXT)
TO authenticated;

GRANT EXECUTE
ON FUNCTION public.dispute_review(UUID, TEXT, TEXT)
TO authenticated;


-- ---------------------------------------------------------------------------
-- EPBL ADMIN MODERATION
--
-- Production admin_users uses role = 'super_admin'.
-- Only EPBL super admins may directly update or delete review rows.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "reviews_admin_update" ON public.reviews;
DROP POLICY IF EXISTS "reviews_admin_delete" ON public.reviews;

CREATE POLICY "reviews_admin_update"
ON public.reviews
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = (SELECT auth.uid())
      AND admin_users.role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = (SELECT auth.uid())
      AND admin_users.role = 'super_admin'
  )
);

CREATE POLICY "reviews_admin_delete"
ON public.reviews
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = (SELECT auth.uid())
      AND admin_users.role = 'super_admin'
  )
);


-- ---------------------------------------------------------------------------
-- PUBLIC / OWNER REVIEW VISIBILITY
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "reviews_public_select" ON public.reviews;

CREATE POLICY "reviews_public_select"
ON public.reviews
FOR SELECT
TO anon
USING (
  moderation_status = 'published'
);

DROP POLICY IF EXISTS "reviews_authenticated_select" ON public.reviews;

CREATE POLICY "reviews_authenticated_select"
ON public.reviews
FOR SELECT
TO authenticated
USING (
  moderation_status = 'published'
  OR EXISTS (
    SELECT 1
    FROM public.firms
    WHERE firms.id = reviews.firm_id
      AND firms.user_id = (SELECT auth.uid())
  )
  OR EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = (SELECT auth.uid())
      AND admin_users.role = 'super_admin'
  )
);
-- ---------------------------------------------------------------------------
-- REVIEW TABLE LEAST-PRIVILEGE GRANTS
--
-- Public visitors may submit reviews and read only published public-safe data.
-- Authenticated users may additionally read owner-facing dispute fields.
-- Firm response/dispute writes occur through SECURITY DEFINER RPCs above.
-- Direct review UPDATE/DELETE is reserved for authenticated EPBL admins by RLS.
-- ---------------------------------------------------------------------------

REVOKE ALL PRIVILEGES ON TABLE public.reviews FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.reviews FROM authenticated;

GRANT SELECT (
  id,
  firm_id,
  reviewer_name,
  rating,
  title,
  comment,
  created_at,
  moderation_status,
  firm_response,
  firm_response_at
)
ON public.reviews
TO anon;

GRANT INSERT (
  firm_id,
  reviewer_name,
  reviewer_email,
  rating,
  title,
  comment
)
ON public.reviews
TO anon, authenticated;

GRANT SELECT (
  id,
  firm_id,
  reviewer_name,
  rating,
  title,
  comment,
  created_at,
  moderation_status,
  firm_response,
  firm_response_at,
  dispute_status,
  dispute_reason,
  dispute_details
)
ON public.reviews
TO authenticated;

-- Needed only for EPBL super-admin moderation. RLS restricts these operations
-- to rows/actions authorized by reviews_admin_update/reviews_admin_delete.
GRANT UPDATE (
  moderation_status,
  moderated_at,
  moderated_by,
  dispute_status,
  dispute_reason,
  dispute_details
)
ON public.reviews
TO authenticated;

GRANT DELETE
ON public.reviews
TO authenticated;
-- ============================================================
-- ADMIN REVIEW MODERATION RPCS
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_review_moderation_queue()
RETURNS TABLE (
  id uuid,
  firm_id text,
  firm_name text,
  reviewer_name text,
  reviewer_email text,
  rating integer,
  title text,
  comment text,
  created_at timestamptz,
  moderation_status text,
  moderated_at timestamptz,
  firm_response text,
  firm_response_at timestamptz,
  dispute_status text,
  dispute_reason text,
  dispute_details text,
  disputed_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.user_id = auth.uid()
      AND au.role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT
    r.id,
    r.firm_id,
    f.name AS firm_name,
    r.reviewer_name,
    r.reviewer_email,
    r.rating,
    r.title,
    r.comment,
    r.created_at,
    r.moderation_status,
    r.moderated_at,
    r.firm_response,
    r.firm_response_at,
    r.dispute_status,
    r.dispute_reason,
    r.dispute_details,
    r.disputed_at
  FROM public.reviews r
  LEFT JOIN public.firms f
    ON f.id = r.firm_id
  ORDER BY
    CASE
      WHEN r.dispute_status IN ('submitted', 'reviewing') THEN 0
      WHEN r.moderation_status = 'pending' THEN 1
      ELSE 2
    END,
    r.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_review_moderation_queue() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_review_moderation_queue() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_review_moderation_queue() TO authenticated;

CREATE OR REPLACE FUNCTION public.moderate_review(
  p_review_id uuid,
  p_moderation_status text,
  p_dispute_status text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.user_id = auth.uid()
      AND au.role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF p_moderation_status NOT IN ('published', 'rejected', 'removed') THEN
    RAISE EXCEPTION 'Invalid moderation status';
  END IF;

  IF p_dispute_status IS NOT NULL
     AND p_dispute_status NOT IN ('reviewing', 'resolved', 'dismissed') THEN
    RAISE EXCEPTION 'Invalid dispute status';
  END IF;

  UPDATE public.reviews
  SET
    moderation_status = p_moderation_status,
    moderated_at = now(),
    moderated_by = auth.uid(),
    dispute_status = CASE
      WHEN p_dispute_status IS NOT NULL THEN p_dispute_status
      ELSE dispute_status
    END
  WHERE id = p_review_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Review not found';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.moderate_review(uuid, text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.moderate_review(uuid, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.moderate_review(uuid, text, text) TO authenticated;