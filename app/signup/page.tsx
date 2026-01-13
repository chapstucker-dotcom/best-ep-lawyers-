"use client";

import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const continueWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ padding: 32, border: "1px solid #ddd", borderRadius: 10, width: 420 }}>
        <h1 style={{ margin: 0 }}>Create Account</h1>
        <p style={{ marginTop: 8, marginBottom: 16, color: "#555" }}>
          Register your law firm
        </p>

        <button
          type="button"
          onClick={continueWithGoogle}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          Continue with Google
        </button>

        <div style={{ textAlign: "center", marginBottom: 12, color: "#888" }}>or</div>

        {/* Placeholder form (keep yours if you already have one) */}
        <input placeholder="Law Firm Name" style={{ width: "100%", padding: 12, marginBottom: 10, borderRadius: 8, border: "1px solid #ddd" }} />
        <input placeholder="Contact Name" style={{ width: "100%", padding: 12, marginBottom: 10, borderRadius: 8, border: "1px solid #ddd" }} />
        <input placeholder="Phone" style={{ width: "100%", padding: 12, marginBottom: 10, borderRadius: 8, border: "1px solid #ddd" }} />
        <input placeholder="Email" style={{ width: "100%", padding: 12, marginBottom: 10, borderRadius: 8, border: "1px solid #ddd" }} />
        <input placeholder="Password" type="password" style={{ width: "100%", padding: 12, marginBottom: 10, borderRadius: 8, border: "1px solid #ddd" }} />
        <input placeholder="Confirm Password" type="password" style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 8, border: "1px solid #ddd" }} />

        <button style={{ width: "100%", padding: 12, borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer" }}>
          Sign Up
        </button>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <a href="/login">Already have an account? Sign in</a>
        </div>
      </div>
    </div>
  );
}