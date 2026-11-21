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

export function FirmInquiries({ firmId }: { firmId: string }) {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    setRows([]);
    setLoading(true);
    setError("");
    setHasNext(false);
    async function load() {
      try {
        if (!supabase) throw new Error("Unavailable");
        const { data, error: rpcError } = await supabase.rpc("get_owned_firm_inquiries", {
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
            onClick={() => setRefresh(value => value + 1)}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>
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
