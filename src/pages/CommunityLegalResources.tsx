import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, HandHeart, Landmark, Search, ShieldCheck, Users } from "lucide-react";
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

export default function CommunityLegalResources() {
  const [query, setQuery] = useState("");
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

        <section className="bg-white px-5 py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div><p className="text-sm font-bold uppercase tracking-widest text-teal-700">Another path to help</p><h2 className="mt-2 text-3xl font-bold text-[#0F2A43]">Looking for a private attorney?</h2><p className="mt-4 leading-8 text-slate-600">Free legal services may have income, case-type or capacity requirements. If you are seeking private representation, explore our El Paso attorney directories and compare listed firms by practice area.</p><Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0F2A43] px-6 py-3 font-bold text-white hover:bg-[#183b5c]">Find El Paso lawyers <ArrowRight size={17} /></Link></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8"><BookOpen className="text-teal-700" size={30} /><h3 className="mt-4 text-2xl font-bold text-[#0F2A43]">Understand your options</h3><p className="mt-3 leading-7 text-slate-600">Read plain-English Texas legal guides on accidents, family law, criminal defense and other common legal questions.</p><Link to="/guides" className="mt-5 inline-flex items-center gap-2 font-bold text-teal-800 hover:underline">Browse legal guides <ArrowRight size={17} /></Link></div>
          </div>
        </section>

        <section className="bg-[#0F2A43] px-5 py-16 text-white">
          <div className="mx-auto max-w-5xl"><div className="flex items-center gap-3 text-amber-300"><Users size={28} /><span className="text-sm font-bold uppercase tracking-widest">Community collaboration</span></div><h2 className="mt-4 text-3xl font-bold md:text-4xl">Help keep El Paso connected to legal resources</h2><p className="mt-4 max-w-3xl leading-8 text-slate-200">We welcome corrections, updated program information and opportunities to collaborate on useful public legal education. Resource inclusion is free and does not require endorsements, referrals or reciprocal links.</p><a href="mailto:support@elpasosbestlawyers.com?subject=Community%20Legal%20Resources%20Inquiry" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-bold text-slate-950 hover:bg-amber-300">Contact us about a resource <ArrowRight size={17} /></a></div>
        </section>
        <section className="mx-auto max-w-6xl px-5 py-10 text-sm leading-7 text-slate-600"><strong>Information only.</strong> El Paso&apos;s Best Lawyers is an independent attorney directory, not a law firm or legal aid provider. This page does not provide legal advice, determine eligibility, or create an attorney-client relationship. Inclusion does not imply an endorsement, affiliation or partnership.</section>
      </main>
      <Footer />
    </div>
  );
}
