"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  useEffect(() => {
    supabase.auth.getSession().then(() => {
      // After Google login, send user to dashboard
      window.location.replace("/#/dashboard");

    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div>Signing you in…</div>
    </div>
  );
}
