import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Status = "pending" | "published" | "rejected" | "removed";
type Kind = "Event" | "Resource" | "Program";
type Submission = {
  id: string; submission_type: Kind; contributor_name: string; contributor_email: string;
  organization: string; title: string; details: string; event_date: string | null;
  location: string | null; source_url: string | null; status: Status;
  moderation_notes: string | null; created_at: string; moderated_at: string | null; updated_at: string;
};
type Draft = Pick<Submission, "submission_type" | "organization" | "title" | "details" | "event_date" | "location" | "source_url" | "moderation_notes">;
const selectFields = "id,submission_type,contributor_name,contributor_email,organization,title,details,event_date,location,source_url,status,moderation_notes,created_at,moderated_at,updated_at";
const makeDraft = (s: Submission): Draft => ({
  submission_type: s.submission_type, organization: s.organization, title: s.title,
  details: s.details, event_date: s.event_date, location: s.location,
  source_url: s.source_url, moderation_notes: s.moderation_notes,
});
const inputStyle = "mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 p-2 text-white";

export default function CommunitySubmissionsAdmin() {
  const [items, setItems] = useState<Submission[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [filter, setFilter] = useState<"all" | Status>("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const { data, error: loadError } = await supabase.from("community_submissions")
      .select(selectFields).order("created_at", { ascending: false }).limit(200);
    if (loadError) setError(loadError.message);
    else {
      const submissions = (data ?? []) as Submission[];
      setItems(submissions);
      setDrafts(Object.fromEntries(submissions.map((s) => [s.id, makeDraft(s)])));
    }
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const setField = <K extends keyof Draft>(id: string, key: K, value: Draft[K]) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  };
  const save = async (item: Submission, status: Status) => {
    if (working) return;
    const draft = drafts[item.id];
    if (!draft) return;
    const organization = draft.organization.trim();
    const title = draft.title.trim();
    const details = draft.details.trim();
    const location = draft.location?.trim() || null;
    const source_url = draft.source_url?.trim() || null;
    const moderation_notes = draft.moderation_notes?.trim() || null;
    if (!organization || organization.length > 150 || !title || title.length > 180 || details.length < 10 || details.length > 1800 ||
      (location && location.length > 180) || (source_url && source_url.length > 500) || (moderation_notes && moderation_notes.length > 2000) ||
      (draft.submission_type === "Event" && (!draft.event_date || !location))) {
      setError("Check required fields and their length. Events require a date and location."); return;
    }
    if (source_url) {
      try { if (!["http:", "https:"].includes(new URL(source_url).protocol)) throw new Error(); }
      catch { setError("Source URL must begin with http:// or https://."); return; }
    }
    if (!window.confirm(`${status === "published" ? "Publish" : status === "rejected" ? "Reject" : status === "removed" ? "Remove" : "Save changes to"} “${title}”?`)) return;
    setWorking(item.id); setError(""); setMessage("");
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) throw new Error("Administrator session expired. Sign in again.");
      const { data, error: updateError } = await supabase.from("community_submissions")
        .update({ submission_type: draft.submission_type, organization, title, details,
          event_date: draft.submission_type === "Event" ? draft.event_date : null,
          location, source_url, moderation_notes, status,
          moderated_at: new Date().toISOString(), moderated_by: auth.user.id })
        .eq("id", item.id).eq("updated_at", item.updated_at)
        .select(selectFields).maybeSingle();
      if (updateError) throw updateError;
      if (!data) throw new Error("Update not confirmed. Refresh the queue and try again.");
      setItems((prev) => prev.map((s) => s.id === item.id ? data as Submission : s));
      setDrafts((prev) => ({ ...prev, [item.id]: makeDraft(data as Submission) }));
      setMessage(`Saved “${title}” as ${status}.`);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save submission."); }
    finally { setWorking(null); }
  };
  const visible = items.filter((item) => filter === "all" || item.status === filter);
  return <section aria-labelledby="community-submissions-title" className="mb-12 border-b border-slate-800 pb-12">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div><h2 id="community-submissions-title" className="text-2xl font-bold">Community Submissions</h2>
        <p className="mt-2 text-sm text-slate-300">Review and edit contributions before publishing. Contributor contact details and moderation notes remain private.</p></div>
      <div className="flex items-center gap-3"><label htmlFor="community-filter" className="text-sm">Status</label>
        <select id="community-filter" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className={inputStyle}>
          {(["pending", "published", "rejected", "removed", "all"] as const).map((s) => <option key={s} value={s}>{s}</option>)}
        </select><button type="button" onClick={() => void load()} className="rounded-lg border border-amber-400 px-4 py-2 text-amber-300">Refresh</button></div>
    </div>
    {error && <p role="alert" className="mb-4 rounded-lg border border-red-700 p-4 text-red-200">{error}</p>}
    {message && <p role="status" className="mb-4 rounded-lg border border-emerald-700 p-4 text-emerald-200">{message}</p>}
    {loading ? <p>Loading submissions…</p> : visible.length === 0 ? <p className="rounded-xl border border-slate-800 p-5 text-slate-300">No matching submissions among the latest 200.</p> :
      <div className="space-y-5">{visible.map((item) => {
        const draft = drafts[item.id]; if (!draft) return null;
        return <article key={item.id} className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-semibold text-amber-300">{item.title}</h3>
            <p className="text-xs text-slate-400">{item.status} · Submitted {new Date(item.created_at).toLocaleString()}</p></div>
            <div className="text-sm"><p>Contributor: {item.contributor_name}</p><p className="break-all">Email: {item.contributor_email}</p></div></div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">Type<select className={inputStyle} value={draft.submission_type} onChange={(e) => setField(item.id, "submission_type", e.target.value as Kind)}>
              {(["Event", "Resource", "Program"] as const).map((v) => <option key={v}>{v}</option>)}</select></label>
            <label className="text-sm">Organization<input className={inputStyle} maxLength={150} value={draft.organization} onChange={(e) => setField(item.id, "organization", e.target.value)} /></label>
            <label className="text-sm md:col-span-2">Title<input className={inputStyle} maxLength={180} value={draft.title} onChange={(e) => setField(item.id, "title", e.target.value)} /></label>
            {draft.submission_type === "Event" && <label className="text-sm">Event date<input type="date" className={inputStyle} value={draft.event_date || ""} onChange={(e) => setField(item.id, "event_date", e.target.value || null)} /></label>}
            <label className="text-sm">Location<input className={inputStyle} maxLength={180} value={draft.location || ""} onChange={(e) => setField(item.id, "location", e.target.value || null)} /></label>
            <label className="text-sm md:col-span-2">Source URL<input type="url" className={inputStyle} maxLength={500} value={draft.source_url || ""} onChange={(e) => setField(item.id, "source_url", e.target.value || null)} /></label>
            <label className="text-sm md:col-span-2">Details<textarea className={inputStyle} rows={4} maxLength={1800} value={draft.details} onChange={(e) => setField(item.id, "details", e.target.value)} /></label>
            <label className="text-sm md:col-span-2">Private moderation notes<textarea className={inputStyle} rows={2} maxLength={2000} value={draft.moderation_notes || ""} onChange={(e) => setField(item.id, "moderation_notes", e.target.value || null)} /></label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" disabled={!!working} onClick={() => void save(item, item.status)} className="rounded-lg border border-amber-400 px-4 py-2 font-semibold text-amber-300 disabled:opacity-50">Save edits</button>
            {item.status !== "published" && <button type="button" disabled={!!working} onClick={() => void save(item, "published")} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold disabled:opacity-50">Publish</button>}
            {item.status !== "rejected" && <button type="button" disabled={!!working} onClick={() => void save(item, "rejected")} className="rounded-lg bg-slate-700 px-4 py-2 font-semibold disabled:opacity-50">Reject</button>}
            {item.status !== "removed" && <button type="button" disabled={!!working} onClick={() => void save(item, "removed")} className="rounded-lg border border-red-600 px-4 py-2 font-semibold text-red-300 disabled:opacity-50">Remove</button>}
          </div>
        </article>;
      })}</div>}
  </section>;
}
