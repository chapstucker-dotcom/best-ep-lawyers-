import { supabase } from "@/lib/supabase";

export default function Login() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ padding: 32, border: "1px solid #ddd", borderRadius: 8 }}>
        <h1>Sign in</h1>
        <button
          onClick={signInWithGoogle}
          style={{ marginTop: 16, padding: "12px 16px", fontSize: 16 }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
