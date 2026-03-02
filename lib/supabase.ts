import { createClient } from "@supabase/supabase-js";

const readEnv = (key: string) => {
  // Works in Vite (import.meta.env) and Next.js (process.env)
  // Vite:
  // @ts-ignore
  const vite = typeof import.meta !== "undefined" ? import.meta.env?.[key] : undefined;

  // Next:
  const next = typeof process !== "undefined" ? (process.env as any)?.[key] : undefined;

  return vite || next || "";
};

// Prefer standardized names first:
const supabaseUrl =
  readEnv("VITE_SUPABASE_URL") ||
  readEnv("NEXT_PUBLIC_SUPABASE_URL") ||
  // backward-compat with your older "database" names if they exist:
  readEnv("VITE_database_URL") ||
  readEnv("NEXT_PUBLIC_database_URL");

const supabaseAnonKey =
  readEnv("VITE_SUPABASE_ANON_KEY") ||
  readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
  // backward-compat with your older "database" names if they exist:
  readEnv("VITE_database_ANON_KEY") ||
  readEnv("NEXT_PUBLIC_database_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);