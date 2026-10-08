import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function AccountSecurity() {
  const { user, isConfigured } = useAuth();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(false);

    if (!isConfigured || !user?.email) {
      toast({
        title: "Account unavailable",
        description: "Please sign in to manage your password.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least eight characters.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please confirm your new password.",
        variant: "destructive",
      });
      return;
    }

    if (currentPassword === newPassword) {
      toast({
        title: "Choose a different password",
        description: "Your new password must differ from your current password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error: verifyError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

      if (verifyError) {
        toast({
          title: "Current password incorrect",
          description: "Please check your current password and try again.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast({
          title: "Password update failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);

      toast({
        title: "Password updated",
        description: "Your account password has been changed successfully.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl rounded-lg border bg-white p-6">
      <h2 className="text-xl font-semibold">Account Security</h2>
      <p className="mt-2 text-sm text-gray-600">
        Change the password used to access your firm dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-account-password">New Password</Label>
          <Input
            id="new-account-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-account-password">
            Confirm New Password
          </Label>
          <Input
            id="confirm-account-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        {success && (
          <p role="status" aria-live="polite" className="rounded-md border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-800">
            Password updated successfully. Your new password is ready to use.
          </p>
        )}
        <Button type="submit" disabled={loading || !isConfigured}>
          {loading ? "Updating Password..." : "Change Password"}
        </Button>
      </form>
    </section>
  );
}