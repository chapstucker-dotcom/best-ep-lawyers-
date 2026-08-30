import { useEffect } from "react";
import { Link } from "react-router-dom";
import PracticeAreaFirmDirectory from "../components/PracticeAreaFirmDirectory";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const matters = [
  "Wrongful Termination",
  "Workplace Discrimination",
  "Age Discrimination",
  "Sex Discrimination",
  "Retaliation",
  "Sexual Harassment",
  "Wage & Overtime Disputes",
  "Unpaid Wages",
  "Employment Contracts",
  "Severance Agreements",
  "Protected Leave",
  "Workplace Investigations",
];

const faqs = [
  ["What does an employment lawyer handle?", "Employment lawyers may handle disputes involving wrongful termination, discrimination, retaliation, harassment, unpaid wages, overtime, employment contracts, severance agreements, protected leave, and other workplace rights."],
  ["Can an El Paso employment attorney help with workplace discrimination?", "Depending on the facts, an employment attorney may evaluate claims involving discrimination based on legally protected characteristics, including age or sex, as well as retaliation connected to workplace complaints or protected activity."],
  ["What should I save if I think I have an employment claim?", "Preserve emails, text messages, performance reviews, disciplinary records, policies, pay records, schedules, complaints, contracts, severance documents, termination paperwork, and notes showing important dates and events."],
  ["How do I compare employment lawyers in El Paso?", "Consider experience with the type of workplace dispute you have, familiarity with federal and Texas employment law, communication practices, fee arrangements, and experience with negotiations, administrative proceedings, or litigation."],
  ["Can an employment lawyer review a severance agreement?", "An employment attorney may review severance terms, releases, confidentiality provisions, compensation provisions, and other contractual language and explain how the agreement may affect available rights or obligations."],
  ["What is workplace retaliation?", "Retaliation generally involves adverse workplace action allegedly connected to legally protected activity. Whether conduct qualifies depends on the facts and the law that applies."],
  ["Can employment disputes involve unpaid wages or overtime?", "Yes. Employment-law disputes may involve unpaid wages, overtime, employee classification, compensation practices, time records, or other pay-related issues depending on the circumstances."],
  ["When should I contact an employment lawyer?", "Consider seeking legal advice promptly when a termination, workplace complaint, pay dispute, severance deadline, administrative filing deadline, or other time-sensitive employment issue may affect your rights or options."],
];

const employmentDirectoryPage: PracticeAreaPageData = {
  path: "/el-paso-employment-lawyers",
  shortTitle: "Employment Law",
  title: "Best Employment Lawyers in El Paso, TX",
  description:
    "Compare employment lawyers in El Paso, TX for wrongful termination, discrimination, retaliation, harassment, unpaid wages, overtime, employment contracts, severance agreements, and workplace disputes.",
  metaDescription:
    "Compare employment lawyers in El Paso, TX for wrongful termination, discrimination, retaliation, harassment, unpaid wages, overtime, employment contracts, severance agreements, and workplace disputes.",
  heroText:
    "Compare El Paso employment lawyers handling workplace disputes involving termination, discrimination, retaliation, harassment, wages, contracts, and severance agreements.",
  topics: matters,
  overview: [
    "Employment disputes can involve federal law, Texas law, workplace policies, contracts, compensation records, protected activity, and filing deadlines.",
    "This directory helps workers and employers compare participating El Paso attorneys by relevant employment-law focus.",
  ],
  whenToHire: [
    "You were terminated and believe the decision may involve unlawful discrimination or retaliation.",
    "You have a dispute involving unpaid wages, overtime, compensation, or employee classification.",
    "You are dealing with workplace harassment, discrimination, or protected leave issues.",
    "You need help reviewing an employment contract or severance agreement.",
    "An employment-related filing deadline or administrative process may apply.",
  ],
  localContent: [
    "Employment disputes in El Paso can arise in workplaces across healthcare, education, government, retail, hospitality, transportation, construction, professional services, and other local industries.",
    "The analysis may depend on federal and Texas law, the employer's policies, contracts, pay and time records, workplace communications, the timing of complaints or discipline, and other case-specific evidence.",
    "Because some employment matters can involve administrative procedures or filing deadlines, preserving records and identifying important dates can be especially important.",
  ],
  faqs: faqs.map(([question, answer]) => ({ question, answer })),
  relatedPages: [
    { label: "Wrongful Termination", path: "/el-paso-wrongful-termination-lawyers" },
    { label: "Workplace Discrimination", path: "/el-paso-workplace-discrimination-lawyers" },
    { label: "Wage & Hour", path: "/el-paso-wage-hour-lawyers" },
    { label: "Retaliation", path: "/el-paso-retaliation-lawyers" },
    { label: "Sexual Harassment", path: "/el-paso-sexual-harassment-lawyers" },
    { label: "Employment Contract", path: "/el-paso-employment-contract-lawyers" },
    { label: "Severance Agreement", path: "/el-paso-severance-agreement-lawyers" },
  ],
  resourceLinks: [{ label: "El Paso Legal Guides", path: "/guides" }],
  lastUpdated: "August 30, 2026",
};

export default function EmploymentLaw() {
  useEffect(() => {
    const title = "Best Employment Lawyers in El Paso, TX | El Paso's Best Lawyers";
    const description =
      "Compare employment lawyers in El Paso, TX for wrongful termination, discrimination, retaliation, harassment, unpaid wages, overtime, employment contracts, severance agreements, and workplace disputes.";
    const canonical = "https://www.elpasosbestlawyers.com/el-paso-employment-lawyers";

    const previousTitle = document.title;
    document.title = title;

    const upsertMeta = (
      selector: string,
      attribute: "name" | "property",
      key: string,
      value: string
    ) => {
      let tag = document.querySelector<HTMLMetaElement>(selector);
      const existed = Boolean(tag);
      const previous = tag?.getAttribute("content") ?? null;

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }

      tag.content = value;

      return () => {
        if (!existed) tag?.remove();
        else if (previous !== null) tag?.setAttribute("content", previous);
      };
    };

    const cleanups = [
      upsertMeta('meta[name="description"]', "name", "description", description),
      upsertMeta('meta[name="robots"]', "name", "robots", "index, follow"),
      upsertMeta('meta[property="og:type"]', "property", "og:type", "website"),
      upsertMeta('meta[property="og:title"]', "property", "og:title", title),
      upsertMeta('meta[property="og:description"]', "property", "og:description", description),
      upsertMeta('meta[property="og:url"]', "property", "og:url", canonical),
      upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", "El Paso's Best Lawyers"),
    ];

    let canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalExisted = Boolean(canonicalTag);
    const previousCanonical = canonicalTag?.getAttribute("href") ?? null;

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.rel = "canonical";
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = canonical;

    const schemaId = "employment-law-seo-schema";
    document.getElementById(schemaId)?.remove();
    const schema = document.createElement("script");
    schema.id = schemaId;
    schema.type = "application/ld+json";
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": canonical,
          url: canonical,
          name: title,
          description,
          isPartOf: {
            "@type": "WebSite",
            name: "El Paso's Best Lawyers",
            url: "https://www.elpasosbestlawyers.com",
          },
          breadcrumb: { "@id": `${canonical}#breadcrumb` },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.elpasosbestlawyers.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Employment Lawyers",
              item: canonical,
            },
          ],
        },
        {
          "@type": "FAQPage",
          mainEntity: faqs.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        },
      ],
    });
    document.head.appendChild(schema);

    return () => {
      document.title = previousTitle;
      cleanups.forEach((cleanup) => cleanup());
      document.getElementById(schemaId)?.remove();

      if (!canonicalExisted) canonicalTag?.remove();
      else if (previousCanonical !== null) canonicalTag?.setAttribute("href", previousCanonical);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1529] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-amber-400">
          El Paso Employment Lawyer Directory
        </p>

        <h1 className="max-w-5xl text-4xl font-medium leading-tight text-amber-400 md:text-6xl">
          Best Employment Lawyers in El Paso, TX
        </h1>

        <p className="mt-7 max-w-5xl text-xl leading-8 text-slate-100">
          Compare El Paso employment lawyers and employment law attorneys handling wrongful termination,
          workplace discrimination, age and sex discrimination, retaliation, harassment, wage disputes,
          employment contracts, severance agreements, and other workplace claims.
        </p>

        <p className="mt-5 max-w-5xl leading-7 text-slate-300">
          Employment disputes can involve federal law, Texas law, workplace policies, contracts,
          compensation records, protected activity, and strict filing deadlines. This directory helps
          workers and employers compare participating El Paso attorneys by relevant employment-law focus.
        </p>

        <section className="mt-12">
          <PracticeAreaFirmDirectory page={employmentDirectoryPage} />
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Employment Law Matters Handled by El Paso Attorneys</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {matters.map((item) => (
              <div key={item} className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-5 py-5 font-semibold">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-7">
            <h2 className="text-2xl font-medium">How to Compare Employment Attorneys</h2>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-slate-200">
              <li>Experience with the specific workplace issue involved</li>
              <li>Familiarity with federal and Texas employment laws</li>
              <li>Experience with retaliation and discrimination claims</li>
              <li>Experience with wage, contract, and severance disputes</li>
              <li>Clear communication about fees, deadlines, and strategy</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-7">
            <h2 className="text-2xl font-medium">What an Employment Lawyer Can Help With</h2>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-slate-200">
              <li>Reviewing termination and disciplinary decisions</li>
              <li>Evaluating discrimination or retaliation concerns</li>
              <li>Reviewing pay, overtime, and compensation records</li>
              <li>Reviewing contracts, policies, and severance terms</li>
              <li>Preserving workplace evidence and evaluating next steps</li>
            </ul>
          </article>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Employment Law in El Paso</h2>
          <div className="mt-5 max-w-5xl space-y-5 leading-7 text-slate-300">
            <p>
              El Paso employees and employers may face workplace disputes involving hiring, pay, leave,
              discipline, termination, contracts, discrimination, harassment, retaliation, or other employment
              practices. The legal analysis often depends on the facts, timing, documents, employer policies,
              and the law that applies.
            </p>
            <p>
              Employment matters can also involve overlapping issues. A firing may raise questions about
              retaliation or discrimination; a wage dispute may involve classification or off-the-clock work;
              and a severance agreement may affect contractual or statutory rights.
            </p>
            <p>
              Employment disputes arise across El Paso industries including healthcare, education, government,
              retail, hospitality, transportation, construction, professional services, and other workplaces.
              Relevant evidence can include workplace policies, schedules, pay records, performance records,
              complaints, emails, text messages, contracts, and termination or severance documents.
            </p>
            <p>
              Some employment matters can involve administrative procedures or filing deadlines. Preserving
              records and identifying important dates early can help an attorney evaluate which laws,
              procedures, or contractual terms may apply.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map(([q, a]) => (
              <article key={q} className="rounded-xl border border-slate-700/70 bg-slate-900/45 p-6">
                <h3 className="text-xl font-semibold text-amber-400">{q}</h3>
                <p className="mt-3 leading-7 text-slate-300">{a}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-amber-400/30 bg-slate-900/60 p-8">
          <h2 className="text-3xl font-medium">Explore Related El Paso Employment Law Directories</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/el-paso-wrongful-termination-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Wrongful Termination Lawyers</Link>
            <Link to="/el-paso-workplace-discrimination-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Workplace Discrimination Lawyers</Link>
            <Link to="/el-paso-wage-hour-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Wage & Hour Lawyers</Link>
            <Link to="/el-paso-retaliation-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Retaliation Lawyers</Link>
            <Link to="/el-paso-sexual-harassment-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Sexual Harassment Lawyers</Link>
            <Link to="/el-paso-employment-contract-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Employment Contract Lawyers</Link>
            <Link to="/el-paso-severance-agreement-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Severance Agreement Lawyers</Link>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-slate-700/70 bg-slate-900/45 p-7">
          <h2 className="text-2xl font-medium">El Paso Employment Law Resources</h2>
          <div className="mt-5">
            <Link to="/guides" className="font-semibold text-amber-400 hover:underline">
              El Paso Legal Guides →
            </Link>
          </div>
          <p className="mt-5 text-sm text-slate-400">Last updated August 30, 2026.</p>
        </section>

        <section className="mt-14 border-t border-slate-700 pt-8 text-sm leading-6 text-slate-400">
          El Paso's Best Lawyers is a lawyer directory and informational resource. It is not a law firm and does not provide legal advice.
        </section>
      </section>
    </main>
  );
}
