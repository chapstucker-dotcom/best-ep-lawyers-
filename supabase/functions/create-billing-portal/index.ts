// supabase/functions/create-billing-portal/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@14.25.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SITE_URL = Deno.env.get("SITE_URL");
// Set this to a dedicated Stripe portal configuration with plan switching disabled.
const STRIPE_BILLING_PORTAL_CONFIGURATION_ID = Deno.env.get(
  "STRIPE_BILLING_PORTAL_CONFIGURATION_ID",
);

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

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    if (
      !STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY ||
      !SUPABASE_SERVICE_ROLE_KEY || !SITE_URL ||
      !STRIPE_BILLING_PORTAL_CONFIGURATION_ID
    ) {
      return jsonResponse({ error: "Billing management is not configured" }, 503);
    }

    let returnUrl: string;
    try {
      const site = new URL(SITE_URL);
      if (site.protocol !== "https:" && site.hostname !== "localhost") {
        throw new Error("Invalid site URL");
      }
      returnUrl = new URL("/dashboard", site.origin).toString();
    } catch {
      return jsonResponse({ error: "Billing management is not configured" }, 503);
    }

    const authorization = req.headers.get("Authorization") || "";
    const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) return jsonResponse({ error: "Authentication required" }, 401);

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !authData.user) {
      return jsonResponse({ error: "Invalid or expired session" }, 401);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON request" }, 400);
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse({ error: "Invalid billing request" }, 400);
    }
    const firmId = (body as { firmId?: unknown }).firmId;
    if (typeof firmId !== "string" || !uuidPattern.test(firmId)) {
      return jsonResponse({ error: "Invalid firm ID" }, 400);
    }

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: firm, error: firmError } = await adminClient
      .from("firms")
      .select("id, user_id, stripe_customer_id, stripe_subscription_id")
      .eq("id", firmId)
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (firmError) {
      console.error("Billing portal ownership lookup failed", firmError);
      return jsonResponse({ error: "Unable to verify firm ownership" }, 500);
    }
    if (!firm) return jsonResponse({ error: "Firm not found or access denied" }, 403);
    if (!firm.stripe_customer_id || !firm.stripe_subscription_id) {
      return jsonResponse({ error: "No active billing account is connected to this firm" }, 409);
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
    // Verify the stored subscription actually belongs to the stored customer.
    const subscription = await stripe.subscriptions.retrieve(firm.stripe_subscription_id);
    const subscriptionCustomer = typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
    if (subscriptionCustomer !== firm.stripe_customer_id) {
      console.error("Billing portal customer/subscription mismatch for firm", firm.id);
      return jsonResponse({ error: "Billing account requires support review" }, 409);
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: firm.stripe_customer_id,
      configuration: STRIPE_BILLING_PORTAL_CONFIGURATION_ID,
      return_url: returnUrl,
    });

    return jsonResponse({ url: portalSession.url }, 200);
  } catch (error) {
    console.error("Billing portal creation failed", error);
    return jsonResponse({ error: "Unable to open billing management" }, 500);
  }
});
