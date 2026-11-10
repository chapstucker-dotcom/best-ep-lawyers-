import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CalendarDays, ExternalLink, HandHeart, Landmark, Link2, MapPin, Search, ShieldCheck, Users, Scale, HeartHandshake } from "lucide-react";
import skyline from "@/assets/hero-franklin-star.png";
import Footer from "@/components/Footer";
import { useSeo } from "../hooks/use-seo";

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

type Tab = "events" | "resources" | "programs";
type ContributionType = "Event" | "Resource" | "Program";

export default function CommunityLegalResources() {
  const [tab, setTab] = useState<Tab>("events");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All resources");
  const [contributionType, setContributionType] = useState<ContributionType>("Event");
  const [form, setForm] = useState({ name: "", email: "", organization: "", title: "", date: "", location: "", link: "", details: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const filtered = useMemo(() => resources.filter((r) => (category === "All resources" || r.category === category) && `${r.name} ${r.category} ${r.summary}`.toLowerCase().includes(query.trim().toLowerCase())), [category, query]);
  useSeo({ title: "El Paso Community Resources, Events & Legal Aid | El Paso's Best Lawyers", description: "Find El Paso community resources, legal aid organizations, nonprofit programs, and upcoming educational events. Submit a resource or event for free review.", path: "/community-legal-resources" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    if (contributionType === "Event") {
      const today = new Date();
      const localToday = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
      if (!form.date || form.date < localToday) {
        setStatus("error");
        setErrorText("Please select today or a future date for your event.");
        return;
      }
    }
    setStatus("sending"); setErrorText("");
    const message = [`Submission type: ${contributionType}`, `Title: ${form.title}`, form.date ? `Date: ${form.date}` : "", form.location ? `Location: ${form.location}` : "", form.link ? `Source URL: ${form.link}` : "", `Details: ${form.details}`].filter(Boolean).join("\n");
    try {
      const response = await fetch("/api/community-resource-contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, organization: form.organization, message, website: form.website }) });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) throw new Error(result?.error || "Submission failed. Please try again.");
      setStatus("success"); setForm({ name: "", email: "", organization: "", title: "", date: "", location: "", link: "", details: "", website: "" });
    } catch (err) { setStatus("error"); setErrorText(err instanceof Error ? err.message : "Submission failed."); }
  }

  const tabs: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
    { id: "events", label: "Upcoming Events", icon: CalendarDays },
    { id: "resources", label: "Community Resources", icon: Link2 },
    { id: "programs", label: "Programs & Services", icon: Users },
  ];
  const types: { id: ContributionType; description: string; icon: typeof CalendarDays }[] = [
    { id: "Event", subtitle: "Workshop, clinic or community event", icon: CalendarDays },
    { id: "Resource", subtitle: "Free legal help, form or guide", icon: Link2 },
    { id: "Program", subtitle: "Nonprofit program or service", icon: HeartHandshake },
  ];
  return <div className="min-h-screen bg-[#FBF8F1] text-[#0A2340]">
    <header className="bg-[#06182C] text-white border-b border-[#D9AE50]/40">
      <div className="mx-auto max-w-[1440px] px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="text-lg sm:text-xl font-black tracking-wide text-white">✦ EL PASO'S <span className="text-[#E4BB65]">BEST LAWYERS</span></Link>
        <nav aria-label="Community hub navigation" className="flex items-center gap-4 sm:gap-7 text-sm font-semibold"><Link to="/">Find a Lawyer</Link><Link to="/guides">Legal Guides</Link><span className="border-b-2 border-[#E4BB65] pb-1 text-[#E4BB65]">Resources</span><Link to="/for-law-firms">For Law Firms</Link></nav>
      </div>
    </header>
    <main>
      <section className="relative isolate overflow-hidden bg-[#06182C] text-white">
        <img src={skyline} alt="El Paso skyline, Franklin Mountains and illuminated star" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#06182C]/95 via-[#06182C]/75 to-[#06182C]/60" />
        <div className="mx-auto max-w-[1440px] grid gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(360px,0.7fr)] lg:items-center lg:py-16">
          <div><p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-[#F1CA78]">— El Paso Community Resources —</p>
            <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl xl:text-6xl">Your El Paso Legal &amp; Community Resource Hub</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 sm:text-lg">Free legal information, community resources, educational events and local programs to help El Paso families, workers and small businesses.</p>
            <div className="mt-8 grid grid-cols-2 gap-3 rounded-xl border border-white/20 bg-[#06182C]/80 p-4 sm:grid-cols-4">
              {[{icon:CalendarDays,heading:"Community Events",desc:"Workshops & clinics"},{icon:BookOpen,heading:"Helpful Resources",desc:"Guides & services"},{icon:Users,heading:"Local Programs",desc:"Community support"},{icon:HandHeart,heading:"Get Involved",desc:"Share information"}].map(({icon:Icon,title,desc})=><div key={title} className="text-center sm:text-left"><Icon className="mx-auto mb-2 h-7 w-7 text-[#F1CA78] sm:mx-0"/><div className="text-sm font-bold">{title}</div><div className="mt-1 text-xs text-slate-200">{desc}</div></div>)}
            </div>
          </div>
          <aside className="rounded-2xl border-2 border-[#F0C66D] bg-[#06182C]/95 p-5 shadow-2xl sm:p-7">
            <div className="flex items-start gap-3"><Users className="h-9 w-9 shrink-0 text-[#F0C66D]"/><div><h2 className="font-serif text-2xl font-bold">Share a Community Resource</h2><p className="mt-2 text-sm leading-6 text-slate-200">Help El Paso residents by sharing an event, program or useful resource. No account required.</p></div></div>
            <div className="mt-5 grid grid-cols-3 gap-2">{types.map(({id,icon:Icon})=><button key={id} type="button" onClick={()=>{setContributionType(id);document.getElementById("contribute")?.scrollIntoView({behavior:"smooth"});}} className="rounded-lg border border-white/25 bg-white/10 px-2 py-4 text-center text-xs font-semibold hover:border-[#F0C66D]"><Icon className="mx-auto mb-2 h-6 w-6 text-[#F0C66D]"/>{id}</button>)}</div>
            <a href="#contribute" className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#F7D88C] to-[#D4A345] px-5 py-3 font-black text-[#06182C] hover:brightness-110">Submit a Contribution <ArrowRight className="h-4 w-4"/></a>
            <p className="mt-4 text-center text-xs text-slate-200">✓ Free to contribute &nbsp; ✓ Reviewed before publication</p>
          </aside>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-5 py-9">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Community resources">{tabs.map(({id,label,icon:Icon})=><button role="tab" aria-selected={tab===id} key={id} onClick={()=>setTab(id)} className={`inline-flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold shadow-sm ${tab===id?"border-[#BC8B36] bg-[#C9973D] text-white":"border-[#DDD3C0] bg-white text-[#0A2340] hover:border-[#BC8B36]"}`}><Icon className="h-5 w-5"/>{label}</button>)}</div>
          <label className="flex items-center gap-2 rounded-full border border-[#DDD3C0] bg-white px-4 py-2"><Search className="h-4 w-4 text-slate-500"/><input value={query} onChange={e=>{setQuery(e.target.value);if(tab==="events")setTab("resources");}} aria-label="Search resources" placeholder="Search resources or organizations..." className="w-full bg-transparent text-sm outline-none sm:w-64"/></label>
        </div>
        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.85fr)]">
          <div>
            {tab==="events" && <div className="rounded-xl border border-[#DDD3C0] bg-white p-7 shadow-sm"><div className="flex items-center gap-3"><CalendarDays className="h-8 w-8 text-[#B98A38]"/><h2 className="font-serif text-2xl font-bold">Upcoming Community Events</h2></div><p className="mt-4 leading-7 text-slate-600">We're collecting verified workshops, legal clinics and educational events from El Paso organizations. No events are published until their details have been reviewed.</p><a href="#contribute" onClick={()=>setContributionType("Event")} className="mt-5 inline-flex items-center gap-2 font-bold text-[#946B28] underline">Submit an upcoming event <ArrowRight className="h-4 w-4"/></a></div>}
            {tab==="resources" && <><h2 className="font-serif text-2xl font-bold">Explore Community Resources</h2><div className="my-4 flex flex-wrap gap-2">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} aria-pressed={category===c} className={`rounded-full border px-3 py-2 text-xs font-bold ${category===c?"bg-[#0A2340] text-white":"bg-white text-[#0A2340]"}`}>{c}</button>)}</div><div className="grid gap-3">{filtered.map(r=><article key={r.name} className="rounded-xl border border-[#DDD3C0] bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase text-[#946B28]">{r.category}</p><h3 className="mt-1 text-lg font-bold">{r.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{r.summary}</p>{r.note&&<p className="mt-2 text-xs text-slate-500">{r.note}</p>}<a href={r.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#946B28] underline">Visit official website <ExternalLink className="h-4 w-4"/></a></article>)}{filtered.length===0&&<p>No resources match your search.</p>}</div></>}
            {tab==="programs" && <div className="rounded-xl border border-[#DDD3C0] bg-white p-7 shadow-sm"><div className="flex items-center gap-3"><Users className="h-8 w-8 text-[#B98A38]"/><h2 className="font-serif text-2xl font-bold">Programs &amp; Services</h2></div><p className="mt-4 leading-7 text-slate-600">Explore public and nonprofit support programs. We're inviting local organizations to share current program information for review.</p><button onClick={()=>{setTab("resources");setCategory("Community Support")}} className="mt-5 font-bold text-[#946B28] underline">Browse existing community support resources</button></div>}
          </div>
          <aside className="space-y-5"><div className="rounded-xl border border-[#DDD3C0] bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 text-xl font-bold"><BookOpen className="h-6 w-6"/>Featured Community Resources</h2><div className="mt-5 space-y-4">{resources.slice(0,3).map(r=><a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="block border-b border-slate-100 pb-3 last:border-0"><span className="font-bold">{r.name}</span><p className="mt-1 text-xs leading-5 text-slate-600">{r.summary}</p></a>)}</div></div>
            <div className="rounded-xl border border-[#DDD3C0] bg-[#F2EEE6] p-6 shadow-sm"><h2 className="flex items-center gap-2 text-xl font-bold"><HeartHandshake className="h-7 w-7 text-[#C9973D]"/>Community Collaboration</h2><p className="mt-3 text-sm leading-6">Nonprofits, libraries and community organizations can share useful information for El Paso residents at no charge. Listing does not imply a formal partnership or endorsement.</p><a href="#contribute" className="mt-4 inline-flex rounded-lg border border-[#B98A38] px-4 py-2 text-sm font-bold text-[#0A2340] underline">Contribute information</a></div></aside>
        </div>
      </section>
      <section id="contribute" className="scroll-mt-6 bg-[#0A2340] px-5 py-14 text-white"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-sm font-bold uppercase tracking-widest text-[#F0C66D]">Get involved</p><h2 className="mt-3 font-serif text-3xl font-bold">Submit a Community Contribution</h2><p className="mt-4 leading-7 text-slate-200">Share an event, resource or program without creating a profile. Submissions go to our team for manual review and are not published automatically.</p><p className="mt-4 text-sm text-slate-300">Please do not submit confidential case details or personal legal information.</p></div>
        <div className="rounded-xl border border-[#F0C66D]/40 bg-white p-6 text-[#0A2340] shadow-lg"><h3 className="text-xl font-bold">Share information for review</h3>{status==="success"?<div role="status" className="mt-5 rounded-lg bg-emerald-50 p-4">Thank you. Your contribution was sent for review.<button onClick={()=>setStatus("idle")} className="ml-2 font-bold underline">Send another</button></div>:<form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <fieldset className="sm:col-span-2"><legend className="mb-2 text-sm font-bold">What would you like to share?</legend><div className="grid grid-cols-3 gap-2">{types.map(({id,icon:Icon})=><button key={id} type="button" aria-pressed={contributionType===id} onClick={()=>setContributionType(id)} className={`flex flex-col items-center rounded-lg border px-2 py-3 text-sm font-bold ${contributionType===id?"border-[#B98A38] bg-[#FFF4DA]":"border-slate-200"}`}><Icon className="mb-1 h-5 w-5"/>{id}</button>)}</div></fieldset>
          <label className="text-sm font-bold">Your name *<input required maxLength={120} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-300 p-3"/></label>
          <label className="text-sm font-bold">Email *<input required type="email" maxLength={254} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-300 p-3"/></label>
          <label className="text-sm font-bold sm:col-span-2">Organization name *<input required maxLength={150} value={form.organization} onChange={e=>setForm({...form,organization:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-300 p-3"/></label>
          <label className="text-sm font-bold sm:col-span-2">{contributionType} title *<input required maxLength={180} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-300 p-3"/></label>
          {contributionType==="Event"&&<label className="text-sm font-bold">Event date *<input required type="date" min={new Date().toLocaleDateString("en-CA")} value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-300 p-3"/></label>}
          <label className="text-sm font-bold">Location {contributionType==="Event"?"*":"(optional)"}<input required={contributionType==="Event"} maxLength={180} value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Address or online" className="mt-1 w-full rounded-lg border border-slate-300 p-3"/></label>
          <label className="text-sm font-bold sm:col-span-2">Relevant website or source link<input type="url" maxLength={500} value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="https://" className="mt-1 w-full rounded-lg border border-slate-300 p-3"/></label>
          <label className="text-sm font-bold sm:col-span-2">Details *<textarea required minLength={10} maxLength={1800} rows={4} value={form.details} onChange={e=>setForm({...form,details:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-300 p-3"/></label>
          <div className="absolute -left-[10000px]" aria-hidden="true"><label>Leave blank<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>setForm({...form,website:e.target.value})}/></label></div>
          {status==="error"&&<p role="alert" className="text-sm text-red-700 sm:col-span-2">{errorText}</p>}
          <button disabled={status==="sending"} className="flex items-center justify-center gap-2 rounded-lg bg-[#0A2340] px-6 py-3 font-bold text-white disabled:opacity-60 sm:col-span-2">{status==="sending"?"Sending...":"Submit for Review"}<ArrowRight className="h-4 w-4"/></button><p className="text-xs text-slate-500 sm:col-span-2">Free to submit. No account required. We review submissions before publication.</p>
        </form>}</div></div></section>
      <section className="mx-auto max-w-6xl px-5 py-8 text-xs leading-6 text-slate-600"><ShieldCheck className="mr-2 inline h-4 w-4"/>El Paso's Best Lawyers is an independent attorney directory, not a law firm or legal aid provider. Information is not legal advice. Resource inclusion does not imply endorsement or formal partnership. Verify services and eligibility directly with providers.</section>
    </main><Footer/>
  </div>;
}
