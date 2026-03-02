// supabase/functions/create-checkout/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@14.25.0";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SITE_URL = Deno.env.get("SITE_URL") || "http://localhost:5173";

// Your real Stripe Price IDs (you provided these)
const STRIPE_PRICE_IDS: Record<string, string> = {
  pro: "price_1StEa8COdLFRh1rKnxsEp84R",
  expert: "price_1StEaECOdLFRh1rKrC9U9X6D",
  category_featured: "price_1StEaLCOdLFRh1rKsPGJciAu",
  category_exclusive: "price_1StEaSCOdLFRh1rKllNB5v76",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const planKeyRaw = String(body.planKey || "").trim();
    const firmId = String(body.firmId || "").trim();
    const userId = String(body.userId || "").trim();

    if (!planKeyRaw || !firmId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing planKey, firmId, or userId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // normalize plan key: allow "category-featured" -> "category_featured"
    const planKey = planKeyRaw.replace(/-/g, "_");
    const priceId = STRIPE_PRICE_IDS[planKey];

    if (!priceId || !priceId.startsWith("price_")) {
      return new Response(
        JSON.stringify({ error: `Invalid planKey (${planKeyRaw}) or missing price mapping` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    // Create a checkout session for subscriptions
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout?canceled=true`,
      client_reference_id: firmId,
      metadata: {
        firm_id: firmId,
        user_id: userId,
        plan_key: planKey,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});// supabase/functions/create-checkout/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@14.25.0";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SITE_URL = Deno.env.get("SITE_URL") || "http://localhost:5173";

// Your real Stripe Price IDs
const STRIPE_PRICE_IDS: Record<string, string> = {
  pro: "price_1StEa8COdLFRh1rKnxsEp84R",
  expert: "price_1StEaECOdLFRh1rKrC9U9X6D",
  category_featured: "price_1StEaLCOdLFRh1rKsPGJciAu",
  category_exclusive: "price_1StEaSCOdLFRh1rKllNB5v76",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const planKeyRaw = String(body.planKey || "").trim();
    const firmId = String(body.firmId || "").trim();
    const userId = String(body.userId || "").trim();

    if (!planKeyRaw || !firmId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing planKey, firmId, or userId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // normalize: "category-featured" -> "category_featured"
    const planKey = planKeyRaw.replace(/-/g, "_");
    const priceId = STRIPE_PRICE_IDS[planKey];

    if (!priceId || !priceId.startsWith("price_")) {
      return new Response(
        JSON.stringify({ error: `Invalid planKey (${planKeyRaw}) or missing price mapping` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout?canceled=true`,
      client_reference_id: firmId,
      metadata: { firm_id: firmId, user_id: userId, plan_key: planKey },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});


