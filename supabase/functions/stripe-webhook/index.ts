import Stripe from "https://esm.sh/stripe@14.0.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}
if (!stripeWebhookSecret) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET");
}
if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL");
}
if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
});

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200 });
  }

  if (req.method !== "POST") {
    return new Response(`Method ${req.method} not allowed`, { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
  event = await stripe.webhooks.constructEventAsync(
  rawBody,
  signature,
  stripeWebhookSecret,
);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("stripe-webhook verification failed:", msg);
    return new Response(`Webhook Error: ${msg}`, { status: 400 });
  }

  const eventId = event.id;

  try {
    // Idempotency check
    const { data: existingEvent, error: existingEventError } = await supabaseAdmin
      .from("stripe_webhook_events")
      .select("stripe_event_id, status")
      .eq("stripe_event_id", eventId)
      .maybeSingle();

    if (existingEventError) {
      console.error("Failed to check existing stripe_webhook_events record:", existingEventError);
      return jsonResponse(
        { error: "Failed idempotency check", details: existingEventError.message },
        500,
      );
    }

    if (existingEvent?.stripe_event_id) {
      console.log("Webhook already processed:", eventId, existingEvent.status);
      return jsonResponse({ received: true, duplicate: true }, 200);
    }

    const { error: insertEventError } = await supabaseAdmin
      .from("stripe_webhook_events")
      .insert({
        stripe_event_id: eventId,
        event_type: event.type,
        payload: event,
        status: "received",
      });

    if (insertEventError) {
      console.error("Failed to insert stripe_webhook_events record:", insertEventError);
      return jsonResponse(
        { error: "Failed to create webhook event record", details: insertEventError.message },
        500,
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const firmId = session.client_reference_id;
        const stripeCustomerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null;
        const stripeSubscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id ?? null;

        // Adjust plan mapping if your app stores a different allowed value.
        const planKey =
          session.metadata?.plan_key ??
          session.metadata?.planKey ??
          null;

        if (!firmId) {
          console.error("Missing session.client_reference_id; cannot map to firm.");
          throw new Error("Missing session.client_reference_id");
        }

        // Optional: store normalized subscription source of truth
        if (stripeSubscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

          const normalizedPlanKey =
            subscription.items.data[0]?.price?.id ?? planKey;

          const { error: subUpsertError } = await supabaseAdmin
            .from("subscriptions")
            .upsert(
              {
                firm_id: firmId,
                stripe_subscription_id: stripeSubscriptionId,
                stripe_customer_id: stripeCustomerId,
                status: subscription.status,
                plan_key: normalizedPlanKey,
              },
              { onConflict: "stripe_subscription_id" },
            );

          if (subUpsertError) {
            console.error("Failed to upsert subscriptions row:", subUpsertError);
            throw subUpsertError;
          }
        }

        const { error: firmUpdateError } = await supabaseAdmin
          .from("firms")
          .update({
            plan_key: planKey,
            payment_status: "paid",
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
          })
          .eq("id", firmId);

        if (firmUpdateError) {
          console.error("Failed to update firms row:", firmUpdateError);
          throw firmUpdateError;
        }

        console.log("checkout.session.completed processed for firm:", firmId);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const firmId =
          paymentIntent.metadata?.client_reference_id ??
          paymentIntent.metadata?.firm_id ??
          paymentIntent.metadata?.firmId ??
          null;

        const stripeCustomerId =
          typeof paymentIntent.customer === "string"
            ? paymentIntent.customer
            : paymentIntent.customer?.id ?? null;

        const stripeSubscriptionId =
          paymentIntent.metadata?.stripe_subscription_id ?? null;

        const planKey =
          paymentIntent.metadata?.plan_key ??
          paymentIntent.metadata?.planKey ??
          null;

        if (!firmId) {
          console.log("payment_intent.succeeded missing firm mapping; skipping firm update");
          break;
        }

        const { error: firmUpdateError } = await supabaseAdmin
          .from("firms")
          .update({
            plan_key: planKey,
            payment_status: "succeeded",
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
          })
          .eq("id", firmId);

        if (firmUpdateError) {
          console.error("Failed to update firms row from payment_intent.succeeded:", firmUpdateError);
          throw firmUpdateError;
        }

        console.log("payment_intent.succeeded processed for firm:", firmId);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const stripeSubscriptionId = subscription.id;
        const stripeCustomerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        const planKey = subscription.items.data[0]?.price?.id ?? null;

        const { data: existingSubscription, error: existingSubscriptionError } =
          await supabaseAdmin
            .from("subscriptions")
            .select("firm_id")
            .eq("stripe_subscription_id", stripeSubscriptionId)
            .maybeSingle();

        if (existingSubscriptionError) {
          console.error("Failed to load existing subscription:", existingSubscriptionError);
          throw existingSubscriptionError;
        }

        const { error: subUpsertError } = await supabaseAdmin
          .from("subscriptions")
          .upsert(
            {
              firm_id: existingSubscription?.firm_id ?? null,
              stripe_subscription_id: stripeSubscriptionId,
              stripe_customer_id: stripeCustomerId,
              status: subscription.status,
              plan_key: planKey,
            },
            { onConflict: "stripe_subscription_id" },
          );

        if (subUpsertError) {
          console.error("Failed to upsert subscription update:", subUpsertError);
          throw subUpsertError;
        }

        if (existingSubscription?.firm_id) {
          const { error: firmUpdateError } = await supabaseAdmin
            .from("firms")
            .update({
              plan_key: planKey,
              payment_status: subscription.status,
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: stripeSubscriptionId,
            })
            .eq("id", existingSubscription.firm_id);

          if (firmUpdateError) {
            console.error("Failed to update firm from subscription.updated:", firmUpdateError);
            throw firmUpdateError;
          }
        }

        console.log("customer.subscription.updated processed:", stripeSubscriptionId);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const stripeSubscriptionId = subscription.id;
        const stripeCustomerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        const { data: existingSubscription, error: existingSubscriptionError } =
          await supabaseAdmin
            .from("subscriptions")
            .select("firm_id")
            .eq("stripe_subscription_id", stripeSubscriptionId)
            .maybeSingle();

        if (existingSubscriptionError) {
          console.error("Failed to load existing subscription for delete:", existingSubscriptionError);
          throw existingSubscriptionError;
        }

        const { error: subUpdateError } = await supabaseAdmin
          .from("subscriptions")
          .upsert(
            {
              firm_id: existingSubscription?.firm_id ?? null,
              stripe_subscription_id: stripeSubscriptionId,
              stripe_customer_id: stripeCustomerId,
              status: "canceled",
              plan_key: subscription.items.data[0]?.price?.id ?? null,
            },
            { onConflict: "stripe_subscription_id" },
          );

        if (subUpdateError) {
          console.error("Failed to mark subscription canceled:", subUpdateError);
          throw subUpdateError;
        }

        if (existingSubscription?.firm_id) {
          const { error: firmUpdateError } = await supabaseAdmin
            .from("firms")
            .update({
              payment_status: "canceled",
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: stripeSubscriptionId,
            })
            .eq("id", existingSubscription.firm_id);

          if (firmUpdateError) {
            console.error("Failed to update firm from subscription.deleted:", firmUpdateError);
            throw firmUpdateError;
          }
        }

        console.log("customer.subscription.deleted processed:", stripeSubscriptionId);
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
        break;
    }

    const { error: markSucceededError } = await supabaseAdmin
      .from("stripe_webhook_events")
      .update({
        status: "succeeded",
        processed_at: new Date().toISOString(),
      })
      .eq("stripe_event_id", eventId);

    if (markSucceededError) {
      console.error("Failed to mark webhook event succeeded:", markSucceededError);
      return jsonResponse(
        { error: "Processed event but failed to mark success", details: markSucceededError.message },
        500,
      );
    }

    return jsonResponse({ received: true }, 200);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Webhook handler failed:", msg);

    const { error: markFailedError } = await supabaseAdmin
      .from("stripe_webhook_events")
      .update({
        status: "failed",
        processed_at: new Date().toISOString(),
      })
      .eq("stripe_event_id", eventId);

    if (markFailedError) {
      console.error("Failed to mark webhook event failed:", markFailedError);
    }

    return jsonResponse({ error: "Webhook processing failed", details: msg }, 500);
  }
});