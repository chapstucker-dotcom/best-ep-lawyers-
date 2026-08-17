import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const {
      fullName,
      email,
      phone,
      legalIssue,
      firmId,
      firmName,
      firmEmail,
      practiceArea,
      sourceUrl,
    } = req.body ?? {};

    if (!fullName || !email || !phone || !legalIssue) {
      return res.status(400).json({
        success: false,
        error: "Missing required lead information",
      });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured.");

      return res.status(500).json({
        success: false,
        error: "Email service is not configured",
      });
    }

    const area =
      practiceArea?.trim() || "General Legal Inquiry";

    const viewedFirm =
      firmName?.trim() || "No specific firm selected";

    /*
     * ADMIN NOTIFICATION
     *
     * The lead comes to El Paso's Best Lawyers.
     * It is NOT automatically forwarded to the law firm.
     */
    const { error: adminEmailError } =
      await resend.emails.send({
        from:
          "El Paso's Best Lawyers <onboarding@resend.dev>",

        to: ["support@elpasosbestlawyers.com"],

        replyTo: email,

        subject: `NEW LEAD | ${area} | ${fullName}`,

        html: `
          <div style="
            font-family:Arial,sans-serif;
            max-width:720px;
            margin:0 auto;
            color:#172033;
          ">
            <div style="
              background:#071b36;
              color:#ffffff;
              padding:24px;
              border-radius:10px 10px 0 0;
            ">
              <h1 style="
                margin:0;
                font-size:24px;
              ">
                New El Paso's Best Lawyers Lead
              </h1>

              <p style="
                margin:8px 0 0;
                color:#d6e2f0;
              ">
                Consumer consultation request captured by the platform.
              </p>
            </div>

            <div style="
              border:1px solid #d9e0e8;
              border-top:0;
              padding:24px;
              border-radius:0 0 10px 10px;
            ">

              <h2>Consumer</h2>

              <table
                cellpadding="7"
                cellspacing="0"
                style="width:100%;border-collapse:collapse;"
              >
                <tr>
                  <td><strong>Name</strong></td>
                  <td>${escapeHtml(fullName)}</td>
                </tr>

                <tr>
                  <td><strong>Email</strong></td>
                  <td>${escapeHtml(email)}</td>
                </tr>

                <tr>
                  <td><strong>Phone</strong></td>
                  <td>${escapeHtml(phone)}</td>
                </tr>

                <tr>
                  <td><strong>Practice Area</strong></td>
                  <td>${escapeHtml(area)}</td>
                </tr>
              </table>

              <h2 style="margin-top:28px;">
                Lead Source
              </h2>

              <table
                cellpadding="7"
                cellspacing="0"
                style="width:100%;border-collapse:collapse;"
              >
                <tr>
                  <td><strong>Firm Viewed</strong></td>
                  <td>${escapeHtml(viewedFirm)}</td>
                </tr>

                <tr>
                  <td><strong>Firm ID</strong></td>
                  <td>${escapeHtml(firmId || "N/A")}</td>
                </tr>

                <tr>
                  <td><strong>Firm Email</strong></td>
                  <td>${escapeHtml(firmEmail || "N/A")}</td>
                </tr>

                <tr>
                  <td><strong>Source Page</strong></td>
                  <td>${escapeHtml(sourceUrl || "Not provided")}</td>
                </tr>
              </table>

              <h2 style="margin-top:28px;">
                Legal Matter
              </h2>

              <div style="
                background:#f5f7fa;
                padding:16px;
                border-radius:8px;
                white-space:pre-wrap;
              ">${escapeHtml(legalIssue)}</div>

              <div style="
                margin-top:26px;
                padding:14px;
                background:#fff8df;
                border:1px solid #ead58a;
                border-radius:8px;
                font-size:13px;
              ">
                <strong>Platform lead:</strong>
                This inquiry was captured by El Paso's Best Lawyers.
                It has NOT automatically been forwarded to
                ${escapeHtml(viewedFirm)}.
              </div>
            </div>
          </div>
        `,
      });

    if (adminEmailError) {
      console.error(
        "Admin lead notification failed:",
        adminEmailError
      );

      return res.status(500).json({
        success: false,
        error: "Lead email notification failed",
      });
    }

    /*
     * CONSUMER ACKNOWLEDGEMENT
     *
     * This confirms receipt without telling the consumer
     * that the selected firm has received the inquiry.
     */
    const { error: consumerEmailError } =
      await resend.emails.send({
        from:
          "El Paso's Best Lawyers <onboarding@resend.dev>",

        to: [email],

        subject:
          "We Received Your Consultation Request",

        html: `
          <div style="
            font-family:Arial,sans-serif;
            max-width:650px;
            margin:0 auto;
            color:#172033;
          ">
            <h2>
              We received your request
            </h2>

            <p>
              Hi ${escapeHtml(fullName)},
            </p>

            <p>
              Your consultation request was submitted
              through <strong>El Paso's Best Lawyers</strong>.
            </p>

            <p>
              Your request relates to:
              <strong>${escapeHtml(area)}</strong>.
            </p>

            ${
              firmName
                ? `
                  <p>
                    You were viewing
                    <strong>${escapeHtml(firmName)}</strong>
                    when the request was submitted.
                  </p>
                `
                : ""
            }

            <p>
              Submission does not create an
              attorney-client relationship and does not
              guarantee representation.
            </p>

            <p>
              Please avoid sending additional confidential
              or highly sensitive information until you
              have established an attorney-client
              relationship with a lawyer.
            </p>

            <p>
              El Paso's Best Lawyers
            </p>
          </div>
        `,
      });

    /*
     * The lead itself is already stored in Supabase.
     * A failure of the consumer acknowledgement should
     * not lose the lead.
     */
    if (consumerEmailError) {
      console.warn(
        "Consumer acknowledgement failed:",
        consumerEmailError
      );
    }

    return res.status(200).json({
      success: true,
      capturedBy:
        "El Paso's Best Lawyers",
      routedToFirm: false,
    });
  } catch (err: any) {
    console.error("Lead endpoint error:", err);

    return res.status(500).json({
      success: false,
      error:
        err?.message ||
        "Unable to process lead",
    });
  }
}