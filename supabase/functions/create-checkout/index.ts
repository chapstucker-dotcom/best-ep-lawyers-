// supabase/functions/create-checkout/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@14.25.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SITE_URL = Deno.env.get("SITE_URL") || "http://localhost:5173";

// Self-service checkout is restricted to Expert. Featured requires availability
// review; Exclusive must never be purchased through this endpoint.
const EXPERT_PRICE_ID = "price_1TXOu8C9X7qoxVlJLgqLVvfH";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      return jsonResponse({ error: "Checkout service is not configured" }, 500);
    }

    const authorization = req.headers.get("Authorization") || "";
    const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !authData.user) {
      return jsonResponse({ error: "Invalid or expired session" }, 401);
    }

    let body: { planKey?: unknown; firmId?: unknown };
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON request" }, 400);
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse({ error: "Invalid checkout request" }, 400);
    }

    const planKey = typeof body.planKey === "string"
      ? body.planKey.trim().toLowerCase().replace(/-/g, "_")
      : "";
    const firmId = typeof body.firmId === "string" ? body.firmId.trim() : "";

    if (planKey !== "expert") {
      return jsonResponse({ error: "This plan is not available through self-service checkout" }, 403);
    }
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(firmId)) {
      return jsonResponse({ error: "Invalid firm ID" }, 400);
    }

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: firm, error: firmError } = await adminClient
      .from("firms")
      .select("id, user_id, plan, plan_key, is_featured, is_exclusive, stripe_subscription_id")
      .eq("id", firmId)
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (firmError) {
      console.error("Checkout ownership lookup failed", firmError);
      return jsonResponse({ error: "Unable to verify firm ownership" }, 500);
    }
    if (!firm) {
      return jsonResponse({ error: "Firm not found or access denied" }, 403);
    }

    // A recorded subscription must be resolved through the existing billing
    // workflow before another self-service subscription can be created.
    const isNonFreePlan = (value: unknown): boolean => {
      if (typeof value !== "string") return false;
      const normalized = value.trim().toLowerCase().replace(/[\s_]+/g, "-");
      return normalized !== "" && normalized !== "free" && normalized !== "basic";
    };

    if (
      isNonFreePlan(firm.plan) ||
      isNonFreePlan(firm.plan_key) ||
      firm.is_featured === true ||
      firm.is_exclusive === true
    ) {
      return jsonResponse(
        { error: "This firm already has a paid plan or premium placement. Contact support for billing changes." },
        409
      );
    }
    if (firm.stripe_subscription_id) {
      return jsonResponse({ error: "This firm already has a recorded subscription. Contact support for billing changes." }, 409);
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: EXPERT_PRICE_ID, quantity: 1 }],
      success_url: `${SITE_URL}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/dashboard?checkout=canceled`,
      client_reference_id: firm.id,
      metadata: {
        firm_id: firm.id,
        user_id: authData.user.id,
        plan_key: "expert",
      },
    });

    return jsonResponse({ url: session.url }, 200);
  } catch (error) {
    console.error("Checkout creation failed", error);
    return jsonResponse({ error: "Unable to start checkout" }, 500);
  }
});
