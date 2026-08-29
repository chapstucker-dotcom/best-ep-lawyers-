import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "support@elpasosbestlawyers.com";

const FROM_EMAIL =
  "El Paso's Best Lawyers <support@elpasosbestlawyers.com>";

type FirmRow = {
  id: string | number;
  name?: string | null;
  email?: string | null;

  plan?: string | null;
  plan_key?: string | null;

  primary_category?: string | null;
  practice_areas?: string[] | null;

  // Legacy compatibility fields.
  category?: string | null;
  categories?: string[] | null;
  specialties?: string[] | null;

  is_active?: boolean | null;
};

type RoutedFirm = {
  id: string;
  name: string;
  email: string;
  planKey: string;
  priority: number;
};

const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const normalize = (value: unknown): string =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const normalizePlanKey = (
  value: unknown
): string =>
  String(value ?? "free")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const getPlanPriority = (
  value: unknown
): number => {
  const plan = normalizePlanKey(value);

  if (
    plan === "category_exclusive" ||
    plan === "exclusive"
  ) {
    return 1;
  }

  if (
    plan === "category_featured" ||
    plan === "featured"
  ) {
    return 2;
  }

  if (
    plan === "expert" ||
    plan === "pro"
  ) {
    return 3;
  }

  return 4;
};

const planIncludesLeadRouting = (
  value: unknown
): boolean => getPlanPriority(value) <= 3;

const getSupabaseServerClient = () => {
  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.VITE_database_URL;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_database_ANON_KEY;

  if (!url || !key) {
    console.warn(
      "Supabase server credentials are not configured."
    );

    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

const getFirmPracticeText = (
  firm: FirmRow,
  planValue?: unknown
): string => {
  const values: string[] = [];
  const planKey = normalizePlanKey(
    planValue ??
      firm.plan_key ??
      firm.plan ??
      "free"
  );

  const isCategoryPremium =
    planKey === "category_exclusive" ||
    planKey === "exclusive" ||
    planKey === "category_featured" ||
    planKey === "featured";

  /*
   * Category Featured / Category Exclusive routing applies ONLY
   * to the firm's purchased primary category.
   */
  if (isCategoryPremium) {
    if (firm.primary_category) {
      values.push(firm.primary_category);
    } else if (firm.category) {
      // Legacy fallback for older records.
      values.push(firm.category);
    }

    return normalize(values.join(" "));
  }

  /*
   * Expert routing may use the firm's broader practice-area profile.
   */
  if (firm.primary_category) {
    values.push(firm.primary_category);
  }

  if (Array.isArray(firm.practice_areas)) {
    values.push(...firm.practice_areas);
  }

  if (firm.category) {
    values.push(firm.category);
  }

  if (Array.isArray(firm.categories)) {
    values.push(...firm.categories);
  }

  if (Array.isArray(firm.specialties)) {
    values.push(...firm.specialties);
  }

  return normalize(values.join(" "));
};

const practiceMatches = (
  firm: FirmRow,
  practiceArea: string
): boolean => {
  const target = normalize(practiceArea);

  if (!target) {
    return true;
  }

  const firmText =
    getFirmPracticeText(
      firm,
      firm.plan_key ??
        firm.plan ??
        "free"
    );

  if (!firmText) {
    return false;
  }

  const aliases: Record<string, string[]> = {
    "personal injury": [
      "personal injury",
      "car accident",
      "auto accident",
      "truck accident",
      "motorcycle accident",
      "slip and fall",
      "wrongful death",
      "injury",
    ],

    "car accident": [
      "car accident",
      "auto accident",
      "personal injury",
    ],

    "truck accident": [
      "truck accident",
      "personal injury",
    ],

    "motorcycle accident": [
      "motorcycle accident",
      "personal injury",
    ],

    "wrongful death": [
      "wrongful death",
      "personal injury",
    ],

    "criminal defense": [
      "criminal defense",
      "criminal law",
      "dwi",
      "dui",
    ],

    "dwi dui": [
      "dwi",
      "dui",
      "criminal defense",
    ],

    dwi: [
      "dwi",
      "dui",
      "criminal defense",
    ],

    dui: [
      "dwi",
      "dui",
      "criminal defense",
    ],

    immigration: [
      "immigration",
      "green card",
      "citizenship",
      "deportation",
    ],

    "family law": [
      "family law",
      "divorce",
      "custody",
      "child support",
    ],

    divorce: [
      "divorce",
      "family law",
    ],

    probate: [
      "probate",
      "estate planning",
      "estate",
      "trust",
      "will",
    ],

    "estate planning": [
      "estate planning",
      "probate",
      "trust",
      "will",
    ],

    bankruptcy: [
      "bankruptcy",
      "chapter 7",
      "chapter 13",
    ],

    "business law": [
      "business law",
      "business",
      "corporate",
      "commercial",
    ],

    business: [
      "business law",
      "business",
      "corporate",
      "commercial",
    ],

    "real estate": [
      "real estate",
      "property",
      "landlord",
      "tenant",
    ],

    "employment law": [
      "employment law",
      "employment",
      "labor",
      "wrongful termination",
      "discrimination",
      "wage",
    ],

    employment: [
      "employment law",
      "employment",
      "labor",
    ],

    "civil litigation": [
      "civil litigation",
      "litigation",
    ],
  };

  const targetAliases =
    aliases[target] ?? [target];

  return targetAliases.some((alias) =>
    firmText.includes(normalize(alias))
  );
};

const choosePriorityFirm = (
  firms: FirmRow[],
  practiceArea: string
): RoutedFirm | null => {
  const eligible = firms
    .filter((firm) => {
      const email =
        String(firm.email ?? "").trim();

      const plan =
        firm.plan_key ??
        firm.plan ??
        "free";

      return (
        Boolean(email) &&
        planIncludesLeadRouting(plan) &&
        practiceMatches(
          firm,
          practiceArea
        ) &&
        firm.is_active !== false
      );
    })
    .map((firm): RoutedFirm => {
      const planKey =
        normalizePlanKey(
          firm.plan_key ??
            firm.plan ??
            "free"
        );

      return {
        id: String(firm.id),
        name:
          String(firm.name ?? "").trim() ||
          "Participating Law Firm",
        email:
          String(firm.email ?? "").trim(),
        planKey,
        priority:
          getPlanPriority(planKey),
      };
    })
    .sort((a, b) => {
      if (
        a.priority !== b.priority
      ) {
        return (
          a.priority -
          b.priority
        );
      }

      return a.name.localeCompare(
        b.name
      );
    });

  if (eligible.length === 0) {
    return null;
  }

  const bestPriority =
    eligible[0].priority;

  const highestTier =
    eligible.filter(
      (firm) =>
        firm.priority ===
        bestPriority
    );

  const randomIndex =
    Math.floor(
      Math.random() *
        highestTier.length
    );

  return (
    highestTier[randomIndex] ??
    null
  );
};

const lookupSpecificFirm = async (
  firmId: string
): Promise<RoutedFirm | null> => {
  const supabase =
    getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } =
    await supabase
      .from("firms")
      .select("*")
      .eq("id", firmId)
      .maybeSingle();

  if (error) {
    console.error(
      "Could not verify selected firm:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  const firm =
    data as FirmRow;

  const planKey =
    normalizePlanKey(
      firm.plan_key ??
        firm.plan ??
        "free"
    );

  const email =
    String(
      firm.email ?? ""
    ).trim();

  if (
    !email ||
    !planIncludesLeadRouting(
      planKey
    ) ||
    firm.is_active === false
  ) {
    return null;
  }

  return {
    id: String(firm.id),

    name:
      String(
        firm.name ?? ""
      ).trim() ||
      "Participating Law Firm",

    email,

    planKey,

    priority:
      getPlanPriority(
        planKey
      ),
  };
};

const findPriorityFirm = async (
  practiceArea: string
): Promise<RoutedFirm | null> => {
  const supabase =
    getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } =
    await supabase
      .from("firms")
      .select("*");

  if (error) {
    console.error(
      "Could not load firms for priority routing:",
      error
    );

    return null;
  }

  return choosePriorityFirm(
    (data ?? []) as FirmRow[],
    practiceArea
  );
};

const sendFirmLead = async ({
  routedFirm,
  fullName,
  email,
  phone,
  legalIssue,
  practiceArea,
  sourceUrl,
}: {
  routedFirm: RoutedFirm;
  fullName: string;
  email: string;
  phone: string;
  legalIssue: string;
  practiceArea: string;
  sourceUrl?: string | null;
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,

    to: [
      routedFirm.email,
    ],

    replyTo: email,

    subject:
      `NEW CLIENT INQUIRY | ${practiceArea} | ${fullName}`,

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
            New Client Inquiry
          </h1>

          <p
            style="
              margin: 8px 0 0;
              color: #d6e2f0;
            "
          >
            Delivered through El Paso's Best Lawyers.
          </p>
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
            ${escapeHtml(
              routedFirm.name
            )}
          </p>

          <p>
            <strong>Practice Area:</strong>
            ${escapeHtml(
              practiceArea
            )}
          </p>

          <hr
            style="
              border: 0;
              border-top: 1px solid #e5e7eb;
              margin: 22px 0;
            "
          />

          <p>
            <strong>Name:</strong>
            ${escapeHtml(fullName)}
          </p>

          <p>
            <strong>Email:</strong>
            ${escapeHtml(email)}
          </p>

          <p>
            <strong>Phone:</strong>
            ${escapeHtml(phone)}
          </p>

          <h3>
            Legal Matter
          </h3>

          <div
            style="
              background: #f5f7fa;
              padding: 16px;
              border-radius: 8px;
              white-space: pre-wrap;
            "
          >${escapeHtml(
            legalIssue
          )}</div>

          ${
            sourceUrl
              ? `
                <p
                  style="
                    margin-top: 20px;
                    font-size: 12px;
                    color: #667085;
                  "
                >
                  Source:
                  ${escapeHtml(
                    sourceUrl
                  )}
                </p>
              `
              : ""
          }

          <div
            style="
              margin-top: 24px;
              padding: 14px;
              background: #fff8df;
              border: 1px solid #ead58a;
              border-radius: 8px;
              font-size: 13px;
            "
          >
            This inquiry was submitted through
            El Paso's Best Lawyers.
            Receiving this inquiry does not
            establish an attorney-client relationship.
          </div>
        </div>
      </div>
    `,
  });
};

export default async function handler(
  req: any,
  res: any
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({
        success: false,
        error:
          "Method not allowed",
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
      practiceArea,
      sourceUrl,
    } = req.body ?? {};

    if (
      !fullName ||
      !email ||
      !phone ||
      !legalIssue
    ) {
      return res
        .status(400)
        .json({
          success: false,
          error:
            "Missing required lead information",
        });
    }

    if (
      !process.env
        .RESEND_API_KEY
    ) {
      console.error(
        "RESEND_API_KEY is not configured."
      );

      return res
        .status(500)
        .json({
          success: false,
          error:
            "Email service is not configured",
        });
    }

    const cleanFullName =
      String(
        fullName
      ).trim();

    const cleanEmail =
      String(
        email
      ).trim();

    const cleanPhone =
      String(
        phone
      ).trim();

    const cleanLegalIssue =
      String(
        legalIssue
      ).trim();

    const area =
      String(
        practiceArea ?? ""
      ).trim() ||
      "General Legal Inquiry";

    const cleanSourceUrl =
      sourceUrl
        ? String(
            sourceUrl
          )
        : null;

    let routedFirm:
      RoutedFirm | null =
      null;

    /*
     * Firm-specific lead:
     * verify the selected firm
     * from Supabase.
     */
    if (firmId) {
      routedFirm =
        await lookupSpecificFirm(
          String(firmId)
        );
    }

    /*
     * General practice-area lead:
     * Exclusive -> Featured -> Expert
     */
    if (
      !firmId &&
      !routedFirm
    ) {
      routedFirm =
        await findPriorityFirm(
          area
        );
    }

    let routedSuccessfully =
      false;

    if (routedFirm) {
      const {
        error:
          firmEmailError,
      } =
        await sendFirmLead({
          routedFirm,

          fullName:
            cleanFullName,

          email:
            cleanEmail,

          phone:
            cleanPhone,

          legalIssue:
            cleanLegalIssue,

          practiceArea:
            area,

          sourceUrl:
            cleanSourceUrl,
        });

      if (firmEmailError) {
        console.error(
          "Firm lead delivery failed:",
          firmEmailError
        );
      } else {
        routedSuccessfully =
          true;
      }
    }

    /*
     * ADMIN COPY
     * Always sent.
     */
    const {
      error:
        adminEmailError,
    } =
      await resend.emails.send({
        from: FROM_EMAIL,

        to: [
          ADMIN_EMAIL,
        ],

        replyTo:
          cleanEmail,

        subject:
          `NEW LEAD | ${area} | ${cleanFullName}`,

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
                New El Paso's Best Lawyers Lead
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
                <strong>Name:</strong>
                ${escapeHtml(
                  cleanFullName
                )}
              </p>

              <p>
                <strong>Email:</strong>
                ${escapeHtml(
                  cleanEmail
                )}
              </p>

              <p>
                <strong>Phone:</strong>
                ${escapeHtml(
                  cleanPhone
                )}
              </p>

              <p>
                <strong>Practice Area:</strong>
                ${escapeHtml(
                  area
                )}
              </p>

              <p>
                <strong>Firm Viewed:</strong>
                ${escapeHtml(
                  firmName ||
                    "No specific firm selected"
                )}
              </p>

              <p>
                <strong>Firm ID:</strong>
                ${escapeHtml(
                  firmId ||
                    "N/A"
                )}
              </p>

              <p>
                <strong>Routed Firm:</strong>
                ${escapeHtml(
                  routedFirm?.name ||
                    "Not routed"
                )}
              </p>

              <p>
                <strong>Routing Tier:</strong>
                ${escapeHtml(
                  routedFirm?.planKey ||
                    "N/A"
                )}
              </p>

              <p>
                <strong>Routing Priority:</strong>
                ${escapeHtml(
                  routedFirm
                    ?.priority ??
                    "N/A"
                )}
              </p>

              <p>
                <strong>Delivery:</strong>
                ${
                  routedSuccessfully
                    ? "Successfully delivered"
                    : "Admin capture only"
                }
              </p>

              <h3>
                Legal Matter
              </h3>

              <div
                style="
                  background: #f5f7fa;
                  padding: 16px;
                  border-radius: 8px;
                  white-space: pre-wrap;
                "
              >${escapeHtml(
                cleanLegalIssue
              )}</div>

              ${
                cleanSourceUrl
                  ? `
                    <p
                      style="
                        margin-top: 20px;
                        font-size: 12px;
                        color: #667085;
                      "
                    >
                      Source:
                      ${escapeHtml(
                        cleanSourceUrl
                      )}
                    </p>
                  `
                  : ""
              }
            </div>
          </div>
        `,
      });

    if (adminEmailError) {
      console.error(
        "Admin notification failed:",
        adminEmailError
      );
    }

    /*
     * CONSUMER ACKNOWLEDGEMENT
     */
    const {
      error:
        consumerEmailError,
    } =
      await resend.emails.send({
        from: FROM_EMAIL,

        to: [
          cleanEmail,
        ],

        subject:
          "We Received Your Consultation Request",

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
              We received your request
            </h2>

            <p>
              Hi ${escapeHtml(
                cleanFullName
              )},
            </p>

            <p>
              Your consultation request was submitted through
              <strong>
                El Paso's Best Lawyers
              </strong>.
            </p>

            <p>
              Your request relates to
              <strong>
                ${escapeHtml(area)}
              </strong>.
            </p>

            ${
              routedSuccessfully &&
              routedFirm
                ? `
                  <p>
                    Your request was delivered to
                    <strong>
                      ${escapeHtml(
                        routedFirm.name
                      )}
                    </strong>
                    for review.
                  </p>
                `
                : `
                  <p>
                    El Paso's Best Lawyers has received
                    your request and it is being processed.
                  </p>
                `
            }

            <p>
              Submission does not create an
              attorney-client relationship and does not
              guarantee representation.
            </p>

            <p>
              Please avoid sending additional
              confidential or highly sensitive
              information until you establish an
              attorney-client relationship with a lawyer.
            </p>

            <p>
              El Paso's Best Lawyers
            </p>
          </div>
        `,
      });

    if (
      consumerEmailError
    ) {
      console.warn(
        "Consumer acknowledgement failed:",
        consumerEmailError
      );
    }

    return res
      .status(200)
      .json({
        success: true,

        capturedBy:
          "El Paso's Best Lawyers",

        routedToFirm:
          routedSuccessfully,

        routedFirmId:
          routedSuccessfully
            ? routedFirm?.id ??
              null
            : null,

        routedFirmName:
          routedSuccessfully
            ? routedFirm?.name ??
              null
            : null,

        routingPriority:
          routedSuccessfully
            ? routedFirm
                ?.priority ??
              null
            : null,
      });
  } catch (err: any) {
    console.error(
      "Lead endpoint error:",
      err
    );

    return res
      .status(500)
      .json({
        success: false,

        error:
          err?.message ||
          "Unable to process lead",
      });
  }
}