BEGIN;

ALTER TABLE public.firm_plan_change_requests
    ADD COLUMN payment_reference text,
    ADD COLUMN payment_amount_cents integer,
    ADD COLUMN payment_confirmed_at timestamptz;

CREATE UNIQUE INDEX firm_plan_change_payment_reference_unique
ON public.firm_plan_change_requests (
    lower(trim(payment_reference))
)
WHERE payment_reference IS NOT NULL;

CREATE FUNCTION public.apply_paid_plan_change(
    p_request_id uuid,
    p_payment_reference text,
    p_payment_amount_cents integer,
    p_payment_confirmed boolean
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
    v_admin uuid := auth.uid();
    v_firm public.firms%ROWTYPE;
    v_request public.firm_plan_change_requests%ROWTYPE;
    v_firm_id text;
    v_current_plan text;
    v_market text;
    v_expected_amount integer;
    v_featured_market integer;
    v_featured_total integer;

    v_markets text[] := ARRAY[
        'personal injury',
        'criminal defense',
        'family law',
        'immigration',
        'employment',
        'estate planning & probate',
        'business & corporate',
        'real estate & construction',
        'bankruptcy & finance',
        'civil litigation'
    ];
BEGIN
    IF v_admin IS NULL OR NOT EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE user_id = v_admin
          AND role = 'super_admin'
    ) THEN
        RAISE EXCEPTION 'Administrator access required'
            USING ERRCODE = '42501';
    END IF;

    IF p_payment_confirmed IS DISTINCT FROM true
       OR p_payment_reference IS NULL
       OR length(trim(p_payment_reference)) < 5
       OR length(trim(p_payment_reference)) > 200
    THEN
        RAISE EXCEPTION 'Confirmed payment reference required';
    END IF;

    SELECT firm_id INTO v_firm_id
    FROM public.firm_plan_change_requests
    WHERE id = p_request_id
      AND status = 'pending'
      AND requested_plan IN ('expert', 'category-featured');

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pending paid membership request not found';
    END IF;

    PERFORM set_config('lock_timeout', '5s', true);

    LOCK TABLE public.firms
        IN SHARE ROW EXCLUSIVE MODE;

    SELECT * INTO v_firm
    FROM public.firms
    WHERE id = v_firm_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Firm not found';
    END IF;

    SELECT * INTO v_request
    FROM public.firm_plan_change_requests
    WHERE id = p_request_id
      AND firm_id = v_firm_id
      AND status = 'pending'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request is no longer pending';
    END IF;

    IF v_firm.user_id IS NULL
       OR v_firm.user_id IS DISTINCT FROM v_request.requested_by
    THEN
        RAISE EXCEPTION 'Firm ownership has changed';
    END IF;

    IF v_firm.stripe_customer_id IS NOT NULL
       OR v_firm.stripe_subscription_id IS NOT NULL
    THEN
        RAISE EXCEPTION
            'Stripe-linked membership requires billing reconciliation';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.stripe_checkout_attempts
        WHERE firm_id = v_firm.id
    ) THEN
        RAISE EXCEPTION
            'Existing checkout reservation requires review';
    END IF;

    v_current_plan := replace(
        lower(trim(coalesce(
            nullif(v_firm.plan_key, ''),
            nullif(v_firm.plan, ''),
            'free'
        ))),
        '_', '-'
    );

    IF v_current_plan = 'basic' THEN
        v_current_plan := 'free';
    END IF;

    IF v_current_plan IS DISTINCT FROM v_request.current_plan THEN
        RAISE EXCEPTION 'Membership changed after request submission';
    END IF;

    IF v_request.requested_plan = 'expert' THEN
        v_expected_amount := 29900;
    ELSIF v_request.requested_plan = 'category-featured' THEN
        v_expected_amount := 200000;
    ELSE
        RAISE EXCEPTION 'Unsupported membership request';
    END IF;

    IF p_payment_amount_cents IS DISTINCT FROM v_expected_amount THEN
        RAISE EXCEPTION 'Payment amount does not match requested plan';
    END IF;

    IF v_request.requested_plan = 'category-featured' THEN

        v_market := lower(trim(coalesce(
            nullif(v_firm.primary_category, ''),
            v_firm.category,
            ''
        )));

        IF NOT (v_market = ANY(v_markets)) THEN
            RAISE EXCEPTION 'Legal market requires verification';
        END IF;

        IF v_market IS DISTINCT FROM
            lower(trim(v_request.legal_market))
        THEN
            RAISE EXCEPTION 'Legal market changed after submission';
        END IF;

        IF EXISTS (
            SELECT 1
            FROM public.firms f
            WHERE f.id <> v_firm.id
              AND f.is_active IS DISTINCT FROM false
              AND (
                  f.is_featured IS TRUE
                  OR f.is_exclusive IS TRUE
                  OR replace(
                      lower(coalesce(f.plan_key, f.plan, '')),
                      '_', '-'
                  ) IN (
                      'category-featured',
                      'category-exclusive',
                      'market-exclusive',
                      'featured',
                      'premier'
                  )
              )
              AND NOT (
                  lower(trim(coalesce(
                      nullif(f.primary_category, ''),
                      f.category,
                      ''
                  ))) = ANY(v_markets)
              )
        ) THEN
            RAISE EXCEPTION
                'Existing premium inventory requires market reconciliation';
        END IF;

        IF EXISTS (
            SELECT 1
            FROM public.firms f
            WHERE f.id <> v_firm.id
              AND f.is_active IS DISTINCT FROM false
              AND lower(trim(coalesce(
                  nullif(f.primary_category, ''),
                  f.category,
                  ''
              ))) = v_market
              AND (
                  f.is_exclusive IS TRUE
                  OR replace(
                      lower(coalesce(f.plan_key, f.plan, '')),
                      '_', '-'
                  ) IN (
                      'category-exclusive',
                      'market-exclusive'
                  )
              )
        ) THEN
            RAISE EXCEPTION
                'This market has an existing Exclusive placement';
        END IF;

        SELECT
            count(*) FILTER (
                WHERE lower(trim(coalesce(
                    nullif(f.primary_category, ''),
                    f.category,
                    ''
                ))) = v_market
            ),
            count(*)
        INTO v_featured_market, v_featured_total
        FROM public.firms f
        WHERE f.id <> v_firm.id
          AND f.is_active IS DISTINCT FROM false
          AND (
              f.is_featured IS TRUE
              OR replace(
                  lower(coalesce(f.plan_key, f.plan, '')),
                  '_', '-'
              ) IN ('category-featured', 'featured')
          );

        IF v_featured_market >= 2 THEN
            RAISE EXCEPTION
                'Featured market inventory is sold out';
        END IF;

        IF v_featured_total >= 10 THEN
            RAISE EXCEPTION
                'Maximum Featured memberships reached';
        END IF;
    END IF;

    UPDATE public.firms
    SET
        plan = v_request.requested_plan,
        plan_key = v_request.requested_plan,
        payment_status = 'paid',
        is_featured =
            (v_request.requested_plan = 'category-featured'),
        is_exclusive = false
    WHERE id = v_firm.id;

    UPDATE public.firm_plan_change_requests
    SET
        status = 'completed',
        resolved_at = now(),
        resolved_by = v_admin,
        payment_reference = trim(p_payment_reference),
        payment_amount_cents = p_payment_amount_cents,
        payment_confirmed_at = now()
    WHERE id = p_request_id;

    RETURN p_request_id;
END;
$function$;

REVOKE ALL ON FUNCTION
    public.apply_paid_plan_change(uuid, text, integer, boolean)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
    public.apply_paid_plan_change(uuid, text, integer, boolean)
TO authenticated;

COMMIT;