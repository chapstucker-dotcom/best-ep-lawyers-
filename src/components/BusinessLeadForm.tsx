import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Send,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

type BusinessLeadState = {
  firmName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  interest: string;
  message: string;
};

const EMPTY_FORM: BusinessLeadState = {
  firmName: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  interest: "",
  message: "",
};

const INTEREST_OPTIONS = [
  "Free Firm Listing",
  "Expert Plan",
  "Category Featured",
  "Category Exclusive",
  "Advertising / Sponsorship",
  "Not Sure Yet",
];

export default function BusinessLeadForm() {
  const [form, setForm] =
    useState<BusinessLeadState>(EMPTY_FORM);

  const [submitting, setSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const updateField = (
    field: keyof BusinessLeadState,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const validateForm = (): string => {
    if (form.firmName.trim().length < 2) {
      return "Enter your law firm name.";
    }

    if (form.contactName.trim().length < 2) {
      return "Enter your name.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return "Enter a valid email address.";
    }

    if (form.phone.trim().length < 7) {
      return "Enter a valid phone number.";
    }

    if (!form.interest) {
      return "Select what your firm is interested in.";
    }

    return "";
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (submitting) return;

    setSuccessMessage("");
    setErrorMessage("");

    const validationError =
      validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/business-lead",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            firmName:
              form.firmName.trim(),
            contactName:
              form.contactName.trim(),
            email:
              form.email.trim(),
            phone:
              form.phone.trim(),
            website:
              form.website.trim(),
            interest:
              form.interest,
            message:
              form.message.trim(),
            sourceUrl:
              typeof window !== "undefined"
                ? window.location.href
                : null,
          }),
        }
      );

      if (!response.ok) {
        const result =
          await response.json().catch(
            () => null
          );

        throw new Error(
          result?.error ||
            "Your inquiry could not be submitted."
        );
      }

      setSuccessMessage(
        "Thank you. Your firm inquiry was submitted successfully."
      );

      setForm(EMPTY_FORM);
    } catch (error) {
      console.error(
        "Business lead submission failed:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Your inquiry could not be submitted. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="business-inquiry"
      className="bg-white px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="rounded-3xl bg-[#06224A] p-8 text-white shadow-xl sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4A62A]">
            Advertising & Growth
          </p>

          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Talk with us about growing your firm&apos;s visibility.
          </h2>

          <p className="mt-5 leading-7 text-white/75">
            Whether you are interested in a complimentary listing,
            enhanced attorney profiles, premium category placement,
            or a broader advertising partnership, send us your
            information and we&apos;ll follow up.
          </p>

          <div className="mt-8 space-y-5">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D4A62A]">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">
                  Built for law firms
                </p>
                <p className="mt-1 text-sm leading-6 text-white/65">
                  Discuss listing options, attorney profiles, and
                  premium visibility opportunities.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D4A62A]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">
                  Direct business inquiry
                </p>
                <p className="mt-1 text-sm leading-6 text-white/65">
                  This form is for law-firm advertising and
                  partnership inquiries, not requests for legal help.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm sm:p-9">
          <h3 className="text-2xl font-extrabold text-[#06224A]">
            Request Advertising Information
          </h3>

          <p className="mt-3 leading-7 text-slate-600">
            Tell us about your firm and what you&apos;re interested in.
          </p>

          {successMessage && (
            <Alert className="mt-6 border-green-300 bg-green-50 text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert
              variant="destructive"
              className="mt-6"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="business-firm-name">
                  Firm Name *
                </Label>

                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="business-firm-name"
                    value={form.firmName}
                    onChange={(event) =>
                      updateField(
                        "firmName",
                        event.target.value
                      )
                    }
                    placeholder="Your law firm"
                    className="pl-10"
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-contact-name">
                  Contact Name *
                </Label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="business-contact-name"
                    value={form.contactName}
                    onChange={(event) =>
                      updateField(
                        "contactName",
                        event.target.value
                      )
                    }
                    placeholder="Your name"
                    autoComplete="name"
                    className="pl-10"
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-email">
                  Email *
                </Label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="business-email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="you@lawfirm.com"
                    autoComplete="email"
                    className="pl-10"
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-phone">
                  Phone *
                </Label>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="business-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value
                      )
                    }
                    placeholder="(915) 555-1234"
                    autoComplete="tel"
                    className="pl-10"
                    disabled={submitting}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-website">
                Website
              </Label>

              <Input
                id="business-website"
                value={form.website}
                onChange={(event) =>
                  updateField(
                    "website",
                    event.target.value
                  )
                }
                placeholder="https://yourlawfirm.com"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-interest">
                I&apos;m Interested In *
              </Label>

              <select
                id="business-interest"
                value={form.interest}
                onChange={(event) =>
                  updateField(
                    "interest",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                disabled={submitting}
                required
              >
                <option value="">
                  Select an option
                </option>

                {INTEREST_OPTIONS.map(
                  (option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-message">
                Tell Us More
              </Label>

              <Textarea
                id="business-message"
                value={form.message}
                onChange={(event) =>
                  updateField(
                    "message",
                    event.target.value
                  )
                }
                placeholder="Tell us about your firm, practice areas, goals, or the type of advertising opportunity you want to discuss."
                rows={6}
                maxLength={1500}
                disabled={submitting}
              />

              <p className="text-right text-xs text-slate-500">
                {form.message.length}/1500
              </p>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full bg-[#D4A62A] text-base font-extrabold text-[#06224A] hover:bg-[#E3B53A]"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Request Advertising Information
                </>
              )}
            </Button>

            <p className="text-center text-xs leading-5 text-slate-500">
              This form is for business and advertising inquiries.
              Consumers seeking legal help should use the directory
              consultation forms instead.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}