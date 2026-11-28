import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PlanRequest = {
  id: string;
  firm_id: string;
  firm_name: string;
  current_plan: string;
  requested_plan: string;
  legal_market: string | null;
  status: string;
  created_at: string;
};

const labels: Record<string, string> = {
  free: "Free Listing",
  expert: "Expert",
  "category-featured": "Category Featured",
  "category-exclusive": "Market Exclusive",
};

export default function PlanChangeRequestsAdmin() {
  const [requests, setRequests] = useState<PlanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.rpc(
        "get_firm_plan_change_requests",
        { p_firm_id: null }
      );

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      setError(
        (error as { message?: string }).message ||
        "Unable to load plan requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const resolve = async (
    request: PlanRequest,
    status: "completed" | "declined"
  ) => {
    if (!supabase || working) return;

    const applyingFree =
      status === "completed" &&
      request.requested_plan === "free";

    const applyingPaid =
      status === "completed" &&
      ["expert", "category-featured"].includes(request.requested_plan);

    let paymentReference = "";
    let paymentAmountCents = 0;

    setError("");

    if (status === "completed" && !applyingFree && !applyingPaid) {
      setError("Unsupported membership change.");
      return;
    }

    if (applyingPaid) {
      const expectedAmount =
        request.requested_plan === "expert" ? 29900 : 200000;

      const reference = window.prompt(
        "Enter the independently verified payment or receipt reference. Do not enter card or bank account details."
      );

      if (reference === null) return;

      paymentReference = reference.trim();

      if (paymentReference.length < 5 || paymentReference.length > 200) {
        setError("A valid payment reference is required.");
        return;
      }

      const amount = window.prompt(
        `Enter the verified payment amount in USD. Required: $${(expectedAmount / 100).toFixed(2)}`
      );

      if (amount === null) return;

      if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) {
        setError("Enter a valid dollar amount.");
        return;
      }

      paymentAmountCents = Math.round(Number(amount) * 100);

      if (paymentAmountCents !== expectedAmount) {
        setError("Payment amount does not match the requested membership.");
        return;
      }
    }

    const message = applyingFree
      ? "Approve this Free downgrade? Confirm that all billing and contractual obligations have been resolved. This immediately removes premium placement benefits while preserving the firm profile."
      : applyingPaid
        ? `Activate the requested paid membership for ${request.firm_name}? Confirm that payment has been independently verified and existing contractual obligations have been resolved. This action does not collect payment or establish recurring billing.`
        : "Decline this membership change request?";

    if (!window.confirm(message)) return;

    setWorking(true);
    setError("");

    try {
      const { data, error } = applyingFree
        ? await supabase.rpc(
            "apply_free_plan_change",
            {
              p_request_id: request.id,
              p_billing_confirmed: true,
            }
          )
        : applyingPaid
          ? await supabase.rpc(
              "apply_paid_plan_change",
              {
                p_request_id: request.id,
                p_payment_reference: paymentReference,
                p_payment_amount_cents: paymentAmountCents,
                p_payment_confirmed: true,
              }
            )
          : await supabase.rpc(
              "resolve_firm_plan_change_request",
              {
                p_request_id: request.id,
                p_status: status,
              }
            );

      if (error) throw error;
      if (!data) throw new Error("Request resolution was not confirmed.");

      await refresh();
    } catch (error) {
      setError(
        (error as { message?: string }).message ||
        "Unable to resolve request."
      );
    } finally {
      setWorking(false);
    }
  };

  const pending = requests.filter((request) => request.status === "pending");

  return (
    <section className="mb-10 rounded-2xl border border-teal-400/30 bg-slate-900 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-teal-300">
          Membership Plan Requests
        </h2>
        <button
          type="button"
          disabled={loading || working}
          onClick={() => void refresh()}
          className="rounded-lg border border-slate-500 px-4 py-2 text-sm"
        >
          Refresh
        </button>
      </div>

      <p className="mt-2 text-sm text-slate-300">
        Review customer membership changes and premium placement requests.
        Verify billing and contractual obligations before approval. Paid memberships require a verified payment reference and amount. Featured inventory is checked by the server.
      </p>

      {error && <p role="alert" className="mt-4 text-red-300">{error}</p>}

      {loading ? (
        <p className="mt-4">Loading requests...</p>
      ) : (
        <>
          <p className="mt-4 font-semibold">
            Pending requests: {pending.length}
          </p>

          {pending.length === 0 && !error && (
            <p className="mt-2 text-slate-400">No pending plan changes.</p>
          )}

          <div className="mt-4 space-y-4">
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-xl border border-slate-700 p-4"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="font-semibold">{request.firm_name || request.firm_id}</h3>
                  <span className="text-sm capitalize">{request.status}</span>
                </div>

                <p className="mt-2 text-sm">
                  {labels[request.current_plan] || request.current_plan}
                  {" → "}
                  {labels[request.requested_plan] || request.requested_plan}
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  Market: {request.legal_market || "Not specified"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Firm ID: {request.firm_id}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {new Date(request.created_at).toLocaleString()}
                </p>

                {request.status === "pending" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={working || loading}
                      onClick={() => void resolve(request, "completed")}
                      className="rounded-lg bg-teal-700 px-4 py-2 text-sm text-white"
                    >
                      {request.requested_plan === "free" ? "Approve & Apply Downgrade" : "Approve & Apply Paid Membership"}
                    </button>
                    <button
                      type="button"
                      disabled={working || loading}
                      onClick={() => void resolve(request, "declined")}
                      className="rounded-lg border border-red-400/50 px-4 py-2 text-sm text-red-300"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}