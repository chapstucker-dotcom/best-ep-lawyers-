import { Resend } from "resend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed." });
  const size = Number(req.headers?.["content-length"] || 0);
  if (size > 12000) return res.status(413).json({ success: false, error: "Request too large." });
  const body = req.body || {};
  if (typeof body !== "object" || Array.isArray(body)) return res.status(400).json({ success: false, error: "Invalid request." });
  if (body.website) return res.status(200).json({ success: true }); // Honeypot: do not send spam.
  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const organization = clean(body.organization, 150);
  const message = clean(body.message, 3000);
  if (!name || !EMAIL_REGEX.test(email) || message.length < 10 ||
      (typeof body.name === "string" && body.name.trim().length > 120) ||
      (typeof body.email === "string" && body.email.trim().length > 254) ||
      (typeof body.organization === "string" && body.organization.trim().length > 150) ||
      (typeof body.message === "string" && body.message.trim().length > 3000)) {
    return res.status(400).json({ success: false, error: "Please enter a valid name, email address, and message (at least 10 characters)." });
  }
  if (!process.env.RESEND_API_KEY) {
    console.error("Community resource contact: RESEND_API_KEY missing");
    return res.status(500).json({ success: false, error: "Email service is unavailable. Please try again later." });
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "El Paso's Best Lawyers <support@elpasosbestlawyers.com>",
      to: ["support@elpasosbestlawyers.com"],
      replyTo: email,
      subject: "Community Legal Resources Inquiry",
      html: `<h2>Community Legal Resources Inquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Organization:</strong> ${escapeHtml(organization || "Not provided")}</p><p><strong>Message:</strong></p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });
    if (error) {
      console.error("Community resource contact email failed:", error);
      return res.status(500).json({ success: false, error: "We could not send your inquiry. Please try again." });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Community resource contact endpoint failed:", error);
    return res.status(500).json({ success: false, error: "We could not send your inquiry. Please try again." });
  }
}
