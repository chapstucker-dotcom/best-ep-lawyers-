export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firmName, email, phone, website, address, plan } = req.body || {};

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || "chapstucker@gmail.com";

  if (!apiKey) {
    return res.status(500).json({ error: "Missing RESEND_API_KEY" });
  }

  const message = `
New firm listing submitted:

Firm: ${firmName || ""}
Email: ${email || ""}
Phone: ${phone || ""}
Website: ${website || ""}
Address: ${address || ""}
Plan: ${plan || ""}
`;

  const adminResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "El Paso's Best Lawyers <onboarding@resend.dev>",
      to: adminEmail,
      subject: "New Law Firm Listing Submitted",
      text: message,
    }),
  });

  if (!adminResponse.ok) {
    const error = await adminResponse.text();
    return res.status(500).json({ error });
  }

  return res.status(200).json({ success: true });
}