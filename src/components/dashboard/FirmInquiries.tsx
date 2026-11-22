import { useEffect, useState } from "react";
import { Inbox, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

type Inquiry = {
  assignment_id: string;
  assigned_at: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  practice_area: string | null;
  legal_issue: string | null;
  matter_location: string | null;
  matter_timing: string | null;
  notification_status: string;
  workflow_status: string;
  workflow_updated_at: string | null;
  retained_at: string | null;
};

const PAGE_SIZE = 25;
const statusLabels: Record<string, string> = {
  pending: "Notification pending",
  sending: "Notification in progress",
  accepted: "Email accepted by provider",
  delivered: "Email delivery reported",
  failed: "Email notification failed",
  bounced: "Email bounced",
  not_confirmed: "Email acceptance not confirmed",
};

const workflowOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "consultation_scheduled", label: "Consultation scheduled" },
  { value: "retained", label: "Retained" },
  { value: "closed", label: "Closed" },
] as const;

type InquirySummary = {
  total: number;
  new_count: number;
  contacted_count: number;
  scheduled_count: number;
  retained_count: number;
  closed_count: number;
  recorded_retained_count: number;
};

export function InquiryPerformance({ firmId, revision }: { firmId: string; revision: number }) {
  const [summary, setSummary] = useState<InquirySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    setSummary(null);
    setLoading(true);
    setError(false);
    async function load() {
      try {
        if (!supabase) throw new Error("Unavailable");
        const { data, error: rpcError } = await supabase.rpc("get_owned_firm_inquiry_summary_v2", {
          p_firm_id: firmId,
        });
        if (rpcError || !Array.isArray(data) || data.length !== 1) throw new Error("Unavailable");
        const row = data[0] as InquirySummary;
        const values = [row.total, row.new_count, row.contacted_count, row.scheduled_count, row.retained_count, row.closed_count];
        if (values.some(value => !Number.isSafeInteger(value) || value < 0)
          || values.slice(1).reduce((sum, value) => sum + value, 0) !== row.total
          || !Number.isSafeInteger(row.recorded_retained_count)
          || row.recorded_retained_count < row.retained_count
          || row.recorded_retained_count > row.total) throw new Error("Invalid summary");
        if (active) setSummary(row);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [firmId, revision]);

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-bold text-[#0F2A43]">Inquiry performance</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">All time · Firm-reported</span>
      </div>
      <p className="mt-2 text-sm text-slate-600">Your firm's authorized inquiries across all pages, based on the statuses you record.</p>
      {loading ? <p className="mt-4 text-sm text-slate-600" role="status">Loading inquiry performance...</p>
        : error || !summary ? <p className="mt-4 text-sm text-red-700" role="alert">Performance unavailable. Use Refresh to try again.</p>
        : <>
          <div className="mt-4 grid gap-3 grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total inquiries", value: summary.total },
              { label: "Currently contacted", value: summary.contacted_count },
              { label: "Consultations scheduled", value: summary.scheduled_count },
              { label: "Currently retained", value: summary.retained_count },
              { label: "New", value: summary.new_count },
              { label: "Closed", value: summary.closed_count },
              { label: "Recorded retained inquiries", value: summary.recorded_retained_count },
              { label: "Recorded conversion rate", value: summary.total ? `${(100 * summary.recorded_retained_count / summary.total).toFixed(1)}%` : "—" },
            ].map(metric => (
              <div key={metric.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-600">{metric.label}</p>
                <p className="mt-1 text-2xl font-bold text-[#0F2A43] tabular-nums">{metric.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-600">Current statuses are mutually exclusive. Recorded conversion rate is inquiries recorded as retained divided by total inquiries, including retained matters later closed. Older closed matters without a recorded retention outcome are not inferred. Outcomes are firm-reported, not independently verified; repeated inquiries are not necessarily unique clients.</p>
        </>}
    </section>
  );
}

function InquiryWorkflow({ inquiry, onSaved }: { inquiry: Inquiry; onSaved: () => void }) {
  const [saved, setSaved] = useState(inquiry.workflow_status);
  const [selected, setSelected] = useState(inquiry.workflow_status);
  const [updatedAt, setUpdatedAt] = useState(inquiry.workflow_updated_at);
  const [retainedAt, setRetainedAt] = useState(inquiry.retained_at);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  async function save(clearRetention = false) {
    if (saving || (!clearRetention && selected === saved)) return;
    if (clearRetention && (saved === "retained" || selected !== saved || !retainedAt)) return;
    if (clearRetention && !window.confirm("Remove the recorded retention outcome? Only use this to correct an incorrect entry, not to close a retained matter.")) return;
    setSaving(true);
    setMessage("");
    setFailed(false);
    try {
      if (!supabase) throw new Error("Unavailable");
      const { data, error } = await supabase.rpc("update_owned_firm_inquiry_outcome", {
        p_assignment_id: inquiry.assignment_id,
        p_status: selected,
        p_clear_retention: clearRetention,
      });
      if (error || !Array.isArray(data) || data.length !== 1 || typeof data[0].workflow_updated_at !== "string") throw new Error("Save failed");
      setSaved(selected);
      setUpdatedAt(data[0].workflow_updated_at);
      setRetainedAt(data[0].retained_at ?? null);
      setMessage(clearRetention ? "Retention outcome corrected." : "Status saved.");
      onSaved();
    } catch {
      setFailed(true);
      setMessage("Could not save the status. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-teal-100 bg-teal-50/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-[#0F2A43]">Inquiry progress</h4>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0F2A43]">
          {workflowOptions.find(option => option.value === saved)?.label || "Unknown"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="min-w-0 flex-1 text-sm font-medium text-slate-700">
          Update status
          <select className="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 text-sm"
            value={selected} disabled={saving}
            onChange={event => { setSelected(event.target.value); setMessage(""); }}>
            {workflowOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <Button disabled={saving || selected === saved} onClick={() => void save()}>
          {saving ? "Saving..." : "Save status"}
        </Button>
      </div>
      {updatedAt && <p className="mt-2 text-xs text-slate-600">Last updated: {new Date(updatedAt).toLocaleString()}</p>}
      {retainedAt && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-teal-100 pt-3">
          <p className="text-sm text-teal-900">Retention recorded: {new Date(retainedAt).toLocaleDateString()} · Counts even after closure.</p>
          {saved !== "retained" && (
            <Button variant="outline" size="sm" disabled={saving || selected !== saved}
              onClick={() => void save(true)}>Correct retention record</Button>
          )}
        </div>
      )}
      {message && <p role={failed ? "alert" : "status"} className={`mt-2 text-sm ${failed ? "text-red-700" : "text-teal-800"}`}>{message}</p>}
    </div>
  );
}

export function FirmInquiries({ firmId }: { firmId: string }) {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [summaryRevision, setSummaryRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setRows([]);
    setLoading(true);
    setError("");
    setHasNext(false);
    async function load() {
      try {
        if (!supabase) throw new Error("Unavailable");
        const { data, error: rpcError } = await supabase.rpc("get_owned_firm_inquiries_v3", {
          p_firm_id: firmId,
          p_offset: page * PAGE_SIZE,
        });
        if (rpcError) throw rpcError;
        if (!active) return;
        const result = (data ?? []) as Inquiry[];
        setRows(result.slice(0, PAGE_SIZE));
        setHasNext(result.length > PAGE_SIZE);
      } catch {
        if (active) setError("We could not load your inquiries. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [firmId, page, refresh]);

  return (
    <section className="space-y-6">
      <div className="rounded-xl bg-[#0F2A43] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Consultation Inquiries</h2>
            <p className="mt-2 text-sm text-white/80">Review requests from consumers who authorized sharing their information with your firm.</p>
          </div>
          <Button variant="outline" className="bg-white text-[#0F2A43]" disabled={loading}
            onClick={() => { setRefresh(value => value + 1); setSummaryRevision(value => value + 1); }}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>
      <InquiryPerformance firmId={firmId} revision={summaryRevision} />
      <p className="text-sm text-slate-600">Treat all inquiry details as confidential. An inquiry is not a retained client or a guarantee of representation. Email delivery status is separate from whether you have responded.</p>
      {loading ? (
        <div className="rounded-xl border bg-white p-6" role="status">Loading inquiries...</div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800" role="alert">{error}</div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <Inbox className="mx-auto mb-3 h-10 w-10 text-slate-400" />
          <h3 className="font-semibold">No inquiries on this page</h3>
          <p className="mt-2 text-sm text-slate-600">Authorized consultation requests assigned to your account will appear here.</p>
        </div>
      ) : rows.map(inquiry => (
        <article key={inquiry.assignment_id} className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#0F2A43]">{inquiry.practice_area || "Legal inquiry"}</h3>
              <p className="mt-1 text-sm text-slate-500">{new Date(inquiry.assigned_at).toLocaleString()}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {statusLabels[inquiry.notification_status] || "Email status unavailable"}
            </span>
          </div>
          <dl className="mt-4 grid gap-4 border-t pt-4 text-sm sm:grid-cols-2">
            <div><dt className="font-semibold text-slate-500">Consumer</dt><dd className="break-words">{inquiry.full_name || "Not provided"}</dd></div>
            <div><dt className="font-semibold text-slate-500">Email</dt><dd className="break-words">{inquiry.email || "Not provided"}</dd></div>
            <div><dt className="font-semibold text-slate-500">Phone</dt><dd className="break-words">{inquiry.phone || "Not provided"}</dd></div>
            <div><dt className="font-semibold text-slate-500">Location / timing</dt><dd className="break-words">{[inquiry.matter_location, inquiry.matter_timing].filter(Boolean).join(" · ") || "Not provided"}</dd></div>
          </dl>
          <details className="mt-4 rounded-lg bg-slate-50 p-4">
            <summary className="cursor-pointer font-semibold text-[#0F2A43]">Read inquiry details</summary>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm text-slate-700">{inquiry.legal_issue || "No additional details provided."}</p>
          </details>
          <InquiryWorkflow inquiry={inquiry} onSaved={() => setSummaryRevision(value => value + 1)} />
        </article>
      ))}
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" disabled={loading || page === 0} onClick={() => setPage(value => Math.max(0, value - 1))}>Previous</Button>
        <span className="text-sm text-slate-500">Page {page + 1}</span>
        <Button variant="outline" disabled={loading || !hasNext} onClick={() => setPage(value => value + 1)}>Next</Button>
      </div>
    </section>
  );
}
