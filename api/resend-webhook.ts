import { createClient } from "@supabase/supabase-js";

export const config = { api: { bodyParser: false } };
import { Resend } from "resend";

// Vercel Node function: read the original request bytes; never verify a reserialized JSON body.
type RequestLike = AsyncIterable<Uint8Array | string> & {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
};
type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
};

const header = (req: RequestLike, name: string): string => {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
};

const EVENT_STATUSES: Record<string, string> = {
  "email.delivered": "delivered",
  "email.bounced": "bounced",
  "email.failed": "failed",
};

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.RESEND_WEBHOOK_SECRET;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || !url || !key) {
    console.error("Resend webhook configuration missing");
    return res.status(503).json({ error: "Webhook unavailable" });
  }

  let payload = "";
  try {
    const chunks: Buffer[] = [];
    let length = 0;
    for await (const chunk of req) {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      length += bytes.length;
      if (length > 128 * 1024) return res.status(413).json({ error: "Payload too large" });
      chunks.push(bytes);
    }
    payload = Buffer.concat(chunks).toString("utf8");
  } catch {
    return res.status(400).json({ error: "Invalid request body" });
  }

  let event: unknown;
  try {
    event = new Resend("re_webhook_verification_only").webhooks.verify({
      payload,
      webhookSecret: secret,
      headers: {
        id: header(req, "svix-id"),
        timestamp: header(req, "svix-timestamp"),
        signature: header(req, "svix-signature"),
      },
    });
  } catch {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }

  if (!event || typeof event !== "object") {
    return res.status(400).json({ error: "Invalid webhook event" });
  }
  const record = event as { type?: unknown; data?: { email_id?: unknown } };
  const nextStatus = typeof record.type === "string" ? EVENT_STATUSES[record.type] : undefined;
  if (!nextStatus) return res.status(200).json({ received: true, ignored: true });
  const messageId = record.data?.email_id;
  if (typeof messageId !== "string" || !messageId.trim()) {
    return res.status(400).json({ error: "Missing email ID" });
  }

  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  // Never downgrade a delivered/bounced notification due to delayed provider events.
  const allowedPrevious = nextStatus === "delivered"
    ? ["accepted", "sending"]
    : nextStatus === "bounced"
      ? ["accepted", "delivered", "sending"]
      : ["accepted", "sending"];

  const { data: matches, error: lookupError } = await db
    .from("lead_notifications")
    .select("id,status")
    .eq("provider_message_id", messageId);

  if (lookupError) {
    console.error("Resend webhook lookup failed", lookupError);
    return res.status(503).json({ error: "Webhook processing failed" });
  }

  if (!matches?.length) {
    console.warn("Resend webhook: unmatched provider message ID");
    return res.status(503).json({ error: "Notification not found" });
  }

  const { error } = await db.from("lead_notifications")
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq("provider_message_id", messageId)
    .in("status", allowedPrevious);

  if (error) {
    console.error("Resend webhook database update failed", error);
    return res.status(503).json({ error: "Webhook processing failed" });
  }
  return res.status(200).json({ received: true });
}