import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const field = (value: unknown, max: number, required = false) => {
  if (value == null || value === "") return required ? null : "";
  if (typeof value !== "string" || value.trim().length > max) return null;
  const trimmed = value.trim();
  return required && !trimmed ? null : trimmed;
};

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed." });
  if (Number(req.headers?.["content-length"] || 0) > 12000) return res.status(413).json({ success: false, error: "Request too large." });
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) return res.status(400).json({ success: false, error: "Invalid request." });
  if (body.website) return res.status(200).json({ success: true }); // Honeypot.

  const name = field(body.name, 120, true);
  const email = field(body.email, 254, true);
  const organization = field(body.organization, 150, true);
  const title = field(body.title, 180, true);
  const details = field(body.details, 1800, true);
  const location = field(body.location, 180);
  const sourceUrl = field(body.source_url, 500);
  const type = body.submission_type;
  const eventDate = field(body.event_date, 10);
  if (!name || !email || !EMAIL_REGEX.test(email) || !organization || !title || !details || details.length < 10 ||
      location === null || sourceUrl === null || eventDate === null || !["Event", "Resource", "Program"].includes(type)) {
    return res.status(400).json({ success: false, error: "Please complete all required fields with valid information." });
  }
  if (sourceUrl) {
    try { const parsed = new URL(sourceUrl); if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("protocol"); }
    catch { return res.status(400).json({ success: false, error: "Enter a valid http or https source URL." }); }
  }
  if (type === "Event") {
    const dateValid = !!eventDate && /^\d{4}-\d{2}-\d{2}$/.test(eventDate) && !Number.isNaN(Date.parse(`${eventDate}T00:00:00Z`));
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Denver", year: "numeric", month: "2-digit", day: "2-digit" });
    if (!dateValid || eventDate! < today || !location) return res.status(400).json({ success: false, error: "Events require a current or future date and location." });
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Community submissions: Supabase server credentials missing");
    return res.status(503).json({ success: false, error: "Submission service is temporarily unavailable." });
  }
  try {
    const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
    const { error } = await supabase.from("community_submissions").insert({
      submission_type: type, contributor_name: name, contributor_email: email,
      organization, title, details, event_date: type === "Event" ? eventDate : null,
      location: location || null, source_url: sourceUrl || null, status: "pending",
    });
    if (error) {
      console.error("Community submissions: database insert failed", error);
      return res.status(500).json({ success: false, error: "We could not save your submission. Please try again." });
    }
  } catch (error) {
    console.error("Community submissions: database request failed", error);
    return res.status(500).json({ success: false, error: "We could not save your submission. Please try again." });
  }

  // Notification failure must not cause the contributor to resubmit a saved record.
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "El Paso's Best Lawyers <support@elpasosbestlawyers.com>",
        to: ["support@elpasosbestlawyers.com"], replyTo: email,
        subject: `Community submission pending review: ${type}`,
        html: `<h2>Community submission pending review</h2><p><strong>Type:</strong> ${escapeHtml(type)}</p><p><strong>Title:</strong> ${escapeHtml(title)}</p><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Organization:</strong> ${escapeHtml(organization)}</p><p><strong>Date:</strong> ${escapeHtml(eventDate || "N/A")}</p><p><strong>Location:</strong> ${escapeHtml(location || "N/A")}</p><p><strong>Source:</strong> ${escapeHtml(sourceUrl || "N/A")}</p><p style="white-space:pre-wrap">${escapeHtml(details)}</p><p>Review in the admin dashboard.</p>`,
      });
      if (error) console.error("Community submissions: notification failed", error);
    } catch (error) { console.error("Community submissions: notification request failed", error); }
  } else console.error("Community submissions: RESEND_API_KEY missing; saved without notification");
  return res.status(200).json({ success: true });
}
