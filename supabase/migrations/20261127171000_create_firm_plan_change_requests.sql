BEGIN;

CREATE TABLE public.firm_plan_change_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id text NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
    requested_by uuid NOT NULL,
    current_plan text NOT NULL,
    requested_plan text NOT NULL CHECK (
        requested_plan IN ('free', 'expert', 'category-featured')
    ),
    legal_market text,
    status text NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'completed', 'declined', 'cancelled')
    ),
    created_at timestamptz NOT NULL DEFAULT now(),
    resolved_at timestamptz
);

CREATE UNIQUE INDEX firm_plan_change_one_pending
ON public.firm_plan_change_requests (firm_id)
WHERE status = 'pending';

ALTER TABLE public.firm_plan_change_requests ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.firm_plan_change_requests
FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE
ON public.firm_plan_change_requests TO service_role;

CREATE FUNCTION public.request_firm_plan_change(
    p_firm_id text,
    p_requested_plan text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
    v_user uuid := auth.uid();
    v_firm public.firms%ROWTYPE;
    v_current_plan text;
    v_request_id uuid;
    v_pending_plan text;
BEGIN
    IF v_user IS NULL
       OR p_requested_plan IS NULL
       OR p_requested_plan NOT IN ('free', 'expert', 'category-featured')
    THEN
        RAISE EXCEPTION 'Invalid plan change request';
    END IF;

    SELECT * INTO v_firm
    FROM public.firms
    WHERE id = p_firm_id AND user_id = v_user
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Firm ownership could not be verified'
            USING ERRCODE = '42501';
    END IF;

    v_current_plan := replace(
        lower(trim(coalesce(
            nullif(v_firm.plan_key, ''),
            nullif(v_firm.plan, ''),
            'free'
        ))), '_', '-'
    );

    IF v_current_plan = 'basic' THEN
        v_current_plan := 'free';
    END IF;

    IF v_current_plan = p_requested_plan THEN
        RAISE EXCEPTION 'This is already your current plan';
    END IF;

    SELECT id, requested_plan
    INTO v_request_id, v_pending_plan
    FROM public.firm_plan_change_requests
    WHERE firm_id = p_firm_id AND status = 'pending';

    IF FOUND THEN
        IF v_pending_plan = p_requested_plan THEN
            RETURN v_request_id;
        END IF;
        RAISE EXCEPTION 'Your firm already has a pending plan change';
    END IF;

    INSERT INTO public.firm_plan_change_requests (
        firm_id, requested_by, current_plan,
        requested_plan, legal_market
    )
    VALUES (
        p_firm_id, v_user, v_current_plan,
        p_requested_plan,
        coalesce(nullif(v_firm.primary_category, ''), v_firm.category)
    )
    RETURNING id INTO v_request_id;

    RETURN v_request_id;
END;
$function$;

CREATE FUNCTION public.get_firm_plan_change_requests(
    p_firm_id text DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    firm_id text,
    firm_name text,
    current_plan text,
    requested_plan text,
    legal_market text,
    status text,
    created_at timestamptz,
    resolved_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
    SELECT r.id, r.firm_id, f.name, r.current_plan,
           r.requested_plan, r.legal_market, r.status,
           r.created_at, r.resolved_at
    FROM public.firm_plan_change_requests r
    JOIN public.firms f ON f.id = r.firm_id
    WHERE auth.uid() IS NOT NULL
      AND (
        (
            p_firm_id IS NOT NULL
            AND f.id = p_firm_id
            AND f.user_id = auth.uid()
            AND r.requested_by = auth.uid()
        )
        OR (
            p_firm_id IS NULL
            AND EXISTS (
                SELECT 1 FROM public.admin_users a
                WHERE a.user_id = auth.uid()
                  AND a.role = 'super_admin'
            )
        )
      )
    ORDER BY (r.status = 'pending') DESC, r.created_at DESC
    LIMIT 100;
$function$;

CREATE FUNCTION public.resolve_firm_plan_change_request(
    p_request_id uuid,
    p_status text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
    v_user uuid := auth.uid();
    v_admin boolean;
    v_result uuid;
BEGIN
    IF v_user IS NULL
       OR p_status IS NULL
       OR p_status NOT IN ('cancelled', 'declined', 'completed')
    THEN
        RAISE EXCEPTION 'Invalid request action';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.admin_users a
        WHERE a.user_id = v_user AND a.role = 'super_admin'
    ) INTO v_admin;

    UPDATE public.firm_plan_change_requests r
    SET status = p_status, resolved_at = now()
    FROM public.firms f
    WHERE r.id = p_request_id
      AND f.id = r.firm_id
      AND r.status = 'pending'
      AND (
        (
            p_status = 'cancelled'
            AND f.user_id = v_user
            AND r.requested_by = v_user
        )
        OR (v_admin AND p_status = 'declined')
        OR (
            v_admin
            AND p_status = 'completed'
            AND replace(
                lower(trim(coalesce(
                    nullif(f.plan_key, ''),
                    nullif(f.plan, ''),
                    'free'
                ))), '_', '-'
            ) = r.requested_plan
        )
      )
    RETURNING r.id INTO v_result;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'Request unavailable or membership change not confirmed'
            USING ERRCODE = '42501';
    END IF;

    RETURN v_result;
END;
$function$;

REVOKE ALL ON FUNCTION
    public.request_firm_plan_change(text,text),
    public.get_firm_plan_change_requests(text),
    public.resolve_firm_plan_change_request(uuid,text)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
    public.request_firm_plan_change(text,text),
    public.get_firm_plan_change_requests(text),
    public.resolve_firm_plan_change_request(uuid,text)
TO authenticated;

COMMIT;