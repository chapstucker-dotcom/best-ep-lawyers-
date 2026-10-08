import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Scale, AlertTriangle } from "lucide-react";
import { useSeo } from "../hooks/use-seo";

export default function ResetPassword() {
  useSeo({
    title: "Reset Password | El Paso's Best Lawyers",
    description: "Reset the password for your El Paso's Best Lawyers account.",
    path: "/reset-password",
    robots: "noindex, nofollow",
  });

  const navigate = useNavigate();
  const { resetPassword, updatePassword, isConfigured } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    if (!isConfigured) return;
    let mounted = true;

    const checkRecoverySession = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted && data.session && (new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery" || new URLSearchParams(window.location.search).get("type") === "recovery")) setRecoveryMode(true);
    };

    void checkRecoverySession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfigured) {
      toast({
        title: "Demo Mode",
        description: "Password reset is not available in demo mode. Please contact the administrator.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
      toast({ title: "Success", description: "Password reset email sent!" });
    }

    setLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Enter the same password in both fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);

    if (error) {
      toast({
        title: "Unable to update password",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Password updated",
      description: "Your new password has been saved.",
    });

    setLoading(false);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Scale className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {recoveryMode ? "Create New Password" : "Reset Password"}
          </CardTitle>
          <CardDescription>
            {recoveryMode
              ? "Enter a new password for your account."
              : "Enter your email to receive a reset link."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isConfigured && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Demo mode: Password reset is currently unavailable.
              </AlertDescription>
            </Alert>
          )}

          {recoveryMode ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !isConfigured}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          ) : !sent ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !isConfigured}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-green-600">Check your email for the reset link.</p>
              <Button asChild className="w-full">
                <Link to="/login">Back to Login</Link>
              </Button>
            </div>
          )}

          {!recoveryMode && (
            <p className="mt-4 text-center text-sm text-gray-600">
              <Link to="/login" className="text-blue-600 hover:underline">
                Back to login
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
