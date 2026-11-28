BEGIN;

ALTER TABLE public.firm_plan_change_requests
ADD COLUMN resolved_by uuid;

CREATE FUNCTION public.apply_free_plan_change(
    p_request_id uuid,
    p_billing_confirmed boolean
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
    v_admin uuid := auth.uid();
    v_firm_id text;
    v_firm public.firms%ROWTYPE;
    v_request public.firm_plan_change_requests%ROWTYPE;
    v_current_plan text;
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

    IF p_billing_confirmed IS DISTINCT FROM true THEN
        RAISE EXCEPTION 'Billing obligations must be resolved first';
    END IF;

    SELECT firm_id INTO v_firm_id
    FROM public.firm_plan_change_requests
    WHERE id = p_request_id
      AND status = 'pending'
      AND requested_plan = 'free';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pending Free request not found';
    END IF;

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
      AND requested_plan = 'free'
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

    UPDATE public.firms
    SET
        plan = 'free',
        plan_key = 'free',
        payment_status = 'unpaid',
        is_featured = false,
        is_exclusive = false
    WHERE id = v_firm.id;

    UPDATE public.firm_plan_change_requests
    SET
        status = 'completed',
        resolved_at = now(),
        resolved_by = v_admin
    WHERE id = p_request_id;

    RETURN p_request_id;
END;
$function$;

REVOKE ALL ON FUNCTION
    public.apply_free_plan_change(uuid, boolean)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
    public.apply_free_plan_change(uuid, boolean)
TO authenticated;

COMMIT;