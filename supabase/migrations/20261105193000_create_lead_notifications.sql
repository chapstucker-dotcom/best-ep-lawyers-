-- EPBL: mirror the notification audit table created in production on 2026-11-05.
-- Safe to apply again to an environment with the same existing table.
CREATE TABLE IF NOT EXISTS public.lead_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  recipient_type text NOT NULL CHECK (recipient_type IN ('admin','firm','consumer')),
  recipient_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sending','accepted','delivered','failed','bounced')),
  provider_message_id text,
  attempt_count integer NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_attempt_at timestamptz,
  UNIQUE (lead_id, recipient_type, recipient_email)
);
CREATE INDEX IF NOT EXISTS lead_notifications_status_idx ON public.lead_notifications(status,created_at);
CREATE INDEX IF NOT EXISTS lead_notifications_lead_id_idx ON public.lead_notifications(lead_id);
ALTER TABLE public.lead_notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.lead_notifications FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.lead_notifications TO authenticated;
DROP POLICY IF EXISTS lead_notifications_superadmin_select ON public.lead_notifications;
CREATE POLICY lead_notifications_superadmin_select ON public.lead_notifications
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.user_id = (SELECT auth.uid()) AND au.role = 'super_admin'));
