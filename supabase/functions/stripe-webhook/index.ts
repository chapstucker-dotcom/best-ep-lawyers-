import Stripe from "https://esm.sh/stripe@14.0.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY");
if (!stripeWebhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
if (!supabaseUrl) throw new Error("Missing SUPABASE_URL");
if (!supabaseServiceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
});

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const normalizePlan = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

const getPlanFromAmount = (
  amountTotal: number | null
): string | null => {
  switch (amountTotal) {
    case 29900:
      return "expert";

    case 200000:
      return "category-featured";

    case 500000:
      return "category-exclusive";

    default:
      return null;
  }
};

const determinePlan = (
  session: Stripe.Checkout.Session
): string | null => {
  /*
   * Support both the correctly named metadata
   * and the current Stripe metadata that has
   * an accidental leading space.
   */
  const metadataPlan =
    session.metadata?.plan_key ??
    session.metadata?.planKey ??
    session.metadata?.[" plan_key"] ??
    null;

  if (metadataPlan) {
    const normalized = normalizePlan(metadataPlan);

    if (
      normalized === "expert" ||
      normalized === "category-featured" ||
      normalized === "category-exclusive"
    ) {
      return normalized;
    }
  }

  /*
   * Fallback to the known monthly prices.
   * Stripe stores amounts in cents.
   */
  return getPlanFromAmount(session.amount_total ?? null);
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      `Method ${req.method} not allowed`,
      {
        status: 405,
      }
    );
  }

  const signature =
    req.headers.get("stripe-signature");

  if (!signature) {
    return new Response(
      "Missing stripe-signature header",
      {
        status: 400,
      }
    );
  }

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event =
      await stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        stripeWebhookSecret
      );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    console.error(
      "Stripe signature verification failed:",
      message
    );

    return new Response(
      `Webhook Error: ${message}`,
      {
        status: 400,
      }
    );
  }

  const eventId = event.id;

  try {
    /*
     * Only skip events that ACTUALLY succeeded.
     *
     * Failed events are allowed to retry.
     */
    const {
      data: existingEvent,
      error: existingEventError,
    } = await supabaseAdmin
      .from("stripe_webhook_events")
      .select("stripe_event_id, status")
      .eq("stripe_event_id", eventId)
      .maybeSingle();

    if (existingEventError) {
      throw new Error(
        `Could not check webhook event: ${existingEventError.message}`
      );
    }

    if (
      existingEvent?.stripe_event_id &&
      existingEvent.status === "succeeded"
    ) {
      console.log(
        "Webhook already successfully processed:",
        eventId
      );

      return jsonResponse({
        received: true,
        duplicate: true,
      });
    }

    /*
     * Create the event only if it does not
     * already exist.
     */
    if (!existingEvent?.stripe_event_id) {
      const { error: insertError } =
        await supabaseAdmin
          .from("stripe_webhook_events")
          .insert({
            stripe_event_id: eventId,
            event_type: event.type,
            payload: event,
            status: "received",
          });

      if (insertError) {
        throw new Error(
          `Could not create webhook record: ${insertError.message}`
        );
      }
    } else {
      /*
       * Reset a previous failed event so
       * this retry can be processed.
       */
      await supabaseAdmin
        .from("stripe_webhook_events")
        .update({
          status: "received",
          payload: event,
        })
        .eq("stripe_event_id", eventId);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        const firmId =
          session.client_reference_id;

        if (!firmId) {
          throw new Error(
            "Missing session.client_reference_id"
          );
        }

        const planKey =
          determinePlan(session);

        if (!planKey) {
          throw new Error(
            `Unable to determine plan from checkout. amount_total=${session.amount_total}`
          );
        }

        console.log(
          "Activating plan:",
          planKey,
          "for firm:",
          firmId
        );

        /*
         * IMPORTANT:
         * Only update columns that actually
         * exist in your firms table.
         */
        const {
          data: updatedFirm,
          error: firmUpdateError,
        } = await supabaseAdmin
          .from("firms")
          .update({
            plan: planKey,
            plan_key: planKey,
            payment_status: "paid",

            stripe_customer_id:
              typeof session.customer === "string"
                ? session.customer
                : session.customer?.id ?? null,

            stripe_subscription_id:
              typeof session.subscription === "string"
                ? session.subscription
                : session.subscription?.id ?? null,

            is_featured:
              planKey === "category-featured",

            is_exclusive:
              planKey === "category-exclusive",
          })
          .eq("id", firmId)
          .select(
            "id, name, plan, plan_key, payment_status, is_featured, is_exclusive, stripe_customer_id, stripe_subscription_id"
          )
          .maybeSingle();

        if (firmUpdateError) {
          throw new Error(
            `Firm update failed: ${firmUpdateError.message}`
          );
        }

        if (!updatedFirm) {
          throw new Error(
            `No firm found for ID ${firmId}`
          );
        }

        console.log(
          "Firm subscription activated:",
          updatedFirm
        );

        break;
      }

      case "customer.subscription.deleted": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const {
          data: canceledFirm,
          error: cancellationError,
        } = await supabaseAdmin
          .from("firms")
          .update({
            plan: "free",
            plan_key: "free",
            payment_status: "canceled",
            is_featured: false,
            is_exclusive: false,
            stripe_subscription_id: null,
          })
          .eq(
            "stripe_subscription_id",
            subscription.id
          )
          .select(
            "id, name, plan, plan_key, payment_status"
          )
          .maybeSingle();

        if (cancellationError) {
          throw new Error(
            `Subscription cancellation update failed: ${cancellationError.message}`
          );
        }

        if (!canceledFirm) {
          throw new Error(
            `No firm found for Stripe subscription ${subscription.id}`
          );
        }

        console.log(
          "Firm subscription canceled:",
          canceledFirm
        );

        break;
      }

      default:
        console.log(
          "Ignoring event type:",
          event.type
        );
    }

    const { error: successError } =
      await supabaseAdmin
        .from("stripe_webhook_events")
        .update({
          status: "succeeded",
          processed_at:
            new Date().toISOString(),
        })
        .eq("stripe_event_id", eventId);

    if (successError) {
      console.error(
        "Could not mark event succeeded:",
        successError
      );
    }

    return jsonResponse({
      received: true,
      event: event.type,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    console.error(
      "Webhook processing failed:",
      message
    );

    await supabaseAdmin
      .from("stripe_webhook_events")
      .update({
        status: "failed",
        processed_at:
          new Date().toISOString(),
      })
      .eq("stripe_event_id", eventId);

    return jsonResponse(
      {
        error:
          "Webhook processing failed",
        details: message,
      },
      500
    );
  }
});