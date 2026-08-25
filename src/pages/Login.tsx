import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { saveFirmProfile } from "@/services/firmService";

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
    searchParams.get("plan") ||
    storedPlan ||
    "";

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

  const finalizePendingFirm =
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

          categories: [
            practiceArea,
          ],

          specialties: [
            practiceArea,
          ],

          plan: "free",
          plan_key: "free",

          is_featured: false,
          featured: false,

          exclusive: false,

          is_verified: false,
          verified: false,
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
       * Preserve the paid plan request.
       * Stripe will activate it later.
       */
      if (
        pending.requestedPlan
      ) {
        localStorage.setItem(
          "pending-checkout-plan",
          pending.requestedPlan
        );

        localStorage.setItem(
          "selected-firm-plan",
          pending.requestedPlan
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