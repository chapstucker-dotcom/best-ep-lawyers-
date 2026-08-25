import { useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
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
import { useToast } from "@/hooks/use-toast";
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

export default function Signup() {
  const [searchParams] =
    useSearchParams();

  const requestedPlan =
    searchParams.get("plan") ||
    "free";

  const selectedPlan =
    useMemo(
      () =>
        plans.find(
          (plan) =>
            plan.id ===
            requestedPlan
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
      practiceArea: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [availabilityError, setAvailabilityError] =
    useState("");

  const {
    signUp,
    signInWithGoogle,
    isConfigured,
  } = useAuth();

  const navigate = useNavigate();

  const { toast } = useToast();

  const isLimitedPlan =
    selectedPlan.name ===
      "Category Featured" ||
    selectedPlan.name ===
      "Category Exclusive";

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

  const handleGoogle =
    async () => {
      if (!isConfigured) {
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

      setLoading(true);
      setAvailabilityError("");

      const available =
        await checkAvailability();

      if (!available) {
        setLoading(false);
        return;
      }

      storeSelections();

      const { error } =
        await signInWithGoogle();

      if (error) {
        toast({
          title:
            "Could not continue with Google",
          description:
            error.message,
          variant:
            "destructive",
        });

        setLoading(false);
      }
    };

  const handleSubmit =
    async (
      event: React.FormEvent
    ) => {
      event.preventDefault();

      if (!isConfigured) {
        toast({
          title:
            "Registration unavailable",
          description:
            "The account system is not configured for this environment.",
          variant:
            "destructive",
        });

        return;
      }

      if (
        !formData.practiceArea
      ) {
        setAvailabilityError(
          "Please select a primary practice area."
        );

        return;
      }

      if (
        formData.password !==
        formData.confirmPassword
      ) {
        toast({
          title:
            "Passwords do not match",
          description:
            "Please re-enter the same password in both fields.",
          variant:
            "destructive",
        });

        return;
      }

      setLoading(true);
      setAvailabilityError("");

      const available =
        await checkAvailability();

      if (!available) {
        setLoading(false);
        return;
      }

      storeSelections();

      const { error } =
        await signUp(
          formData.email,
          formData.password,
          {
            firm_name:
              formData.firmName,
            contact_name:
              formData.contactName,
            phone:
              formData.phone,
            selected_plan:
              selectedPlan.id,
            practice_area:
              formData.practiceArea,
          }
        );

      if (error) {
        toast({
          title:
            "Account could not be created",
          description:
            error.message,
          variant:
            "destructive",
        });
      } else {
        toast({
          title:
            "Account created",
          description:
            "Check your email for verification, then sign in to complete your firm profile.",
        });

        navigate("/login");
      }

      setLoading(false);
    };

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
            Put your firm in front of people searching for legal help in El Paso.
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
                Start your law firm profile
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Selected plan:{" "}
                <span className="font-bold text-[#06224A]">
                  {selectedPlan.name}
                </span>

                {selectedPlan.priceMonth >
                  0 &&
                  ` — $${selectedPlan.priceMonth.toLocaleString()}/month`}
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
                  unavailable because
                  the account system is
                  not configured in this
                  environment.
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
                  setFormData({
                    ...formData,
                    practiceArea:
                      event.target.value,
                  });

                  setAvailabilityError(
                    ""
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        firmName:
                          e.target.value,
                      })
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactName:
                          e.target.value,
                      })
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone:
                        e.target.value,
                    })
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email:
                        e.target.value,
                    })
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
                    value={
                      formData.password
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password:
                          e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password
                  </Label>

                  <Input
                    id="confirmPassword"
                    className="h-11"
                    type="password"
                    value={
                      formData.confirmPassword
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword:
                          e.target.value,
                      })
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
                  ? "Checking availability..."
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
              Already have an account?{" "}

              <Link
                to="/login"
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