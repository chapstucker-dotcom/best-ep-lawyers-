BEGIN;

ALTER TABLE public.stripe_webhook_events
    ADD COLUMN processing_token uuid,
    ADD COLUMN processing_started_at timestamptz;

CREATE FUNCTION public.claim_stripe_webhook_event(
    p_event_id text,
    p_event_type text,
    p_payload jsonb,
    p_claim_token uuid
)
RETURNS text
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog
AS $function$
DECLARE
    affected_rows integer;
    existing_status text;
BEGIN
    IF p_payload->>'livemode' IS DISTINCT FROM 'true' THEN
        RAISE EXCEPTION 'Non-live Stripe event';
    END IF;

    INSERT INTO public.stripe_webhook_events AS w (
        stripe_event_id,
        event_type,
        payload,
        status,
        processing_token,
        processing_started_at
    )
    VALUES (
        p_event_id,
        p_event_type,
        p_payload,
        'processing',
        p_claim_token,
        now()
    )
    ON CONFLICT (stripe_event_id)
    DO UPDATE SET
        event_type = EXCLUDED.event_type,
        payload = EXCLUDED.payload,
        status = 'processing',
        processing_token = EXCLUDED.processing_token,
        processing_started_at = now(),
        processed_at = NULL
    WHERE w.status <> 'succeeded'
      AND (
        w.status <> 'processing'
        OR w.processing_started_at IS NULL
        OR w.processing_started_at <
            now() - interval '15 minutes'
      );

    GET DIAGNOSTICS affected_rows = ROW_COUNT;

    IF affected_rows = 1 THEN
        RETURN 'claimed';
    END IF;

    SELECT status INTO existing_status
    FROM public.stripe_webhook_events
    WHERE stripe_event_id = p_event_id;

    IF existing_status = 'succeeded' THEN
        RETURN 'duplicate';
    END IF;

    RETURN 'busy';
END;
$function$;

REVOKE ALL ON FUNCTION
    public.claim_stripe_webhook_event(text, text, jsonb, uuid)
    FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
    public.claim_stripe_webhook_event(text, text, jsonb, uuid)
    TO service_role;

COMMIT;