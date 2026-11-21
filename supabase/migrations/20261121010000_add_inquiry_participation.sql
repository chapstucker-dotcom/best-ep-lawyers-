BEGIN;

ALTER TABLE public.firms
    ADD COLUMN IF NOT EXISTS inquiry_enabled boolean
    NOT NULL DEFAULT false;

ALTER TABLE public.firms
    ADD COLUMN IF NOT EXISTS inquiry_verified_at timestamptz;

ALTER TABLE public.firms
    ADD CONSTRAINT firms_inquiry_verification_required
    CHECK (
        inquiry_enabled = false
        OR inquiry_verified_at IS NOT NULL
    );

REVOKE INSERT (
    inquiry_enabled,
    inquiry_verified_at
) ON public.firms FROM anon, authenticated;

REVOKE UPDATE (
    inquiry_enabled,
    inquiry_verified_at
) ON public.firms FROM anon, authenticated;

COMMIT;
