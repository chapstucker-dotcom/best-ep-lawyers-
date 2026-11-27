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

    const message = status === "completed"
      ? "Confirm that membership, billing and placement changes have already been completed."
      : "Decline this membership change request?";

    if (!window.confirm(message)) return;

    setWorking(true);
    setError("");

    try {
      const { data, error } = await supabase.rpc(
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
        Confirm billing and inventory before marking a request completed.
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
                      Mark Completed
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