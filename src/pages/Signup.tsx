import { useMemo, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CheckCircle,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { plans } from "@/data/plans";

const PRACTICE_AREAS = [
  "Personal Injury",
  "Family Law",
  "Criminal Defense",
  "Immigration",
  "Estate Planning",
  "Business Law",
  "Real Estate",
  "Employment Law",
  "Bankruptcy",
  "DWI / DUI",
  "Probate",
  "Civil Litigation",
];

const MIN_PASSWORD_LENGTH = 6;

type PendingFirmProfile = {
  firmName: string;
  contactName: string;
  phone: string;
  email: string;
  practiceArea: string;
  requestedPlan: string;
};

const getFriendlyAuthError = (
  error: any
): string => {
  const message = String(
    error?.message ?? ""
  ).toLowerCase();

  const code = String(
    error?.code ?? ""
  ).toLowerCase();

  if (
    code === "weak_password" ||
    message.includes(
      "password should be at least"
    )
  ) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (
    message.includes(
      "already registered"
    ) ||
    message.includes(
      "already been registered"
    ) ||
    message.includes(
      "user already exists"
    )
  ) {
    return "An account already exists for this email address. Please sign in instead.";
  }

  if (
    message.includes(
      "invalid email"
    ) ||
    message.includes(
      "email address is invalid"
    )
  ) {
    return "Enter a valid email address.";
  }

  if (
    message.includes(
      "rate limit"
    ) ||
    message.includes(
      "too many requests"
    )
  ) {
    return "Too many signup attempts were made. Please wait a few minutes and try again.";
  }

  if (
    message.includes(
      "confirmation email"
    )
  ) {
    return "We could not send your confirmation email. Please try again.";
  }

  if (
    message.includes(
      "api key"
    )
  ) {
    return "Account registration is temporarily unavailable. Please try again shortly.";
  }

  return (
    error?.message ||
    "We could not create your account. Please review your information and try again."
  );
};

export default function Signup() {
  const [searchParams] =
    useSearchParams();

  const requestedPlan =
    searchParams.get("plan") ||
    localStorage.getItem(
      "selected-firm-plan"
    ) ||
    "free";

  const requestedPracticeArea =
    searchParams.get(
      "practiceArea"
    ) ||
    localStorage.getItem(
      "selected-firm-practice-area"
    ) ||
    "";

  const selectedPlan =
    useMemo(
      () =>
        plans.find(
          (plan) =>
            plan.id === requestedPlan
        ) ?? plans[0],
      [requestedPlan]
    );

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
      confirmPassword: "",
      firmName: "",
      contactName: "",
      phone: "",
      practiceArea:
        requestedPracticeArea,
    });

  const [loading, setLoading] =
    useState(false);

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    availabilityError,
    setAvailabilityError,
  ] = useState("");

  const [
    signupComplete,
    setSignupComplete,
  ] = useState(false);

  const [
    confirmationEmail,
    setConfirmationEmail,
  ] = useState("");

  const {
    signUp,
    signInWithGoogle,
    isConfigured,
  } = useAuth();

  const isLimitedPlan =
    selectedPlan.name ===
      "Category Featured" ||
    selectedPlan.name ===
      "Category Exclusive";

  const clearErrors = () => {
    setFormError("");
    setAvailabilityError("");
  };

  const updateField = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    clearErrors();
  };

  const checkAvailability =
    async (): Promise<boolean> => {
      if (!isLimitedPlan) {
        return true;
      }

      if (!formData.practiceArea) {
        setAvailabilityError(
          "Please select a primary practice area."
        );

        return false;
      }

      try {
        const response =
          await fetch(
            "/api/check-plan-availability",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                plan:
                  selectedPlan.name,
                category:
                  formData.practiceArea,
              }),
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          result?.available !== true
        ) {
          setAvailabilityError(
            result?.reason ||
              result?.error ||
              "This premium position is not currently available."
          );

          return false;
        }

        setAvailabilityError("");

        return true;
      } catch (error) {
        console.error(
          "Plan availability check failed:",
          error
        );

        setAvailabilityError(
          "We could not verify premium plan availability. Please try again."
        );

        return false;
      }
    };

  const storeSelections = () => {
    localStorage.setItem(
      "selected-firm-plan",
      selectedPlan.id
    );

    localStorage.setItem(
      "selected-firm-practice-area",
      formData.practiceArea
    );
  };

  const storePendingFirmProfile =
    () => {
      const pendingProfile:
        PendingFirmProfile = {
          firmName:
            formData.firmName.trim(),

          contactName:
            formData.contactName.trim(),

          phone:
            formData.phone.trim(),

          email:
            formData.email.trim(),

          practiceArea:
            formData.practiceArea,

          requestedPlan:
            selectedPlan.id,
        };

      localStorage.setItem(
        "pending-firm-profile",
        JSON.stringify(
          pendingProfile
        )
      );

      localStorage.setItem(
        "pending-checkout-plan",
        selectedPlan.id
      );

      localStorage.setItem(
        "pending-checkout-practice-area",
        formData.practiceArea
      );
    };

  const validateEmailSignup =
    (): boolean => {
      clearErrors();

      if (
        !formData.firmName.trim()
      ) {
        setFormError(
          "Enter the law firm name."
        );

        return false;
      }

      if (
        !formData.contactName.trim()
      ) {
        setFormError(
          "Enter a contact name."
        );

        return false;
      }

      if (
        !formData.phone.trim()
      ) {
        setFormError(
          "Enter a phone number."
        );

        return false;
      }

      if (
        !formData.email.trim()
      ) {
        setFormError(
          "Enter an email address."
        );

        return false;
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          formData.email.trim()
        )
      ) {
        setFormError(
          "Enter a valid email address."
        );

        return false;
      }

      if (!formData.practiceArea) {
        setAvailabilityError(
          "Please select a primary practice area."
        );

        return false;
      }

      if (
        formData.password.length <
        MIN_PASSWORD_LENGTH
      ) {
        setFormError(
          `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
        );

        return false;
      }

      if (
        formData.password !==
        formData.confirmPassword
      ) {
        setFormError(
          "Passwords do not match. Please enter the same password in both fields."
        );

        return false;
      }

      return true;
    };

  const handleGoogle =
    async () => {
      clearErrors();

      if (!isConfigured) {
        setFormError(
          "Registration is currently unavailable."
        );

        return;
      }

      if (
        !formData.practiceArea
      ) {
        setAvailabilityError(
          "Please select a primary practice area before continuing."
        );

        return;
      }

      if (
        !formData.firmName.trim()
      ) {
        setFormError(
          "Enter the law firm name before continuing with Google."
        );

        return;
      }

      setLoading(true);

      const available =
        await checkAvailability();

      if (!available) {
        setLoading(false);

        return;
      }

      storeSelections();
      storePendingFirmProfile();

      const { error } =
        await signInWithGoogle();

      if (error) {
        setFormError(
          getFriendlyAuthError(
            error
          )
        );

        setLoading(false);
      }
    };

  const handleSubmit =
    async (
      event: React.FormEvent
    ) => {
      event.preventDefault();

      if (!isConfigured) {
        setFormError(
          "Registration is currently unavailable. Please try again later."
        );

        return;
      }

      if (!validateEmailSignup()) {
        return;
      }

      setLoading(true);

      const available =
        await checkAvailability();

      if (!available) {
        setLoading(false);

        return;
      }

      storeSelections();
      storePendingFirmProfile();

      const {
        error: authError,
      } = await signUp(
        formData.email.trim(),
        formData.password,
        {
          firm_name:
            formData.firmName.trim(),

          contact_name:
            formData.contactName.trim(),

          phone:
            formData.phone.trim(),

          selected_plan:
            selectedPlan.id,

          practice_area:
            formData.practiceArea,

          pending_firm_profile:
            true,
        }
      );

      if (authError) {
        console.error(
          "Signup failed:",
          authError
        );

        setFormError(
          getFriendlyAuthError(
            authError
          )
        );

        setLoading(false);

        return;
      }

      /*
       * IMPORTANT:
       *
       * Do NOT require authData.user.id here.
       *
       * When email confirmation is enabled,
       * signup and authentication are separate
       * steps.
       *
       * The firm profile will be created after
       * the user confirms their email and signs
       * in successfully.
       */

      setConfirmationEmail(
        formData.email.trim()
      );

      setSignupComplete(true);
      setLoading(false);
    };

  if (signupComplete) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
          <div className="flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-9 w-9" />
            </span>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B88900]">
              Almost Finished
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#06224A]">
              Check your email
            </h1>

            <p className="mt-4 leading-7 text-slate-600">
              We sent a confirmation
              link to:
            </p>

            <p className="mt-2 font-bold text-[#06224A]">
              {confirmationEmail}
            </p>

            <p className="mt-5 leading-7 text-slate-600">
              Click the confirmation
              link in that email to
              activate your account.
              After confirmation, sign
              in to finish setting up
              your firm profile.
            </p>
          </div>

          <div className="mt-7 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <span>
                Your selected{" "}
                <strong>
                  {selectedPlan.name}
                </strong>{" "}
                plan and{" "}
                <strong>
                  {formData.practiceArea}
                </strong>{" "}
                practice area have
                been saved for the
                next step.
              </span>
            </div>
          </div>

          <Link
            to={`/login?plan=${encodeURIComponent(
              selectedPlan.id
            )}&practiceArea=${encodeURIComponent(
              formData.practiceArea
            )}`}
            className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-[#D4A62A] font-extrabold text-[#06224A] hover:bg-[#E3B53A]"
          >
            Go to Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            If you do not see the
            email, check your spam or
            junk folder.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden bg-[#06224A] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-bold"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4A62A] text-[#06224A]">
            <Scale className="h-6 w-6" />
          </span>

          El Paso&apos;s Best Lawyers
        </Link>

        <div className="max-w-xl py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4A62A]">
            Firm Membership
          </p>

          <h1 className="mt-4 text-5xl font-extrabold leading-tight">
            Put your firm in front of
            people searching for legal
            help in El Paso.
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/70">
            Build your profile, add
            your attorneys, manage
            your information, and
            choose the visibility
            level that fits your firm.
          </p>

          <div className="mt-8 space-y-4 text-sm text-white/85">
            {[
              "Professional public firm profile",
              "Attorney profile management",
              "Lead capture and engagement tools",
              "Premium category placement options",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-[#D4A62A]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs leading-5 text-white/45">
          Listings and premium
          placements are subject to
          directory terms and
          availability.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full max-w-xl">
          <Link
            to="/"
            className="mb-8 flex items-center gap-3 text-lg font-bold text-[#06224A] lg:hidden"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4A62A]">
              <Scale className="h-5 w-5" />
            </span>

            El Paso&apos;s Best Lawyers
          </Link>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
            <div className="mb-7">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B88900]">
                Create Firm Account
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-[#06224A]">
                Start your law firm
                profile
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Selected plan:{" "}
                <span className="font-bold text-[#06224A]">
                  {selectedPlan.name}
                </span>

                {selectedPlan.priceMonth >
                  0 &&
                  ` - $${selectedPlan.priceMonth.toLocaleString()}/month`}
              </p>
            </div>

            {!isConfigured && (
              <Alert
                variant="destructive"
                className="mb-6"
              >
                <AlertTriangle className="h-4 w-4" />

                <AlertDescription>
                  Registration is
                  currently unavailable.
                </AlertDescription>
              </Alert>
            )}

            {formError && (
              <Alert
                variant="destructive"
                className="mb-6"
              >
                <AlertTriangle className="h-4 w-4" />

                <AlertDescription>
                  {formError}
                </AlertDescription>
              </Alert>
            )}

            {availabilityError && (
              <Alert
                variant="destructive"
                className="mb-6"
              >
                <AlertTriangle className="h-4 w-4" />

                <AlertDescription>
                  {availabilityError}
                </AlertDescription>
              </Alert>
            )}

            <div className="mb-5 space-y-2">
              <Label htmlFor="practiceArea">
                Primary Practice Area
              </Label>

              <select
                id="practiceArea"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
                value={
                  formData.practiceArea
                }
                onChange={(event) => {
                  const value =
                    event.target.value;

                  updateField(
                    "practiceArea",
                    value
                  );

                  localStorage.setItem(
                    "selected-firm-practice-area",
                    value
                  );
                }}
                required
              >
                <option value="">
                  Select a practice area
                </option>

                {PRACTICE_AREAS.map(
                  (area) => (
                    <option
                      key={area}
                      value={area}
                    >
                      {area}
                    </option>
                  )
                )}
              </select>

              {isLimitedPlan && (
                <p className="text-xs leading-5 text-slate-500">
                  Premium category
                  availability will be
                  verified before your
                  account is created.
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-xl border-slate-300 font-bold"
              onClick={handleGoogle}
              disabled={
                loading ||
                !isConfigured ||
                !formData.practiceArea
              }
            >
              {loading
                ? "Checking availability..."
                : "Continue with Google"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>

              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 font-semibold tracking-wide text-slate-400">
                  or use email
                </span>
              </div>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-4"
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firmName">
                    Law Firm Name
                  </Label>

                  <Input
                    id="firmName"
                    className="h-11"
                    value={
                      formData.firmName
                    }
                    onChange={(event) =>
                      updateField(
                        "firmName",
                        event.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName">
                    Contact Name
                  </Label>

                  <Input
                    id="contactName"
                    className="h-11"
                    value={
                      formData.contactName
                    }
                    onChange={(event) =>
                      updateField(
                        "contactName",
                        event.target.value
                      )
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone
                </Label>

                <Input
                  id="phone"
                  className="h-11"
                  type="tel"
                  value={
                    formData.phone
                  }
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  className="h-11"
                  type="email"
                  value={
                    formData.email
                  }
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password
                  </Label>

                  <Input
                    id="password"
                    className="h-11"
                    type="password"
                    minLength={
                      MIN_PASSWORD_LENGTH
                    }
                    value={
                      formData.password
                    }
                    onChange={(event) =>
                      updateField(
                        "password",
                        event.target.value
                      )
                    }
                    required
                  />

                  <p className="text-xs text-slate-500">
                    Use at least{" "}
                    {
                      MIN_PASSWORD_LENGTH
                    }{" "}
                    characters.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password
                  </Label>

                  <Input
                    id="confirmPassword"
                    className="h-11"
                    type="password"
                    minLength={
                      MIN_PASSWORD_LENGTH
                    }
                    value={
                      formData.confirmPassword
                    }
                    onChange={(event) =>
                      updateField(
                        "confirmPassword",
                        event.target.value
                      )
                    }
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-[#D4A62A] font-extrabold text-[#06224A] hover:bg-[#E3B53A]"
                disabled={
                  loading ||
                  !isConfigured ||
                  !formData.practiceArea
                }
              >
                {loading
                  ? "Creating firm account..."
                  : "Create Firm Account"}

                {!loading && (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </form>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              Your account gives you
              access to the firm
              dashboard where you can
              manage your profile and
              attorneys.
            </div>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an
              account?{" "}

              <Link
                to={`/login?plan=${encodeURIComponent(
                  selectedPlan.id
                )}&practiceArea=${encodeURIComponent(
                  formData.practiceArea
                )}`}
                className="font-bold text-[#0F5E7A] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}