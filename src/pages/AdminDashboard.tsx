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

interface LeadNotification {
  lead_id: string;
  recipient_type: string;
  recipient_email: string;
  status: string;
  attempt_count: number;
  last_error: string | null;
  updated_at: string;
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

const ACTIVITY_TYPES = [
  "consumer_contact",
  "firm_outreach",
  "firm_response",
  "follow_up",
  "referral_outcome",
  "internal_note",
] as const;

type LeadActivityType = typeof ACTIVITY_TYPES[number];

interface LeadActivity {
  id: string;
  lead_id: string;
  created_by: string;
  activity_type: LeadActivityType;
  firm_name: string | null;
  outcome: string | null;
  notes: string;
  follow_up_at: string | null;
  created_at: string;
}

const ACTIVITY_OUTCOMES: Record<LeadActivityType, string[]> = {
  consumer_contact: ["contacted", "no_answer", "message_left", "awaiting_reply"],
  firm_outreach: ["contacted", "awaiting_reply", "declined", "accepted"],
  firm_response: ["accepted", "declined", "needs_information", "no_response"],
  follow_up: ["scheduled", "completed", "no_answer", "awaiting_reply"],
  referral_outcome: ["accepted", "not_placed", "consumer_declined", "pending"],
  internal_note: [],
};

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
  const [leadNotifications, setLeadNotifications] = useState<LeadNotification[]>([]);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [leadActionError, setLeadActionError] = useState<string | null>(null);
  const [workingLeadId, setWorkingLeadId] = useState<string | null>(null);
  const [leadFilter, setLeadFilter] = useState("all");
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [activityType, setActivityType] = useState<LeadActivityType>("consumer_contact");
  const [activityFirm, setActivityFirm] = useState("");
  const [activityOutcome, setActivityOutcome] = useState("");
  const [activityNotes, setActivityNotes] = useState("");
  const [activityFollowUp, setActivityFollowUp] = useState("");
  const [savingActivity, setSavingActivity] = useState(false);

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
    const notificationsResult = await supabase.from("lead_notifications")
      .select("lead_id,recipient_type,recipient_email,status,attempt_count,last_error,updated_at")
      .order("updated_at", { ascending: false }).limit(300);
    if (notificationsResult.error) {
      setNotificationsError(notificationsResult.error.message);
    } else {
      setNotificationsError(null);
      setLeadNotifications((notificationsResult.data ?? []) as LeadNotification[]);
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

  const loadActivities = useCallback(async (leadId: string) => {
    setActivitiesLoading(true);
    setActivitiesError(null);
    const { data, error } = await supabase
      .from("lead_activities")
      .select("id,lead_id,created_by,activity_type,firm_name,outcome,notes,follow_up_at,created_at")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      setActivitiesError(error.message || "Unable to load activity history.");
      setActivities([]);
    } else {
      setActivities((data ?? []) as LeadActivity[]);
    }
    setActivitiesLoading(false);
  }, []);

  const toggleLeadActivities = (leadId: string) => {
    if (expandedLeadId === leadId) {
      setExpandedLeadId(null);
      return;
    }
    setExpandedLeadId(leadId);
    setActivities([]);
    setActivitiesError(null);
    setActivityType("consumer_contact");
    setActivityFirm("");
    setActivityOutcome("");
    setActivityNotes("");
    setActivityFollowUp("");
    void loadActivities(leadId);
  };

  const saveLeadActivity = async (leadId: string) => {
    if (savingActivity || !activityNotes.trim()) return;
    if ((activityType === "firm_outreach" || activityType === "firm_response") && !activityFirm.trim()) {
      setActivitiesError("Enter the law firm contacted.");
      return;
    }
    if (activityNotes.trim().length > 5000) {
      setActivitiesError("Notes must not exceed 5,000 characters.");
      return;
    }
    let followUpAt: string | null = null;
    if (activityFollowUp) {
      const parsed = new Date(activityFollowUp);
      if (Number.isNaN(parsed.getTime())) {
        setActivitiesError("Enter a valid follow-up date.");
        return;
      }
      followUpAt = parsed.toISOString();
    }

    setSavingActivity(true);
    setActivitiesError(null);
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      setActivitiesError("Your administrator session could not be verified. Sign in again.");
      setSavingActivity(false);
      return;
    }

    const { data, error } = await supabase.from("lead_activities")
      .insert({
        lead_id: leadId,
        created_by: authData.user.id,
        activity_type: activityType,
        firm_name: activityFirm.trim() || null,
        outcome: activityOutcome || null,
        notes: activityNotes.trim(),
        follow_up_at: followUpAt,
      })
      .select("id,lead_id,created_by,activity_type,firm_name,outcome,notes,follow_up_at,created_at")
      .single();

    if (error || !data) {
      setActivitiesError(error?.message || "Activity was not saved. Check super-admin permissions.");
    } else {
      setActivities((current) => [data as LeadActivity, ...current]);
      setActivityFirm("");
      setActivityOutcome("");
      setActivityNotes("");
      setActivityFollowUp("");
    }
    setSavingActivity(false);
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
                Latest 100 inquiries. Notification status reflects provider acceptance, not confirmed inbox delivery.
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
                <div className="mt-3 space-y-1 text-xs text-slate-300">
                  {leadNotifications.filter((notification) => notification.lead_id === lead.id).map((notification) => (
                    <p key={`${notification.recipient_type}:${notification.recipient_email}`}>
                      <span className="font-semibold">{formatLabel(notification.recipient_type)}:</span> {formatLabel(notification.status)}
                      {` · attempts ${notification.attempt_count}`}
                      {notification.last_error ? <span className="text-red-300"> · {notification.last_error}</span> : null}
                    </p>
                  ))}
                  {!leadNotifications.some((notification) => notification.lead_id === lead.id) &&
                    <p>Notifications not recorded for this lead.</p>}
                  {notificationsError && <p className="text-red-300">Notification audit unavailable: {notificationsError}</p>}
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
                <div className="mt-5 border-t border-slate-700 pt-4">
                  <button type="button"
                    aria-expanded={expandedLeadId === lead.id}
                    aria-controls={`lead-activity-${lead.id}`}
                    onClick={() => toggleLeadActivities(lead.id)}
                    className="rounded-lg border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-300 hover:bg-slate-800">
                    {expandedLeadId === lead.id ? "Hide activity history" : "Activity history / Log outreach"}
                  </button>
                  {expandedLeadId === lead.id && (
                    <div id={`lead-activity-${lead.id}`} className="mt-5 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h4 className="font-semibold text-amber-300">Consumer assistance history</h4>
                        <button type="button" onClick={() => void loadActivities(lead.id)}
                          disabled={activitiesLoading || savingActivity}
                          className="text-sm text-slate-300 underline disabled:opacity-50">
                          Refresh history
                        </button>
                      </div>
                      {activitiesError && <p role="alert" className="rounded-lg border border-red-700 p-3 text-sm text-red-200">{activitiesError}</p>}
                      {activitiesLoading ? <p className="text-sm text-slate-400">Loading activity history…</p>
                        : activities.length === 0 ? <p className="text-sm text-slate-400">No activity recorded for this inquiry.</p>
                        : <ol className="space-y-3">
                          {activities.map((activity) => (
                            <li key={activity.id} className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <strong className="text-sm text-amber-300">{formatLabel(activity.activity_type)}</strong>
                                <span className="text-xs text-slate-400">{formatDate(activity.created_at)}</span>
                              </div>
                              {activity.firm_name && <p className="mt-2 text-sm">Firm: {activity.firm_name}</p>}
                              {activity.outcome && <p className="mt-1 text-sm">Outcome: {formatLabel(activity.outcome)}</p>}
                              <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-200">{activity.notes}</p>
                              {activity.follow_up_at && <p className="mt-2 text-xs text-amber-200">Follow-up: {formatDate(activity.follow_up_at)}</p>}
                              <p className="mt-2 text-xs text-slate-500">Recorded by: {activity.created_by}</p>
                            </li>
                          ))}
                        </ol>}
                      <form className="rounded-xl border border-slate-700 bg-slate-950 p-4"
                        onSubmit={(event) => { event.preventDefault(); void saveLeadActivity(lead.id); }}>
                        <h5 className="mb-3 font-semibold">Record a new activity</h5>
                        <div className="grid gap-4 md:grid-cols-2">
                          <label className="text-sm">Activity type
                            <select value={activityType}
                              onChange={(event) => {
                                setActivityType(event.target.value as LeadActivityType);
                                setActivityOutcome("");
                              }}
                              className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900 p-2">
                              {ACTIVITY_TYPES.map((type) => <option key={type} value={type}>{formatLabel(type)}</option>)}
                            </select>
                          </label>
                          <label className="text-sm">Law firm (required for firm outreach/response)
                            <input value={activityFirm} onChange={(event) => setActivityFirm(event.target.value)}
                              maxLength={200}
                              required={activityType === "firm_outreach" || activityType === "firm_response"}
                              className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900 p-2"
                              placeholder="Firm name" />
                          </label>
                          <label className="text-sm">Outcome
                            <select value={activityOutcome} onChange={(event) => setActivityOutcome(event.target.value)}
                              className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900 p-2">
                              <option value="">Not specified</option>
                              {ACTIVITY_OUTCOMES[activityType].map((outcome) =>
                                <option key={outcome} value={outcome}>{formatLabel(outcome)}</option>)}
                            </select>
                          </label>
                          <label className="text-sm">Next follow-up (optional)
                            <input type="datetime-local" value={activityFollowUp}
                              onChange={(event) => setActivityFollowUp(event.target.value)}
                              className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900 p-2" />
                          </label>
                        </div>
                        <label className="mt-4 block text-sm">Notes (required)
                          <textarea value={activityNotes} onChange={(event) => setActivityNotes(event.target.value)}
                            required maxLength={5000} rows={3}
                            placeholder="Record what happened. Avoid unnecessary sensitive details."
                            className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900 p-2" />
                        </label>
                        <p className="mt-2 text-xs text-slate-400">
                          Entries are permanent and timestamped. Saving does not send an email or change the lead status.
                        </p>
                        <button type="submit" disabled={savingActivity || !activityNotes.trim()}
                          className="mt-3 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">
                          {savingActivity ? "Saving…" : "Save activity"}
                        </button>
                      </form>
                    </div>
                  )}
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
