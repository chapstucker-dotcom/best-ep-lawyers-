-- EPBL targeted production hardening.
-- Review and dry-run before applying.
BEGIN;

-- Preserve automatic rating recalculation with controlled privileges.
ALTER FUNCTION public.recalculate_firm_rating(text)
  SECURITY DEFINER;

ALTER FUNCTION public.recalculate_firm_rating(text)
  SET search_path = pg_catalog;

ALTER FUNCTION public.reviews_recalc_firm_rating()
  SECURITY DEFINER;

ALTER FUNCTION public.reviews_recalc_firm_rating()
  SET search_path = pg_catalog;

REVOKE EXECUTE ON FUNCTION public.recalculate_firm_rating(text)
  FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.reviews_recalc_firm_rating()
  FROM PUBLIC, anon, authenticated;

-- Remove broad browser privileges without affecting service_role.
REVOKE ALL PRIVILEGES ON TABLE public.firms
  FROM anon, authenticated;

-- Allow reading non-Stripe firm columns.
DO $do$
DECLARE
  columns_to_grant text;
BEGIN
  SELECT string_agg(
    format('%I', column_name),
    ', ' ORDER BY ordinal_position
  )
  INTO columns_to_grant
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'firms'
    AND column_name NOT IN (
      'stripe_customer_id',
      'stripe_subscription_id'
    );

  IF columns_to_grant IS NULL THEN
    RAISE EXCEPTION 'public.firms columns not found';
  END IF;

  EXECUTE format(
    'GRANT SELECT (%s) ON TABLE public.firms TO anon, authenticated',
    columns_to_grant
  );
END
$do$;

-- Registration: permitted owner and profile fields.
GRANT INSERT (
  user_id, name, slug, description, phone, email, website,
  address, city, state, zip, zip_code, bio, category,
  logo_url, practice_areas, image_url, banner_url,
  primary_category, specialties, years_experience,
  consultation_free, accepts_payment_plans, languages,
  team_size, consultation_fee, office_hours,
  awards, google_maps_url, gallery_urls,
  facebook_url, linkedin_url, twitter_url, instagram_url
) ON TABLE public.firms TO authenticated;

-- Existing owners: non-commercial profile edits only.
GRANT UPDATE (
  name, description, phone, email, website,
  address, city, state, zip, zip_code, bio, logo_url,
  image_url, banner_url, specialties, years_experience,
  consultation_free, accepts_payment_plans, languages,
  team_size, consultation_fee, office_hours,
  awards, google_maps_url, gallery_urls,
  facebook_url, linkedin_url, twitter_url, instagram_url
) ON TABLE public.firms TO authenticated;

-- Subscriptions: browser read access only, subject to existing RLS.
REVOKE ALL PRIVILEGES ON TABLE public.subscriptions
  FROM anon, authenticated;

GRANT SELECT ON TABLE public.subscriptions TO authenticated;

-- Abort if sensitive privileges remain accessible.
DO $do$
BEGIN
  IF has_column_privilege(
       'anon', 'public.firms', 'stripe_customer_id', 'SELECT'
     )
     OR has_column_privilege(
       'authenticated', 'public.firms',
       'stripe_subscription_id', 'SELECT'
     )
     OR has_column_privilege(
       'authenticated', 'public.firms', 'plan', 'UPDATE'
     )
     OR has_column_privilege(
       'authenticated', 'public.firms', 'rating_avg', 'UPDATE'
     )
     OR has_table_privilege(
       'authenticated', 'public.subscriptions', 'INSERT'
     )
     OR has_table_privilege(
       'authenticated', 'public.subscriptions', 'UPDATE'
     )
  THEN
    RAISE EXCEPTION 'EPBL privilege assertions failed';
  END IF;
END
$do$;

COMMIT;
