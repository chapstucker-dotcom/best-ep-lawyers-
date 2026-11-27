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

  // Production must never process sandbox events.
  if (event.livemode !== true) {
    console.warn("Ignoring non-live Stripe event:", event.id);
    return jsonResponse({
      received: true,
      ignored: true,
      reason: "non_live_event",
    });
  }

  const eventId = event.id;
  const claimToken = crypto.randomUUID();

  try {
    const { data: claim, error: claimError } =
      await supabaseAdmin.rpc("claim_stripe_webhook_event", {
        p_event_id: eventId,
        p_event_type: event.type,
        p_payload: event,
        p_claim_token: claimToken,
      });

    if (claimError) {
      throw new Error(
        `Webhook claim failed: ${claimError.message}`
      );
    }

    if (claim === "duplicate") {
      return jsonResponse({
        received: true,
        duplicate: true,
      });
    }

    if (claim === "busy") {
      return jsonResponse({
        error: "Event is already being processed",
      }, 503);
    }

    if (claim !== "claimed") {
      throw new Error("Unexpected webhook claim result");
    }

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        // Never activate membership before payment succeeds.
        if (session.payment_status !== "paid") {
          console.log("Checkout awaiting payment:", session.id);
          break;
        }

        if (
          session.mode !== "subscription" ||
          !session.customer ||
          !session.subscription
        ) {
          throw new Error(
            "Invalid paid subscription checkout session"
          );
        }

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

      case "invoice.paid":
      case "invoice.payment_failed":
      case "customer.subscription.updated": {
        let subscriptionId: string | null = null;

        if (event.type === "customer.subscription.updated") {
          const subscription =
            event.data.object as Stripe.Subscription;

          subscriptionId = subscription.id;
        } else {
          const eventInvoice =
            event.data.object as Stripe.Invoice;

          // Retrieve using our configured Stripe API version.
          const invoice =
            await stripe.invoices.retrieve(eventInvoice.id);

          subscriptionId =
            typeof invoice.subscription === "string"
              ? invoice.subscription
              : invoice.subscription?.id ?? null;
        }

        if (!subscriptionId) {
          break;
        }

        const { data: firm, error: lookupError } =
          await supabaseAdmin
            .from("firms")
            .select("id, stripe_customer_id")
            .eq("stripe_subscription_id", subscriptionId)
            .maybeSingle();

        if (lookupError) {
          throw new Error(
            `Billing lookup failed: ${lookupError.message}`
          );
        }

        // Do not modify unconnected or manual placements.
        if (!firm) {
          break;
        }

        // Retrieve current state to reduce stale-event risks.
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ["latest_invoice"],
          });

        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        if (
          !subscription.livemode ||
          customerId !== firm.stripe_customer_id
        ) {
          throw new Error("Billing account mismatch");
        }

        let paymentStatus: string | null = null;

        const latestInvoice =
          typeof subscription.latest_invoice === "object"
            ? subscription.latest_invoice
            : null;

        if (
          subscription.status === "past_due" ||
          subscription.status === "unpaid"
        ) {
          paymentStatus = "past_due";
        } else if (subscription.status === "active") {
          if (latestInvoice?.status === "paid") {
            paymentStatus = "paid";
          } else if (
            latestInvoice?.status === "open" &&
            latestInvoice.attempted &&
            latestInvoice.attempt_count > 0 &&
            event.type === "invoice.payment_failed" &&
            latestInvoice.id === event.data.object.id
          ) {
            paymentStatus = "past_due";
          }
        }

        if (paymentStatus) {
          const { error: updateError } =
            await supabaseAdmin
              .from("firms")
              .update({
                payment_status: paymentStatus,
              })
              .eq("id", firm.id)
              .eq("stripe_subscription_id", subscriptionId)
              .eq("stripe_customer_id", customerId);

          if (updateError) {
            throw new Error(
              `Billing status update failed: ${updateError.message}`
            );
          }

          console.log(
            "Subscription payment status synchronized:",
            subscriptionId,
            paymentStatus
          );
        }

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
          console.log(
            "Subscription already disconnected or not linked:",
            subscription.id
          );
          break;
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

    const { data: completedEvent, error: successError } =
      await supabaseAdmin
        .from("stripe_webhook_events")
        .update({
          status: "succeeded",
          processed_at:
            new Date().toISOString(),
        })
        .eq("stripe_event_id", eventId)
        .eq("processing_token", claimToken)
        .eq("status", "processing")
        .select("stripe_event_id")
        .maybeSingle();

    if (!completedEvent && !successError) {
      throw new Error("Webhook claim was lost");
    }

    if (successError) {
      throw new Error(
        `Could not mark event succeeded: ${successError.message}`
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
      .eq("stripe_event_id", eventId)
      .eq("processing_token", claimToken)
      .eq("status", "processing");

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