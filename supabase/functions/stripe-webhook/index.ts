// supabase/functions/stripe-webhook/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@14.25.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      return new Response("Missing Stripe secrets", { status: 500, headers: corsHeaders });
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response("Missing Supabase service role", { status: 500, headers: corsHeaders });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    const signature = req.headers.get("stripe-signature");
    if (!signature) return new Response("Missing stripe-signature", { status: 400, headers: corsHeaders });

    const rawBody = await req.text();

    const event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Handle events
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const firmId = String(session.metadata?.firm_id || session.client_reference_id || "");
      const planKey = String(session.metadata?.plan_key || "");
      const customerId = String(session.customer || "");
      const subscriptionId = String(session.subscription || "");

      if (firmId) {
        await supabaseAdmin
          .from("firms")
          .update({
            plan_key: planKey,
            payment_status: "active",
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            approved: true,
          })
          .eq("id", firmId);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const subscriptionId = String(sub.id || "");

      if (subscriptionId) {
        // mark firm canceled
        await supabaseAdmin
          .from("firms")
          .update({ payment_status: "canceled" })
          .eq("stripe_subscription_id", subscriptionId);

        // deactivate placements tied to that firm(s)
        const { data: firms } = await supabaseAdmin
          .from("firms")
          .select("id")
          .eq("stripe_subscription_id", subscriptionId);

        if (firms?.length) {
          const ids = firms.map((f) => f.id);
          await supabaseAdmin
            .from("firm_placements")
            .update({ is_active: false })
            .in("firm_id", ids);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    // Stripe signature errors will land here
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
