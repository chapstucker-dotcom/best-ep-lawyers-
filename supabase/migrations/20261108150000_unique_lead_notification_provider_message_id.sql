-- Ensure each Resend message ID identifies at most one lead notification.
-- PostgreSQL permits multiple NULL values for messages not yet accepted.
CREATE UNIQUE INDEX IF NOT EXISTS lead_notifications_provider_message_id_unique_idx
ON public.lead_notifications (provider_message_id)
WHERE provider_message_id IS NOT NULL;