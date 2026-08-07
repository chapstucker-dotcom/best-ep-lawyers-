import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  CheckCircle2,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  expert: "Expert",
  featured: "Category Featured",
  exclusive: "Category Exclusive",
};

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firmName: "",
    contactName: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const { signUp, signInWithGoogle, isConfigured } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const selectedPlan = useMemo(() => {
    const rawPlan = searchParams.get("plan")?.toLowerCase() || "free";
    return PLAN_LABELS[rawPlan] ? rawPlan : "free";
  }, [searchParams]);

  const selectedPlanLabel = PLAN_LABELS[selectedPlan];

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleGoogle = async () => {
    if (!isConfigured) {
      toast({
        title: "Registration unavailable",
        description:
          "Account creation is temporarily unavailable. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await signInWithGoogle();

    if (error) {
      toast({
        title: "Google signup failed",
        description: error.message,
        variant: "destructive",
      });

      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfigured) {
      toast({
        title: "Registration unavailable",
        description:
          "Account creation is temporarily unavailable. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters for your password.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please confirm your password and try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      firm_name: formData.firmName.trim(),
      contact_name: formData.contactName.trim(),
      phone: formData.phone.trim(),
      selected_plan: selectedPlan,
    });

    if (error) {
      toast({
        title: "Unable to create account",
        description: error.message,
        variant: "destructive",
      });

      setLoading(false);
      return;
    }

    toast({
      title: "Account created",
      description:
        "Check your email for verification, then sign in to complete your firm profile.",
    });

    navigate(`/login?plan=${selectedPlan}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        <section className="hidden flex-col justify-between p-12 text-white lg:flex">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                <Scale className="h-6 w-6" />
              </div>

              <div>
                <div className="text-lg font-bold">
                  El Paso&apos;s Best Lawyers
                </div>
                <div className="text-sm text-slate-400">
                  El Paso County Legal Directory
                </div>
              </div>
            </Link>

            <div className="mt-20 max-w-xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-amber-400">
                Build your firm&apos;s presence
              </p>

              <h1 className="text-5xl font-bold leading-tight">
                Put your law firm in front of people searching for legal help
                in El Paso.
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Create your firm account, complete your profile, showcase your
                attorneys, and manage your directory presence from one
                dashboard.
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex gap-4">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <div className="font-semibold">
                      Professional firm profile
                    </div>
                    <div className="text-sm text-slate-400">
                      Present your practice areas, attorneys, credentials, and
                      contact information.
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Users className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <div className="font-semibold">
                      Showcase your legal team
                    </div>
                    <div className="text-sm text-slate-400">
                      Add attorney profiles based on your subscription level.
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <TrendingUp className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <div className="font-semibold">
                      Upgrade as your visibility grows
                    </div>
                    <div className="text-sm text-slate-400">
                      Move into enhanced, featured, or category-exclusive
                      placement when you are ready.
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <div className="font-semibold">Manage your own listing</div>
                    <div className="text-sm text-slate-400">
                      Update your firm information through your secure account.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Directory participation does not guarantee leads, clients,
            rankings, or case outcomes.
          </p>
        </section>

        <section className="flex items-center justify-center bg-slate-50 px-4 py-10 sm:px-8">
          <Card className="w-full max-w-xl border-slate-200 shadow-xl">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-amber-400">
                  <Scale className="h-5 w-5" />
                </div>

                <span className="font-bold text-slate-950">
                  El Paso&apos;s Best Lawyers
                </span>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-600">
                  Selected plan: {selectedPlanLabel}
                </p>

                <CardTitle className="text-3xl">
                  Create your firm account
                </CardTitle>

                <CardDescription className="mt-2 text-base">
                  Start building your law firm&apos;s directory presence.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              {!isConfigured && (
                <Alert variant="destructive" className="mb-5">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Registration is temporarily unavailable because the
                    authentication service is not configured.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="button"
                variant="outline"
                className="mb-5 w-full"
                onClick={handleGoogle}
                disabled={loading || !isConfigured}
              >
                {loading ? "Redirecting..." : "Continue with Google"}
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>

                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-500">
                    or create an account with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firmName">Law Firm Name</Label>
                    <Input
                      id="firmName"
                      value={formData.firmName}
                      onChange={(e) =>
                        updateField("firmName", e.target.value)
                      }
                      placeholder="Smith Law Firm"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) =>
                        updateField("contactName", e.target.value)
                      }
                      placeholder="Jane Smith"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="(915) 555-0123"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="you@lawfirm.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        updateField("password", e.target.value)
                      }
                      minLength={8}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                      minLength={8}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-400 text-slate-950 hover:bg-amber-300"
                  disabled={loading || !isConfigured}
                >
                  {loading
                    ? "Creating account..."
                    : `Create ${selectedPlanLabel} Account`}
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-slate-950 hover:underline"
                >
                  Sign in
                </Link>
              </p>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                By creating an account, you agree to provide accurate law firm
                information and comply with the directory&apos;s terms and
                policies.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}