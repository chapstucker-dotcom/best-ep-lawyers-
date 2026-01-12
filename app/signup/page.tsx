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
      <div style={{ padding: 32, border: "1px solid #ddd", borderRadius: 10, width: 360 }}>
        <h1 style={{ margin: 0 }}>Sign up</h1>
        <p style={{ marginTop: 8, marginBottom: 16, color: "#555" }}>
          Create your account.
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

        <div style={{ textAlign: "center", marginBottom: 12, color: "#888" }}>
          or
        </div>

        <form>
          <input type="email" placeholder="Email" style={{ width: "100%", padding: "12px", marginBottom: 12, border: "1px solid #ddd", borderRadius: 8 }} />
          <input type="password" placeholder="Password" style={{ width: "100%", padding: "12px", marginBottom: 12, border: "1px solid #ddd", borderRadius: 8 }} />
          <button type="submit" style={{ width: "100%", padding: "12px", borderRadius: 8, background: "#000", color: "#fff", cursor: "pointer" }}>Sign up</button>
        </form>
      </div>
    </div>
  );
}