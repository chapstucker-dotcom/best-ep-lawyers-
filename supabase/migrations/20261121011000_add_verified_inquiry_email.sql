BEGIN;

ALTER TABLE public.firms
    ADD COLUMN IF NOT EXISTS inquiry_email text;

ALTER TABLE public.firms
    ADD CONSTRAINT firms_verified_inquiry_email_required
    CHECK (
        inquiry_enabled = false
        OR (
            inquiry_email IS NOT NULL
            AND length(trim(inquiry_email)) > 0
        )
    );

REVOKE SELECT (inquiry_email)
    ON public.firms FROM anon, authenticated;

REVOKE INSERT (inquiry_email)
    ON public.firms FROM anon, authenticated;

REVOKE UPDATE (inquiry_email)
    ON public.firms FROM anon, authenticated;

COMMIT;
