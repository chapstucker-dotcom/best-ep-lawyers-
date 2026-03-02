"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      setEmail(session.user.email ?? "");
      setLoading(false);
    };

    run();
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) return <div style={{ padding: 40 }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: 40, maxWidth: 720 }}>
      <h1 style={{ marginTop: 0 }}>Welcome Back!</h1>
      <p>Signed in as: <b>{email}</b></p>

      <button
        onClick={logout}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #ddd",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        Sign out
      </button>
    </div>
  );
}