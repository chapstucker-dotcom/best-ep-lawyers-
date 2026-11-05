import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useSeo } from "../hooks/use-seo";

type ModerationStatus = "pending" | "published" | "rejected" | "disputed" | "removed";
type DisputeStatus = "submitted" | "reviewing" | "resolved" | "dismissed" | null;

interface ModerationReview {
  id: string;
  firm_id: string;
  firm_name: string | null;
  reviewer_name: string | null;
  reviewer_email: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  moderation_status: ModerationStatus;
  moderated_at: string | null;
  firm_response: string | null;
  firm_response_at: string | null;
  dispute_status: DisputeStatus;
  dispute_reason: string | null;
  dispute_details: string | null;
  disputed_at: string | null;
}

interface ConsumerLead {
  id: string;
  created_at: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  legal_issue: string | null;
  practice_area: string | null;
  firm_name: string | null;
  firm_id: string | null;
  status: string | null;
  source_url: string | null;
  landing_page: string | null;
  referrer: string | null;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  matter_location: string | null;
  matter_timing: string | null;
}

const LEAD_STATUSES = ["new", "contacted", "in_progress", "closed"] as const;

type ModerationAction = "published" | "rejected" | "removed";
type DisputeAction = "resolved" | "dismissed";

const formatDate = (value: string | null) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatLabel = (value: string | null) => {
  if (!value) return "None";
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function AdminDashboard() {
  useSeo({
    title: "Admin Dashboard | El Paso's Best Lawyers",
    description: "Administrative review moderation dashboard.",
    path: "/admin",
    robots: "noindex, nofollow",
  });

  const [leads, setLeads] = useState<ConsumerLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [leadActionError, setLeadActionError] = useState<string | null>(null);
  const [workingLeadId, setWorkingLeadId] = useState<string | null>(null);
  const [leadFilter, setLeadFilter] = useState("all");

  const loadLeads = useCallback(async () => {
    setLeadsLoading(true);
    setLeadsError(null);
    const { data, error } = await supabase
      .from("leads")
      .select("id,created_at,full_name,email,phone,legal_issue,practice_area,firm_name,firm_id,status,source_url,landing_page,referrer,source,medium,campaign,matter_location,matter_timing")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      setLeadsError(error.message || "Unable to load consumer leads.");
    } else {
      setLeads((data ?? []) as ConsumerLead[]);
    }
    setLeadsLoading(false);
  }, []);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const updateLeadStatus = async (lead: ConsumerLead, status: string) => {
    if (workingLeadId || status === lead.status) return;
    setWorkingLeadId(lead.id);
    setLeadActionError(null);
    const { data, error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", lead.id)
      .select("id,status")
      .maybeSingle();

    if (error || !data) {
      setLeadActionError(error?.message || "Status update was not confirmed. Check administrator permissions.");
    } else {
      setLeads((current) => current.map((item) =>
        item.id === lead.id ? { ...item, status: data.status } : item,
      ));
    }
    setWorkingLeadId(null);
  };

  const filteredLeads = useMemo(() =>
    leadFilter === "all" ? leads : leads.filter((lead) => (lead.status || "new") === leadFilter),
  [leads, leadFilter]);

  const [reviews, setReviews] = useState<ModerationReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [workingReviewId, setWorkingReviewId] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    if (!supabase) {
      setLoadError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError(null);

    const { data, error } = await supabase.rpc("get_review_moderation_queue");

    if (error) {
      console.error("Unable to load review moderation queue:", error);
      setLoadError(error.message || "Unable to load review moderation queue.");
      setLoading(false);
      return;
    }

    setReviews((data ?? []) as ModerationReview[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const counts = useMemo(
    () => ({
      pending: reviews.filter((review) => review.moderation_status === "pending").length,
      published: reviews.filter((review) => review.moderation_status === "published").length,
      disputed: reviews.filter((review) =>
        ["submitted", "reviewing"].includes(review.dispute_status ?? ""),
      ).length,
      total: reviews.length,
    }),
    [reviews],
  );

  const moderateReview = async (
    review: ModerationReview,
    moderationStatus: ModerationAction,
    disputeStatus: DisputeAction | null = null,
  ) => {
    if (!supabase || workingReviewId) return;

    const labels: Record<ModerationAction, string> = {
      published: "publish",
      rejected: "reject",
      removed: "remove",
    };

    const confirmed = window.confirm(
      `Are you sure you want to ${labels[moderationStatus]} this review for ${
        review.firm_name || review.firm_id
      }?`,
    );

    if (!confirmed) return;

    setWorkingReviewId(review.id);
    setActionError(null);

    const { error } = await supabase.rpc("moderate_review", {
      p_review_id: review.id,
      p_moderation_status: moderationStatus,
      p_dispute_status: disputeStatus,
    });

    if (error) {
      console.error("Unable to moderate review:", error);
      setActionError(error.message || "Unable to update review.");
      setWorkingReviewId(null);
      return;
    }

    await loadReviews();
    setWorkingReviewId(null);
  };

  const resolveDispute = async (
    review: ModerationReview,
    disputeStatus: DisputeAction,
  ) => {
    const moderationStatus: ModerationAction =
      disputeStatus === "resolved" ? (review.moderation_status === "published" ? "removed" : "rejected") : (review.moderation_status === "published" ? "published" : "rejected");

    await moderateReview(review, moderationStatus, disputeStatus);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section aria-labelledby="consumer-leads-title" className="mb-12">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 id="consumer-leads-title" className="text-2xl font-bold">Consumer Leads</h2>
              <p className="mt-2 text-sm text-slate-300">
                Latest 100 inquiries. Email delivery is not tracked here; verify follow-up separately.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="lead-filter" className="text-sm text-slate-300">Status</label>
              <select id="lead-filter" value={leadFilter} onChange={(event) => setLeadFilter(event.target.value)}
                className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white">
                <option value="all">All</option>
                {LEAD_STATUSES.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
              </select>
              <button type="button" onClick={() => void loadLeads()}
                className="rounded-lg border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-300">
                Refresh
              </button>
            </div>
          </div>
          {leadActionError && <p role="alert" className="mb-4 rounded-lg border border-red-700 p-4 text-red-200">{leadActionError}</p>}
          {leadsLoading ? <p className="text-slate-300">Loading consumer leads…</p>
          : leadsError ? <div role="alert" className="rounded-xl border border-red-700 p-5 text-red-200">
              Unable to load consumer leads: {leadsError}
              <button type="button" onClick={() => void loadLeads()} className="ml-4 underline">Retry</button>
            </div>
          : filteredLeads.length === 0 ? <p className="rounded-xl border border-slate-800 p-6 text-slate-300">No matching consumer leads among the latest 100 inquiries.</p>
          : <div className="space-y-4">
              {filteredLeads.map((lead) => <article key={lead.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{lead.full_name || "Name not provided"}</h3>
                    <p className="mt-1 text-xs text-slate-400">Submitted {formatDate(lead.created_at)} · {lead.practice_area || "General inquiry"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`lead-status-${lead.id}`} className="text-sm text-slate-300">Status</label>
                    <select id={`lead-status-${lead.id}`} value={lead.status || "new"}
                      disabled={workingLeadId !== null}
                      onChange={(event) => void updateLeadStatus(lead, event.target.value)}
                      className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white disabled:opacity-50">
                      {!LEAD_STATUSES.includes((lead.status || "new") as typeof LEAD_STATUSES[number]) &&
                        <option value={lead.status || "new"}>{formatLabel(lead.status)}</option>}
                      {LEAD_STATUSES.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                  <div className="space-y-2">
                    <p><span className="text-slate-400">Email:</span> {lead.email || "Not provided"}</p>
                    <p><span className="text-slate-400">Phone:</span> {lead.phone || "Not provided"}</p>
                    <p><span className="text-slate-400">Firm:</span> {lead.firm_name || lead.firm_id || "General inquiry / not assigned"}</p>
                    <p><span className="text-slate-400">Location:</span> {lead.matter_location || "Not provided"}</p>
                    <p><span className="text-slate-400">Timing:</span> {lead.matter_timing || "Not provided"}</p>
                  </div>
                  <div className="space-y-2 break-words">
                    <p><span className="text-slate-400">Source / medium:</span> {lead.source || "Unknown"} / {lead.medium || "Unknown"}</p>
                    <p><span className="text-slate-400">Campaign:</span> {lead.campaign || "None"}</p>
                    <p><span className="text-slate-400">Landing page:</span> {lead.landing_page || "Unknown"}</p>
                    <p><span className="text-slate-400">Source URL:</span> {lead.source_url || "Unknown"}</p>
                    <p><span className="text-slate-400">Referrer:</span> {lead.referrer || "Unknown"}</p>
                  </div>
                </div>
                <div className="mt-4 border-t border-slate-700 pt-4">
                  <h4 className="text-sm font-semibold text-amber-300">Legal issue</h4>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-200">{lead.legal_issue || "Not provided"}</p>
                </div>
              </article>)}
            </div>}
        </section>

        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            El Paso&apos;s Best Lawyers
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Review Moderation
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Reviews are moderated independently by El Paso&apos;s Best Lawyers.
            Firms cannot approve or delete consumer reviews. Reports and disputes
            should be evaluated on review integrity, not listing plan.
          </p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Pending Review", counts.pending],
            ["Open Disputes", counts.disputed],
            ["Published", counts.published],
            ["Total Reviews", counts.total],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="text-sm font-medium text-slate-400">{label}</div>
              <div className="mt-2 text-3xl font-bold text-amber-400">{value}</div>
            </div>
          ))}
        </div>

        {actionError && (
          <div className="mb-6 rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-200">
            {actionError}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-amber-400" />
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-800 bg-red-950/40 p-6">
            <h2 className="text-lg font-semibold text-red-200">
              Unable to load reviews
            </h2>
            <p className="mt-2 text-sm text-red-300">{loadError}</p>
            <button
              type="button"
              onClick={() => void loadReviews()}
              className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950"
            >
              Try Again
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-300">
            No reviews are currently in the moderation system.
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => {
              const isWorking = workingReviewId === review.id;
              const hasOpenDispute = ["submitted", "reviewing"].includes(
                review.dispute_status ?? "",
              );

              return (
                <article
                  key={review.id}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                >
                  <div className="border-b border-slate-800 p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                            {formatLabel(review.moderation_status)}
                          </span>
                          {review.dispute_status && (
                            <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
                              Dispute: {formatLabel(review.dispute_status)}
                            </span>
                          )}
                        </div>

                        <h2 className="mt-4 text-2xl font-bold">
                          {review.firm_name || "Unknown Firm"}
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                          Firm ID: {review.firm_id}
                        </p>
                      </div>

                      <div className="text-left lg:text-right">
                        <div className="text-xl font-bold text-amber-400">
                          {"★".repeat(Math.max(0, Math.min(5, review.rating)))}
                          <span className="ml-2 text-sm font-medium text-slate-300">
                            {review.rating}/5
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Submitted {formatDate(review.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {review.title || "Untitled Review"}
                      </h3>
                      <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-200">
                        {review.comment || "No written comment provided."}
                      </p>

                      {review.firm_response && (
                        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                          <div className="text-sm font-semibold text-amber-300">
                            Response from the firm
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                            {review.firm_response}
                          </p>
                          <div className="mt-2 text-xs text-slate-500">
                            {formatDate(review.firm_response_at)}
                          </div>
                        </div>
                      )}

                      {review.dispute_status && (
                        <div className="mt-6 rounded-xl border border-amber-700/60 bg-amber-950/20 p-4">
                          <div className="font-semibold text-amber-300">
                            Firm Report / Dispute
                          </div>
                          <div className="mt-3 text-sm text-slate-300">
                            <span className="font-semibold text-slate-200">
                              Reason:
                            </span>{" "}
                            {formatLabel(review.dispute_reason)}
                          </div>
                          {review.dispute_details && (
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                              {review.dispute_details}
                            </p>
                          )}
                          <div className="mt-2 text-xs text-slate-500">
                            Submitted {formatDate(review.disputed_at)}
                          </div>
                        </div>
                      )}
                    </div>

                    <aside className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
                      <h3 className="font-semibold text-slate-100">
                        Reviewer Information
                      </h3>
                      <dl className="mt-4 space-y-4 text-sm">
                        <div>
                          <dt className="text-slate-500">Name</dt>
                          <dd className="mt-1 break-words text-slate-200">
                            {review.reviewer_name || "Not provided"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Email — admin only</dt>
                          <dd className="mt-1 break-all text-slate-200">
                            {review.reviewer_email || "Not provided"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Last moderated</dt>
                          <dd className="mt-1 text-slate-200">
                            {formatDate(review.moderated_at)}
                          </dd>
                        </div>
                      </dl>
                    </aside>
                  </div>

                  <div className="flex flex-wrap gap-3 border-t border-slate-800 bg-slate-950/50 p-6">
                    {review.moderation_status !== "published" && (
                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() => void moderateReview(review, "published")}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Publish
                      </button>
                    )}

                    {review.moderation_status !== "rejected" && (
                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() => void moderateReview(review, "rejected")}
                        className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reject
                      </button>
                    )}

                    {review.moderation_status !== "removed" && (
                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() => void moderateReview(review, "removed")}
                        className="rounded-lg border border-red-700 px-4 py-2 text-sm font-semibold text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}

                    {hasOpenDispute && (
                      <>
                        <button
                          type="button"
                          disabled={isWorking}
                          onClick={() => void resolveDispute(review, "resolved")}
                          className="rounded-lg border border-amber-600 px-4 py-2 text-sm font-semibold text-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Resolve Dispute
                        </button>
                        <button
                          type="button"
                          disabled={isWorking}
                          onClick={() => void resolveDispute(review, "dismissed")}
                          className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Dismiss Dispute
                        </button>
                      </>
                    )}

                    {isWorking && (
                      <span className="self-center text-sm text-slate-400">
                        Updating…
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
