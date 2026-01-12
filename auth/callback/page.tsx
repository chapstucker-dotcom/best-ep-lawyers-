"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  useEffect(() => {
    supabase.auth.getSession().then(() => {
      window.location.replace("/#/dashboard");
    });
  }, []);

  return <div style={{ padding: 40 }}>Signing you in…</div>;
}
