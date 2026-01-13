"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        // This ensures the session is loaded after OAuth redirect
        await supabase.auth.getSession();
      } finally {
        router.replace("/dashboard");
      }
    };
    run();
  }, [router]);

  return <div style={{ padding: 40 }}>Signing you in...</div>;
}
