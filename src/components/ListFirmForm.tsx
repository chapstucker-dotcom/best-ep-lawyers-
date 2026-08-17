import { useState } from "react";
import { createFirm } from "@/services/firmService";

type PlanName =
  | "Free"
  | "Expert"
  | "Category Featured"
  | "Category Exclusive";

type FormData = {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  bio: string;
  plan: PlanName;
  agreed: boolean;
};

const STRIPE_LINKS: Record<Exclude<PlanName, "Free">, string> = {
  Expert:
    "https://buy.stripe.com/7sY8wOgQU8u65N198SaAw01",

  "Category Featured":
    "https://buy.stripe.com/fZu6oG0RWeSu2AP98SaAw03",

  "Category Exclusive":
    "https://buy.stripe.com/8x27sK3046lYb7lgBkaAw04",
};

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  bio: "",
  plan: "Free",
  agreed: false,
};

export default function ListFirmForm() {
  const [formData, setFormData] =
    useState<FormData>(INITIAL_FORM);

  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const sendListingEmail = async (
    website: string
  ): Promise<boolean> => {
    try {
const response = await fetch("/api/submit-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firmName: formData.name.trim(),
          contactName: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          website,
          address: formData.address.trim(),
          bio: formData.bio.trim(),
          city: "El Paso",
          state: "TX",
          plan: formData.plan,
          submissionType:
            formData.plan === "Free"
              ? "Free Listing"
              : "Paid Plan Checkout",
        }),
      });

      if (!response.ok) {
        console.error(
          "Listing email failed:",
          await response.text()
        );

        return false;
      }

      return true;
    } catch (error) {
      console.error("Listing email failed:", error);
      return false;
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (submitting) return;

    setStatus("");

    if (!formData.agreed) {
      setStatus(
        "Please agree to the attorney advertising notice."
      );
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      setStatus("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);
    setStatus("Processing your submission...");

    const website =
      formData.website.trim() &&
      !/^https?:\/\//i.test(formData.website.trim())
        ? `https://${formData.website.trim()}`
        : formData.website.trim();

    /*
     * Send the complete submission before redirecting.
     * This prevents paid-plan information from being lost.
     */
    const emailSent = await sendListingEmail(website);

    /*
     * PAID PLAN FLOW
     *
     * Do not assign premium status in Supabase before Stripe
     * confirms payment. The submission is preserved locally
     * and sent by email, then the visitor goes to Checkout.
     *
     * After payment appears in Stripe, manually approve the
     * listing and assign the correct plan in Supabase.
     */
    if (formData.plan !== "Free") {
      const checkoutUrl =
        STRIPE_LINKS[formData.plan];

      localStorage.setItem(
        "pending-paid-firm-listing",
        JSON.stringify({
          ...formData,
          website,
          submittedAt: new Date().toISOString(),
        })
      );

      if (!emailSent) {
        setStatus(
          "We could not preserve your information. Please try again before continuing to checkout."
        );
        setSubmitting(false);
        return;
      }

      setStatus("Opening secure Stripe checkout...");

      window.location.assign(checkoutUrl);
      return;
    }

    /*
     * FREE LISTING FLOW
     */
    const { error } = await createFirm({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      website,
      address: formData.address.trim(),
      bio: formData.bio.trim(),
      category: "Pending Review",

      // Always store this as the free plan.
      plan: "free",

      is_featured: false,
      is_exclusive: false,
      is_verified: false,
    });

    if (error) {
      console.error("Firm submission failed:", error);

      setStatus(
        "We could not save the listing. Please try again."
      );
      setSubmitting(false);
      return;
    }

    setStatus(
      emailSent
        ? "Success! Your complimentary listing was submitted for review."
        : "Your listing was saved, but the confirmation email could not be sent."
    );

    setFormData(INITIAL_FORM);
    setSubmitting(false);
  };

  return (
    <section
      id="list-form"
      className="bg-white py-16"
    >
      <div className="mx-auto max-w-4xl px-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border bg-gray-50 p-8 shadow-sm"
        >
          <h2 className="mb-3 text-3xl font-bold text-[#021B45]">
            List Your Law Firm
          </h2>

          <p className="mb-8 text-gray-600">
            Begin with a complimentary listing or select
            an enhanced visibility plan.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="firm-name"
                className="mb-2 block font-medium"
              >
                Firm Name *
              </label>

              <input
                id="firm-name"
                required
                className="w-full rounded-lg border p-3"
                value={formData.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
              />
            </div>

            <div>
              <label
                htmlFor="firm-email"
                className="mb-2 block font-medium"
              >
                Email *
              </label>

              <input
                id="firm-email"
                required
                type="email"
                className="w-full rounded-lg border p-3"
                value={formData.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value
                  )
                }
              />
            </div>

            <div>
              <label
                htmlFor="firm-phone"
                className="mb-2 block font-medium"
              >
                Phone *
              </label>

              <input
                id="firm-phone"
                required
                type="tel"
                className="w-full rounded-lg border p-3"
                value={formData.phone}
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value
                  )
                }
              />
            </div>

            <div>
              <label
                htmlFor="firm-website"
                className="mb-2 block font-medium"
              >
                Website
              </label>

              <input
                id="firm-website"
                className="w-full rounded-lg border p-3"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(event) =>
                  updateField(
                    "website",
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="firm-address"
              className="mb-2 block font-medium"
            >
              Address *
            </label>

            <input
              id="firm-address"
              required
              className="w-full rounded-lg border p-3"
              value={formData.address}
              onChange={(event) =>
                updateField(
                  "address",
                  event.target.value
                )
              }
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="firm-bio"
              className="mb-2 block font-medium"
            >
              About Your Firm
            </label>

            <textarea
              id="firm-bio"
              className="min-h-[120px] w-full rounded-lg border p-3"
              value={formData.bio}
              onChange={(event) =>
                updateField(
                  "bio",
                  event.target.value
                )
              }
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="firm-plan"
              className="mb-2 block font-medium"
            >
              Select Plan
            </label>

            <select
              id="firm-plan"
              className="w-full rounded-lg border p-3"
              value={formData.plan}
              onChange={(event) =>
                updateField(
                  "plan",
                  event.target.value as PlanName
                )
              }
            >
              <option value="Free">
                Free Listing — $0/month
              </option>

              <option value="Expert">
                Expert — $299/month
              </option>

              <option value="Category Featured">
                Category Featured — $2,000/month
              </option>

              <option value="Category Exclusive">
                Category Exclusive — $5,000/month
              </option>
            </select>

            {formData.plan !== "Free" && (
              <p className="mt-3 text-sm text-gray-600">
                After submitting, you will be taken to
                Stripe&apos;s secure checkout page.
              </p>
            )}
          </div>

          <label className="mt-6 flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1"
              checked={formData.agreed}
              onChange={(event) =>
                updateField(
                  "agreed",
                  event.target.checked
                )
              }
            />

            <span>
              I confirm the submitted information is
              authorized for publication and understand
              that listings may constitute attorney
              advertising. *
            </span>
          </label>

          {status && (
            <p
              aria-live="polite"
              className="mt-4 font-semibold text-[#021B45]"
            >
              {status}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-[#1FA8A1] py-4 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Processing..."
              : formData.plan === "Free"
                ? "Submit Complimentary Listing"
                : "Continue to Secure Checkout"}
          </button>
        </form>
      </div>
    </section>
  );
}