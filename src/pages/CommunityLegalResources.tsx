import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, HandHeart, Landmark, Search, ShieldCheck, Users } from "lucide-react";
import Footer from "@/components/Footer";
import { useSeo } from "../hooks/use-seo";
import { supabase } from "../lib/supabase";

type Category = "Legal Aid" | "Immigration" | "Courts & Research" | "Dispute Resolution" | "Community Support";
type Resource = { name: string; category: Category; summary: string; url: string; note?: string };

// Public resources, not formal partners. Confirm eligibility, hours, contact details and services with each organization.
const resources: Resource[] = [
  { name: "Texas RioGrande Legal Aid", category: "Legal Aid", summary: "Nonprofit civil legal assistance for eligible individuals and families across Southwest Texas.", url: "https://www.trla.org/" },
  { name: "TexasLawHelp.org", category: "Legal Aid", summary: "Texas legal information, forms, and guidance on finding free or low-cost legal help.", url: "https://texaslawhelp.org/" },
  { name: "State Bar of Texas", category: "Legal Aid", summary: "Public information about finding legal assistance and understanding the attorney-client relationship.", url: "https://www.texasbar.com/" },
  { name: "Las Americas Immigrant Advocacy Center", category: "Immigration", summary: "El Paso-based nonprofit providing immigration-related legal assistance and advocacy.", url: "https://las-americas.org/" },
  { name: "Diocesan Migrant & Refugee Services", category: "Immigration", summary: "Nonprofit immigration legal services and support for migrants and refugees.", url: "https://www.dmrs-ep.org/" },
  { name: "El Paso County — I Need a Lawyer", category: "Courts & Research", summary: "County information about legal representation and court-appointed counsel where applicable.", url: "https://www.epcounty.com/", note: "Use the county website to locate its current lawyer-assistance information." },
  { name: "El Paso County Law Library", category: "Courts & Research", summary: "Public legal research resources and information about the county law library.", url: "https://www.epcounty.com/", note: "Find the Law Library section on the county website." },
  { name: "El Paso County Dispute Resolution Center", category: "Dispute Resolution", summary: "Information about mediation and dispute resolution services in El Paso County.", url: "https://www.epcounty.com/", note: "Confirm current programs and eligibility through official county resources." },
  { name: "El Paso Helps", category: "Community Support", summary: "Community assistance resources, including information about available legal and support services.", url: "https://www.elpasohelps.org/" },
];

const categories: Array<"All resources" | Category> = ["All resources", "Legal Aid", "Immigration", "Courts & Research", "Dispute Resolution", "Community Support"];

type PublishedSubmission = {
  id: string;
  submission_type: "Event" | "Resource" | "Program";
  organization: string | null;
  title: string;
  details: string;
  event_date: string | null;
  location: string | null;
  source_url: string | null;
  created_at: string;
};

function safeExternalUrl(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : null;
  } catch { return null; }
}

export default function CommunityLegalResources() {
  const [published, setPublished] = useState<PublishedSubmission[]>([]);
  const [publishedLoading, setPublishedLoading] = useState(true);
  const [publishedError, setPublishedError] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadPublished() {
      try {
        if (!supabase) throw new Error("Supabase is not configured");
        const { data, error } = await supabase
          .from("published_community_submissions")
          .select("id,submission_type,organization,title,details,event_date,location,source_url,created_at")
          .order("created_at", { ascending: false })
          .limit(100);
        if (error) throw error;
        if (active) setPublished((data ?? []) as PublishedSubmission[]);
      } catch (error) {
        console.error("Unable to load published community submissions", error);
        if (active) setPublishedError(true);
      } finally {
        if (active) setPublishedLoading(false);
      }
    }
    void loadPublished();
    return () => { active = false; };
  }, []);
  const [query, setQuery] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", organization: "", submission_type: "Resource" as "Event" | "Resource" | "Program", title: "", details: "", event_date: "", location: "", source_url: "", website: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [contactError, setContactError] = useState("");
  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (contactStatus === "sending") return;
    setContactStatus("sending");
    setContactError("");
    try {
      const response = await fetch("/api/community-resource-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, name: contact.name.trim(), email: contact.email.trim(), organization: contact.organization.trim(), title: contact.title.trim(), details: contact.details.trim(), location: contact.location.trim(), source_url: contact.source_url.trim(), event_date: contact.submission_type === "Event" ? contact.event_date : "" }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) throw new Error(result?.error || "We could not send your inquiry. Please try again.");
      setContactStatus("success");
      setContact({ name: "", email: "", organization: "", submission_type: "Resource", title: "", details: "", event_date: "", location: "", source_url: "", website: "" });
    } catch (error) {
      setContactError(error instanceof Error ? error.message : "We could not send your inquiry. Please try again.");
      setContactStatus("error");
    }
  }
  const [category, setCategory] = useState<(typeof categories)[number]>("All resources");
  useSeo({
    title: "El Paso Community Legal Resources | Legal Aid & Public Help",
    description: "Explore free and low-cost legal aid, immigration assistance, court resources, mediation and community legal services in El Paso, Texas.",
    path: "/community-legal-resources",
  });
  const filtered = useMemo(() => resources.filter((resource) => {
    const matchesCategory = category === "All resources" || resource.category === category;
    const needle = query.trim().toLowerCase();
    return matchesCategory && (!needle || `${resource.name} ${resource.category} ${resource.summary}`.toLowerCase().includes(needle));
  }), [category, query]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <Link to="/" className="font-bold text-[#0F2A43]">El Paso&apos;s Best Lawyers</Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F2A43] hover:text-teal-700"><ArrowLeft size={16} /> Home</Link>
        </div>
      </header>
      <main>
        <section className="bg-[#0F2A43] px-5 py-16 text-white md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-300"><HandHeart size={16} /> Free community resource</div>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">El Paso Community Legal Resources</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">Find organizations and public resources offering legal information, free or low-cost assistance, immigration support, mediation, and court-related guidance in the El Paso area.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#find-resources" className="rounded-lg bg-amber-400 px-6 py-3 font-bold text-slate-950 hover:bg-amber-300">Explore resources</a>
              <Link to="/guides" className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 font-semibold hover:bg-white/10"><BookOpen size={17} /> Read legal guides</Link>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white px-5 py-8">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            <div className="flex items-start gap-3"><HandHeart className="mt-1 shrink-0 text-teal-700" /><div><h2 className="font-bold">Free to explore</h2><p className="mt-1 text-sm leading-6 text-slate-600">No fee to browse resources or visit their official websites.</p></div></div>
            <div className="flex items-start gap-3"><Landmark className="mt-1 shrink-0 text-teal-700" /><div><h2 className="font-bold">Public and nonprofit services</h2><p className="mt-1 text-sm leading-6 text-slate-600">Find different types of assistance in one place.</p></div></div>
            <div className="flex items-start gap-3"><ShieldCheck className="mt-1 shrink-0 text-teal-700" /><div><h2 className="font-bold">Clear independence</h2><p className="mt-1 text-sm leading-6 text-slate-600">Listings do not imply endorsement or formal partnership.</p></div></div>
          </div>
        </section>

        <section className="border-b border-amber-200 bg-amber-50 px-5 py-12"><div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-bold uppercase tracking-widest text-teal-800">New community resource</p><h2 className="mt-2 text-3xl font-bold text-[#0F2A43]">Support &amp; Recovery in El Paso</h2><p className="mt-3 max-w-2xl text-slate-700">Find grief support, trauma recovery, family safety resources, advocacy and other community assistance. No attorney referral required.</p></div><Link to="/support-and-recovery" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0F2A43] px-6 py-3 font-bold text-white hover:bg-[#183b5c]">Explore support resources <ArrowRight size={18}/></Link></div></section>

        <section id="find-resources" className="mx-auto max-w-7xl px-5 py-16">
          <p className="text-sm font-bold uppercase tracking-widest text-teal-700">Resource directory</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0F2A43] md:text-4xl">Find the right starting point</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">Select a category or search by service. Each listing links to an organization's website so you can check current eligibility, availability and contact details.</p>
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
            <Search className="shrink-0 text-slate-500" size={20} />
            <input aria-label="Search community legal resources" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search organizations, legal aid, immigration, mediation..." className="w-full bg-transparent text-base outline-none placeholder:text-slate-500" />
          </div>
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter resource categories">
            {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${category === item ? "border-[#0F2A43] bg-[#0F2A43] text-white" : "border-slate-300 bg-white text-slate-700 hover:border-teal-600"}`}>{item}</button>)}
          </div>
          <p className="mt-7 text-sm text-slate-500" aria-live="polite">Showing {filtered.length} of {resources.length} resources</p>
          {filtered.length ? <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource) => <article key={resource.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">{resource.category}</span>
              <h3 className="mt-3 text-xl font-bold text-[#0F2A43]">{resource.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{resource.summary}</p>
              {resource.note && <p className="mt-3 text-xs leading-5 text-slate-500">{resource.note}</p>}
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-bold text-teal-800 hover:underline">Visit official website <ExternalLink size={16} /></a>
            </article>)}
          </div> : <div className="mt-5 rounded-xl border border-slate-200 bg-white p-8 text-slate-600">No resources match your search. Try another keyword or choose “All resources.”</div>}
          <p className="mt-6 text-sm leading-6 text-slate-500">Independent informational listings. Organizations shown here have not necessarily reviewed or approved their listings and are not represented as partners. Services and eligibility may change; confirm details directly with each provider.</p>
        </section>

        <section aria-labelledby="community-updates-title" className="border-t border-slate-200 bg-slate-100 px-5 py-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-widest text-teal-700">Community announcements</p>
            <h2 id="community-updates-title" className="mt-2 text-3xl font-bold text-[#0F2A43] md:text-4xl">Community events, programs and updates</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">Submissions below have been reviewed for publication. Inclusion is informational, not an endorsement or partnership. Confirm details with the organizer.</p>
            {publishedLoading ? <p role="status" className="mt-8 text-slate-600">Loading community updates…</p> :
              publishedError ? <p role="status" className="mt-8 text-slate-600">Community updates are temporarily unavailable. Please check back later.</p> :
              published.length === 0 ? <p className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">No community announcements have been published yet.</p> :
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {published.map((item) => {
                  const externalUrl = safeExternalUrl(item.source_url);
                  return <article key={item.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700">{item.submission_type}</span>
                    <h3 className="mt-3 text-xl font-bold text-[#0F2A43]">{item.title}</h3>
                    {item.organization && <p className="mt-2 text-sm font-semibold text-slate-700">{item.organization}</p>}
                    <p className="mt-3 flex-1 whitespace-pre-line break-words text-sm leading-7 text-slate-600">{item.details}</p>
                    {item.event_date && <p className="mt-4 text-sm text-slate-700">Date: {new Date(item.event_date + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>}
                    {item.location && <p className="mt-2 break-words text-sm text-slate-700">Location: {item.location}</p>}
                    {externalUrl && <a href={externalUrl} target="_blank" rel="noopener noreferrer nofollow" className="mt-5 inline-flex items-center gap-2 font-bold text-teal-800 hover:underline">More information <ExternalLink size={16} /></a>}
                  </article>;
                })}
              </div>}
          </div>
        </section>

        <section className="bg-white px-5 py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div><p className="text-sm font-bold uppercase tracking-widest text-teal-700">Another path to help</p><h2 className="mt-2 text-3xl font-bold text-[#0F2A43]">Looking for a private attorney?</h2><p className="mt-4 leading-8 text-slate-600">Free legal services may have income, case-type or capacity requirements. If you are seeking private representation, explore our El Paso attorney directories and compare listed firms by practice area.</p><Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0F2A43] px-6 py-3 font-bold text-white hover:bg-[#183b5c]">Find El Paso lawyers <ArrowRight size={17} /></Link></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8"><BookOpen className="text-teal-700" size={30} /><h3 className="mt-4 text-2xl font-bold text-[#0F2A43]">Understand your options</h3><p className="mt-3 leading-7 text-slate-600">Read plain-English Texas legal guides on accidents, family law, criminal defense and other common legal questions.</p><Link to="/guides" className="mt-5 inline-flex items-center gap-2 font-bold text-teal-800 hover:underline">Browse legal guides <ArrowRight size={17} /></Link></div>
          </div>
        </section>

        <section id="community-submission" className="bg-[#0F2A43] px-5 py-16 text-white">
          <div className="mx-auto max-w-5xl"><div className="flex items-center gap-3 text-amber-300"><Users size={28} /><span className="text-sm font-bold uppercase tracking-widest">Community collaboration</span></div><h2 className="mt-4 text-3xl font-bold md:text-4xl">Help keep El Paso connected to legal resources</h2><p className="mt-4 max-w-3xl leading-8 text-slate-200">We welcome corrections, updated program information and opportunities to collaborate on useful public legal education. Resource inclusion is free and does not require endorsements, referrals or reciprocal links.</p><div className="mt-8 max-w-3xl rounded-xl border border-white/20 bg-white/10 p-5 sm:p-7">
              <h3 className="text-xl font-bold">Submit a community resource, program or event</h3>
              <p className="mt-2 text-sm leading-6 text-slate-200">Share a local resource, program or upcoming event for review. Submissions are not published automatically. Do not include confidential legal or case information.</p>
              {contactStatus === "success" ? (
                <div role="status" className="mt-5 rounded-lg border border-emerald-300/50 bg-emerald-950/40 p-4 text-white">
                  Thank you. Your submission has been received and is pending review before publication.
                  <button type="button" onClick={() => setContactStatus("idle")} className="ml-3 font-bold underline">Submit another</button>
                </div>
              ) : (
                <form onSubmit={submitContact} className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold sm:col-span-2">Submission type *
                    <select required value={contact.submission_type} onChange={(event) => setContact({ ...contact, submission_type: event.target.value as "Event" | "Resource" | "Program", event_date: "" })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900">
                      <option value="Resource">Community resource</option><option value="Program">Community program</option><option value="Event">Upcoming event</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold">Your name *<input required maxLength={120} autoComplete="name" value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900" /></label>
                  <label className="text-sm font-semibold">Email address *<input required type="email" maxLength={254} autoComplete="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900" /></label>
                  <label className="text-sm font-semibold sm:col-span-2">Organization *<input required maxLength={150} autoComplete="organization" value={contact.organization} onChange={(event) => setContact({ ...contact, organization: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900" /></label>
                  <label className="text-sm font-semibold sm:col-span-2">{contact.submission_type === "Event" ? "Event title" : contact.submission_type === "Program" ? "Program title" : "Resource title"} *<input required maxLength={180} value={contact.title} onChange={(event) => setContact({ ...contact, title: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900" /></label>
                  <label className="text-sm font-semibold sm:col-span-2">Description *<textarea required minLength={10} maxLength={1800} rows={5} value={contact.details} onChange={(event) => setContact({ ...contact, details: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900" /></label>
                  {contact.submission_type === "Event" && <label className="text-sm font-semibold">Event date *<input required type="date" min={new Date().toLocaleDateString("en-CA", { timeZone: "America/Denver", year: "numeric", month: "2-digit", day: "2-digit" })} value={contact.event_date} onChange={(event) => setContact({ ...contact, event_date: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900" /></label>}
                  <label className={`text-sm font-semibold ${contact.submission_type !== "Event" ? "sm:col-span-2" : ""}`}>Location {contact.submission_type === "Event" ? "*" : "(optional)"}<input required={contact.submission_type === "Event"} maxLength={180} value={contact.location} onChange={(event) => setContact({ ...contact, location: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900" /></label>
                  <label className="text-sm font-semibold sm:col-span-2">Information link (optional)<input type="url" maxLength={500} placeholder="https://example.org" value={contact.source_url} onChange={(event) => setContact({ ...contact, source_url: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900" /></label>
                  <div aria-hidden="true" className="absolute -left-[10000px]" ><label>Leave this field blank<input tabIndex={-1} autoComplete="off" value={contact.website} onChange={(event) => setContact({ ...contact, website: event.target.value })} /></label></div>
                  {contactStatus === "error" && <p role="alert" className="sm:col-span-2 text-sm font-semibold text-amber-200">{contactError}</p>}
                  <div className="sm:col-span-2"><button type="submit" disabled={contactStatus === "sending"} className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-bold text-slate-950 hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60">{contactStatus === "sending" ? "Submitting…" : "Submit for review"} <ArrowRight size={17} /></button></div>
                </form>
              )}
            </div></div>
        </section>
        <section className="mx-auto max-w-6xl px-5 py-10 text-sm leading-7 text-slate-600"><strong>Information only.</strong> El Paso&apos;s Best Lawyers is an independent attorney directory, not a law firm or legal aid provider. This page does not provide legal advice, determine eligibility, or create an attorney-client relationship. Inclusion does not imply an endorsement, affiliation or partnership.</section>
      </main>
      <Footer />
    </div>
  );
}
