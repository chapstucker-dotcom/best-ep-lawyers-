import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const ADMIN_EMAIL =
  "support@elpasosbestlawyers.com";

const FROM_EMAIL =
  "El Paso's Best Lawyers <support@elpasosbestlawyers.com>";

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_INTERESTS = new Set([
  "Free Firm Listing",
  "Expert Plan",
  "Category Featured",
  "Category Exclusive",
  "Advertising / Sponsorship",
  "Not Sure Yet",
]);

function escapeHtml(
  value: unknown
): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cleanText(
  value: unknown,
  maxLength: number
): string {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

export default async function handler(
  req: any,
  res: any
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error(
      "RESEND_API_KEY is not configured."
    );

    return res.status(500).json({
      success: false,
      error:
        "Email service is not configured.",
    });
  }

  try {
    const {
      firmName,
      contactName,
      email,
      phone,
      website,
      interest,
      message,
      sourceUrl,
    } = req.body || {};

    const cleanFirmName =
      cleanText(firmName, 150);

    const cleanContactName =
      cleanText(contactName, 120);

    const cleanEmail =
      cleanText(email, 254);

    const cleanPhone =
      cleanText(phone, 40);

    const cleanWebsite =
      cleanText(website, 300);

    const cleanInterest =
      cleanText(interest, 100);

    const cleanMessage =
      cleanText(message, 1500);

    const cleanSourceUrl =
      cleanText(sourceUrl, 500);

    if (
      cleanFirmName.length < 2 ||
      cleanContactName.length < 2 ||
      !EMAIL_REGEX.test(cleanEmail) ||
      cleanPhone.length < 7 ||
      !ALLOWED_INTERESTS.has(
        cleanInterest
      )
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Please complete all required fields with valid information.",
      });
    }

    const safeFirmName =
      escapeHtml(cleanFirmName);

    const safeContactName =
      escapeHtml(cleanContactName);

    const safeEmail =
      escapeHtml(cleanEmail);

    const safePhone =
      escapeHtml(cleanPhone);

    const safeWebsite =
      escapeHtml(cleanWebsite);

    const safeInterest =
      escapeHtml(cleanInterest);

    const safeMessage =
      escapeHtml(cleanMessage);

    const safeSourceUrl =
      escapeHtml(cleanSourceUrl);

    const {
      error: adminEmailError,
    } = await resend.emails.send({
      from: FROM_EMAIL,

      to: [
        ADMIN_EMAIL,
      ],

      replyTo: cleanEmail,

      subject:
        `New Law Firm Advertising Inquiry | ${cleanFirmName}`,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 720px;
            margin: 0 auto;
            color: #172033;
          "
        >
          <div
            style="
              background: #071b36;
              color: #ffffff;
              padding: 24px;
              border-radius: 10px 10px 0 0;
            "
          >
            <h1
              style="
                margin: 0;
                font-size: 24px;
              "
            >
              New Law Firm Advertising Inquiry
            </h1>
          </div>

          <div
            style="
              border: 1px solid #d9e0e8;
              border-top: 0;
              padding: 24px;
              border-radius: 0 0 10px 10px;
            "
          >
            <p>
              <strong>Firm:</strong>
              ${safeFirmName}
            </p>

            <p>
              <strong>Contact:</strong>
              ${safeContactName}
            </p>

            <p>
              <strong>Email:</strong>
              ${safeEmail}
            </p>

            <p>
              <strong>Phone:</strong>
              ${safePhone}
            </p>

            <p>
              <strong>Website:</strong>
              ${
                safeWebsite ||
                "Not provided"
              }
            </p>

            <p>
              <strong>Interest:</strong>
              ${safeInterest}
            </p>

            ${
              safeSourceUrl
                ? `
                  <p>
                    <strong>Source:</strong>
                    ${safeSourceUrl}
                  </p>
                `
                : ""
            }

            <h3>
              Message
            </h3>

            <div
              style="
                background: #f5f7fa;
                padding: 16px;
                border-radius: 8px;
                white-space: pre-wrap;
              "
            >${
              safeMessage ||
              "No additional message provided."
            }</div>
          </div>
        </div>
      `,
    });

    if (adminEmailError) {
      console.error(
        "Business inquiry admin email failed:",
        adminEmailError
      );

      return res.status(500).json({
        success: false,
        error:
          "Your inquiry could not be submitted. Please try again.",
      });
    }

    const {
      error: confirmationEmailError,
    } = await resend.emails.send({
      from: FROM_EMAIL,

      to: [
        cleanEmail,
      ],

      subject:
        "We've Received Your Advertising Inquiry",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: 0 auto;
            color: #172033;
          "
        >
          <h2>
            Thank you, ${safeContactName}.
          </h2>

          <p>
            We received your inquiry regarding
            <strong>
              ${safeFirmName}
            </strong>.
          </p>

          <p>
            Your selected area of interest was
            <strong>
              ${safeInterest}
            </strong>.
          </p>

          <p>
            We will review your information
            and follow up regarding available
            listing, visibility, advertising,
            or sponsorship opportunities.
          </p>

          <p>
            Thank you for your interest in
            <strong>
              El Paso's Best Lawyers
            </strong>.
          </p>
        </div>
      `,
    });

    if (confirmationEmailError) {
      console.warn(
        "Business inquiry confirmation email failed:",
        confirmationEmailError
      );
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    console.error(
      "Business lead endpoint failed:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Your inquiry could not be submitted. Please try again.",
    });
  }
}