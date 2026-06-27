import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      firmName,
      contactName,
      email,
      phone,
      website,
      address,
      city,
      state,
      plan
    } = req.body;

    // Email to Admin
    await resend.emails.send({
      from: "El Paso's Best Lawyers <onboarding@resend.dev>",
      to: "chapstucker@gmail.com",
      subject: "New Law Firm Listing Submitted",
      html: `
      <h2>New Law Firm Listing</h2>

      <table cellpadding="8">
      <tr><td><b>Firm</b></td><td>${firmName}</td></tr>
      <tr><td><b>Contact</b></td><td>${contactName}</td></tr>
      <tr><td><b>Email</b></td><td>${email}</td></tr>
      <tr><td><b>Phone</b></td><td>${phone}</td></tr>
      <tr><td><b>Website</b></td><td>${website}</td></tr>
      <tr><td><b>Address</b></td><td>${address}</td></tr>
      <tr><td><b>City</b></td><td>${city}</td></tr>
      <tr><td><b>State</b></td><td>${state}</td></tr>
      <tr><td><b>Plan</b></td><td>${plan}</td></tr>
      </table>
      `
    });

    // Confirmation Email
    await resend.emails.send({
      from: "El Paso's Best Lawyers <onboarding@resend.dev>",
      to: email,
      subject: "We've Received Your Listing",
      html: `
      <h2>Thank You!</h2>

      <p>Your listing for <strong>${firmName}</strong> has been received.</p>

      <p>Our team will review it shortly.</p>

      <p>
      Thank you for choosing
      <strong>El Paso's Best Lawyers</strong>.
      </p>
      `
    });

    return res.status(200).json({
      success: true
    });

  } catch (err: any) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
}