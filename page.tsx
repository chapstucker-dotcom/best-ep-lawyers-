"use client";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/#/auth/callback`,
      },
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ padding: 32, border: "1px solid #ddd", borderRadius: 10 }}>
        <h1 style={{ margin: 0 }}>Sign in</h1>
        <p style={{ marginTop: 8, marginBottom: 16, color: "#555" }}>
          Continue with Google to claim your firm profile.
        </p>

        <button
          onClick={signInWithGoogle}
          style={{ padding: "12px 16px", fontSize: 16, cursor: "pointer" }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

