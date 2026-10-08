import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { getFirmByUserId, saveFirmProfile } from "@/services/firmService";
import { useSeo } from "../hooks/use-seo";
import {
  normalizeSelfServicePlanId,
} from "@/config/selfServicePlans";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

import {
  Scale,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type PendingFirmProfile = {
  firmName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  practiceArea?: string;
  requestedPlan?: string;
};

const readPendingFirmProfile =
  (): PendingFirmProfile | null => {
    try {
      const raw =
        localStorage.getItem(
          "pending-firm-profile"
        );

      if (!raw) {
        return null;
      }

      return JSON.parse(
        raw
      ) as PendingFirmProfile;
    } catch (error) {
      console.error(
        "Could not read pending firm profile:",
        error
      );

      return null;
    }
  };

export default function Login() {
  useSeo({
    title: "Firm Login | El Paso's Best Lawyers",
    description:
      "Sign in to manage your law firm profile on El Paso's Best Lawyers.",
    path: "/login",
    robots: "noindex, nofollow",
  });
  const [searchParams] =
    useSearchParams();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    finalizingFirm,
    setFinalizingFirm,
  ] = useState(false);

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const {
    user,
    signIn,
    signInWithGoogle,
    isConfigured,
  } = useAuth();

  const navigate = useNavigate();

  const storedPlan =
    localStorage.getItem(
      "selected-firm-plan"
    ) || "";

  const storedPracticeArea =
    localStorage.getItem(
      "selected-firm-practice-area"
    ) || "";

  const requestedPlan =
  normalizeSelfServicePlanId(
    searchParams.get("plan") ||
      storedPlan ||
      "free"
  );

  const requestedPracticeArea =
    searchParams.get(
      "practiceArea"
    ) ||
    storedPracticeArea ||
    "";

  const signupUrl = useMemo(() => {
    const params =
      new URLSearchParams();

    if (requestedPlan) {
      params.set(
        "plan",
        requestedPlan
      );
    }

    if (
      requestedPracticeArea
    ) {
      params.set(
        "practiceArea",
        requestedPracticeArea
      );
    }

    const query =
      params.toString();

    return query
      ? `/signup?${query}`
      : "/signup";
  }, [
    requestedPlan,
    requestedPracticeArea,
  ]);

  const preserveSelections = () => {
    if (requestedPlan) {
      localStorage.setItem(
        "selected-firm-plan",
        requestedPlan
      );
    }

    if (
      requestedPracticeArea
    ) {
      localStorage.setItem(
        "selected-firm-practice-area",
        requestedPracticeArea
      );
    }
  };

  const finalizationPromise = useRef<Promise<boolean> | null>(null);

  const finalizePendingFirmImpl =
    async (
      userId: string,
      authenticatedEmail?: string | null
    ): Promise<boolean> => {
      const pending =
        readPendingFirmProfile();

      /*
       * Existing accounts that do not
       * have a pending signup profile
       * can simply continue to dashboard.
       */
      if (!pending) {
        return true;
      }

      // Never apply a pending signup to a different authenticated account.
      if (
        pending.email?.trim() &&
        authenticatedEmail &&
        pending.email.trim().toLowerCase() !== authenticatedEmail.trim().toLowerCase()
      ) {
        setFormError("This pending signup belongs to another email address. Sign in with the email used to register your firm.");
        return false;
      }

      // Existing firm records must never be overwritten by signup defaults.
      const { data: existingFirm, error: lookupError } = await getFirmByUserId(userId);
      if (lookupError) {
        setFormError(`Could not verify your existing firm profile: ${lookupError.message}`);
        return false;
      }
      if (existingFirm) {
        localStorage.removeItem("pending-firm-profile");
        localStorage.removeItem("pending-firm-name");
        localStorage.removeItem("pending-firm-phone");
        return true;
      }

      const firmName =
        pending.firmName?.trim();

      const practiceArea =
        pending.practiceArea?.trim();

      if (!firmName) {
        setFormError(
          "Your account is signed in, but the pending firm profile is missing the firm name."
        );

        return false;
      }

      if (!practiceArea) {
        setFormError(
          "Your account is signed in, but the pending firm profile is missing its practice area."
        );

        return false;
      }

      // These firms already have managed listings; do not create duplicates.
      const normalizedFirmName = firmName.toLowerCase().replace(/[^a-z0-9]/g, "");
      const existingListingNames = new Set([
        "davidesaucedo", "davidesaucedoii", "jmmunozlawfirm",
        "jmmunozlawfirmpllc", "josemanuelmunoz",
      ]);
      if (existingListingNames.has(normalizedFirmName)) {
        setFormError("This firm already has a listing. Please contact support to claim or manage the existing profile.");
        return false;
      }

      setFinalizingFirm(true);

      /*
       * IMPORTANT:
       *
       * The firm begins on FREE.
       * The selected premium plan is
       * activated only after Stripe
       * payment succeeds.
       */
      const {
        data,
        error,
      } = await saveFirmProfile(
        userId,
        {
          name: firmName,

          phone:
            pending.phone?.trim() ||
            null,

          email:
            pending.email?.trim() ||
            authenticatedEmail ||
            "",

          city: "El Paso",
          state: "TX",

          category:
            practiceArea,

          primary_category:
            practiceArea,

          practice_areas: [
            practiceArea,
          ],

          specialties: [
            practiceArea,
          ],

          plan: "free",
          plan_key: "free",

          is_featured: false,
          is_exclusive: false,

          is_verified: false,
          verified: false,

          approved: false,
          is_active: true,

          payment_status:
            "unpaid",

          status:
            "pending",
        }
      );

      setFinalizingFirm(false);

      if (error || !data) {
        console.error(
          "Firm profile finalization failed:",
          error
        );

        setFormError(
          error?.message
            ? `You signed in successfully, but your firm profile could not be completed: ${error.message}`
            : "You signed in successfully, but your firm profile could not be completed."
        );

        return false;
      }

      /*
 * Preserve only valid self-service
 * plan requests. Stripe will activate
 * paid plans later.
 */
const pendingRequestedPlan =
  normalizeSelfServicePlanId(
    pending.requestedPlan || "free"
  );

if (pendingRequestedPlan !== "free") {
  localStorage.setItem(
    "pending-checkout-plan",
    pendingRequestedPlan
  );

  localStorage.setItem(
    "selected-firm-plan",
    pendingRequestedPlan
  );
} else {
  localStorage.removeItem(
    "pending-checkout-plan"
  );

  localStorage.setItem(
    "selected-firm-plan",
    "free"
  );
}

      localStorage.setItem(
        "pending-checkout-practice-area",
        practiceArea
      );

      localStorage.setItem(
        "selected-firm-practice-area",
        practiceArea
      );

      /*
       * Firm row now exists and is
       * connected to the authenticated
       * Supabase user.
       */
      localStorage.removeItem(
        "pending-firm-profile"
      );

      localStorage.removeItem(
        "pending-firm-name"
      );

      localStorage.removeItem(
        "pending-firm-phone"
      );

      return true;
    };

  // Share a single in-flight operation between email login and auth-session effects.
  const finalizePendingFirm = (userId: string, authenticatedEmail?: string | null): Promise<boolean> => {
    if (finalizationPromise.current) return finalizationPromise.current;
    const operation = finalizePendingFirmImpl(userId, authenticatedEmail);
    finalizationPromise.current = operation;
    void operation.then(
      () => { if (finalizationPromise.current === operation) finalizationPromise.current = null; },
      () => { if (finalizationPromise.current === operation) finalizationPromise.current = null; }
    );
    return operation;
  };

  /*
   * This also handles a user returning
   * from an OAuth / confirmed session.
   *
   * If an authenticated user lands on
   * Login and still has a pending firm
   * profile, connect it automatically.
   */
  useEffect(() => {
    if (
      !user ||
      finalizingFirm ||
      loading
    ) {
      return;
    }

    const pending =
      readPendingFirmProfile();

    if (!pending) {
      return;
    }

    let active = true;

    const finish =
      async () => {
        setFormError("");

        const completed =
          await finalizePendingFirm(
            user.id,
            user.email
          );

        if (
          active &&
          completed
        ) {
          setSuccessMessage(
            "Your firm account is ready."
          );

          navigate(
            "/dashboard"
          );
        }
      };

    void finish();

    return () => {
      active = false;
    };
  }, [user]);

  const handleGoogle =
    async () => {
      setFormError("");
      setSuccessMessage("");

      if (!isConfigured) {
        setFormError(
          "Authentication is currently unavailable."
        );

        return;
      }

      preserveSelections();

      setLoading(true);

      const { error } =
        await signInWithGoogle();

      if (error) {
        setFormError(
          error.message ||
            "Google sign-in could not be started."
        );

        setLoading(false);
      }
    };

  const handleSubmit =
    async (
      event: React.FormEvent
    ) => {
      event.preventDefault();

      setFormError("");
      setSuccessMessage("");

      if (!isConfigured) {
        setFormError(
          "Authentication is currently unavailable."
        );

        return;
      }

      if (!email.trim()) {
        setFormError(
          "Enter your email address."
        );

        return;
      }

      if (!password) {
        setFormError(
          "Enter your password."
        );

        return;
      }

      preserveSelections();

      setLoading(true);

      const {
        data,
        error,
      } = await signIn(
        email.trim(),
        password
      );

      if (error) {
        setLoading(false);

        const message =
          String(
            error.message || ""
          ).toLowerCase();

        if (
          message.includes(
            "email not confirmed"
          )
        ) {
          setFormError(
            "Please confirm your email address before signing in. Check your inbox for the confirmation email."
          );

          return;
        }

        if (
          message.includes(
            "invalid login credentials"
          )
        ) {
          setFormError(
            "The email address or password is incorrect."
          );

          return;
        }

        setFormError(
          error.message ||
            "Sign-in failed. Please try again."
        );

        return;
      }

      const signedInUser =
        data?.user;

      if (
        !signedInUser?.id
      ) {
        setLoading(false);

        setFormError(
          "You were signed in, but your account information could not be loaded. Please try again."
        );

        return;
      }

      const completed =
        await finalizePendingFirm(
          signedInUser.id,
          signedInUser.email
        );

      setLoading(false);

      if (!completed) {
        return;
      }

      setSuccessMessage(
        "Signed in successfully."
      );

      navigate("/dashboard");
    };

  const busy =
    loading ||
    finalizingFirm;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Scale className="h-12 w-12 text-blue-600" />
          </div>

          <CardTitle className="text-2xl font-bold">
            Welcome Back
          </CardTitle>

          <CardDescription>
            Sign in to manage your
            law firm profile
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isConfigured && (
            <Alert
              variant="destructive"
              className="mb-4"
            >
              <AlertTriangle className="h-4 w-4" />

              <AlertDescription>
                Authentication is
                currently unavailable.
              </AlertDescription>
            </Alert>
          )}

          {formError && (
            <Alert
              variant="destructive"
              className="mb-4"
            >
              <AlertTriangle className="h-4 w-4" />

              <AlertDescription>
                {formError}
              </AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="mb-4 border-emerald-300 bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />

              <AlertDescription>
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {finalizingFirm && (
            <Alert className="mb-4">
              <CheckCircle2 className="h-4 w-4" />

              <AlertDescription>
                Finishing your firm
                profile...
              </AlertDescription>
            </Alert>
          )}

          {isConfigured && (
            <>
              <div className="mb-4">
                <Button
                  type="button"
                  className="w-full"
                  onClick={
                    handleGoogle
                  }
                  disabled={busy}
                >
                  {busy
                    ? "Please wait..."
                    : "Continue with Google"}
                </Button>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>

                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    or
                  </span>
                </div>
              </div>
            </>
          )}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(
                    event.target.value
                  );

                  setFormError(
                    ""
                  );
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(
                    event.target.value
                  );

                  setFormError(
                    ""
                  );
                }}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                busy ||
                !isConfigured
              }
            >
              {finalizingFirm
                ? "Finishing Firm Profile..."
                : loading
                  ? "Signing in..."
                  : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <Link
              to="/reset-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>

            <p className="text-sm text-gray-600">
              Don&apos;t have an
              account?{" "}

              <Link
                to={signupUrl}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
