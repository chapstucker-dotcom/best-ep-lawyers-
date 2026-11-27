BEGIN;

CREATE TABLE public.stripe_checkout_attempts (
    firm_id text PRIMARY KEY
        REFERENCES public.firms(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    attempt_id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    stripe_session_id text UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stripe_checkout_attempts
    ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.stripe_checkout_attempts
    FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE
    ON TABLE public.stripe_checkout_attempts
    TO service_role;

COMMIT;