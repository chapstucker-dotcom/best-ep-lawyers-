import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  Gavel,
  MapPin,
  MessageSquareText,
  Scale,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import type { PracticeAreaPageData } from "../data/practiceAreaPages";
import PracticeAreaFirmDirectory from "./PracticeAreaFirmDirectory";

type Props = {
  page: PracticeAreaPageData;
};

const SITE_URL = "https://www.elpasosbestlawyers.com";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function upsertMeta(name: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }

  tag.content = content;
}

function upsertProperty(property: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`
  );

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }

  tag.content = content;
}

export default function PracticeAreaTemplate({ page }: Props) {
  useEffect(() => {
    const title = `${page.title} | El Paso's Best Lawyers`;
    const description = page.metaDescription || page.description;
    const canonical = `${SITE_URL}${page.path}`;

    document.title = title;

    upsertMeta("description", description);
    upsertMeta("robots", "index, follow");
    upsertProperty("og:type", "website");
    upsertProperty("og:title", title);
    upsertProperty("og:description", description);
    upsertProperty("og:url", canonical);
    upsertProperty("og:site_name", "El Paso's Best Lawyers");

    let canonicalTag =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.rel = "canonical";
      document.head.appendChild(canonicalTag);
    }

    canonicalTag.href = canonical;

    const schemaId = "practice-area-schema";
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
          dateModified: page.lastUpdated || undefined,
          isPartOf: {
            "@type": "WebSite",
            name: "El Paso's Best Lawyers",
            url: SITE_URL,
          },
          breadcrumb: {
            "@id": `${canonical}#breadcrumb`,
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Practice Areas",
              item: `${SITE_URL}/#practice-areas`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: page.shortTitle,
              item: canonical,
            },
          ],
        },
        {
          "@type": "FAQPage",
          mainEntity: page.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        },
      ],
    });

    document.head.appendChild(schema);

    return () => {
      document.getElementById(schemaId)?.remove();
    };
  }, [page]);

  const firmsId = `${slugify(page.shortTitle)}-firms`;

  const processSteps = [
    {
      title: "Compare",
      text: `Review El Paso ${page.shortTitle.toLowerCase()} firms, services, and experience.`,
      icon: Search,
    },
    {
      title: "Contact",
      text: "Reach out to participating firms and ask about your legal matter.",
      icon: MessageSquareText,
    },
    {
      title: "Choose",
      text: "Select the lawyer or law firm that best fits your needs and priorities.",
      icon: BadgeCheck,
    },
  ];

  const commonMistakes = [
    "Waiting too long to learn about possible deadlines.",
    "Hiring without comparing relevant experience and fees.",
    "Assuming every law firm handles the same type of matter.",
    "Failing to keep important records, notices, contracts, or communications.",
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-[#07162f] text-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-slate-300"
          >
            <Link to="/" className="transition hover:text-[#d6a928]">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Practice Areas</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{page.shortTitle}</span>
          </nav>
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d6a928]/40 bg-[#d6a928]/10 px-4 py-2 text-sm font-semibold text-[#f0ca62]">
              <MapPin className="h-4 w-4" />
              El Paso County Legal Directory
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {page.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              {page.heroText || page.description}
            </p>

            {page.lastUpdated && (
              <p className="mt-4 text-sm font-medium text-slate-300">
                Content reviewed and updated {page.lastUpdated}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() =>
                  document.getElementById(firmsId)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[#d6a928] px-6 py-3 font-bold text-[#07162f] transition hover:bg-[#e5bb46]"
              >
                Browse {page.shortTitle} Firms
                <ArrowRight className="h-5 w-5" />
              </button>

              <Link
                to="/pricing"
                className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Claim Your Law Firm
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/15 bg-white/10 p-7 backdrop-blur-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-[#f0ca62]">
              Why Use the Directory
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Compare local legal professionals
            </h2>

            <ul className="mt-6 space-y-4">
              {[
                "Explore relevant practice-area information",
                "Compare participating local firms",
                "Review services before making contact",
                "Start with one clear local resource",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#d6a928]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:grid-cols-3">
          {processSteps.map(({ title, text, icon: Icon }, index) => (
            <article key={title} className="flex gap-4 rounded-xl p-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#07162f] text-[#d6a928]">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#9a7212]">
                  Step {index + 1}
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#07162f]">
                  {title}
                </h2>
                <p className="mt-2 leading-6 text-slate-600">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <article>
            <p className="font-bold uppercase tracking-widest text-[#9a7212]">
              Understanding Your Options
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#07162f] sm:text-4xl">
              What does an El Paso {page.shortTitle.toLowerCase()} lawyer do?
            </h2>

            <div className="mt-6 space-y-5 text-lg leading-8 text-slate-700">
              {page.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <aside className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#07162f] text-[#d6a928]">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#07162f]">
              When legal guidance may help
            </h2>

            <ul className="mt-5 space-y-4">
              {page.whenToHire.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#9a7212]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-bold uppercase tracking-widest text-[#9a7212]">
            Common Services
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#07162f] sm:text-4xl">
            Legal services and case types
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {page.topics.map((topic) => (
              <article
                key={topic}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#07162f] text-[#d6a928]">
                  <Scale className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#07162f]">
                  {topic}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  Compare El Paso attorneys who handle {topic.toLowerCase()} matters.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-[#eaf0f8] p-8 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#07162f] text-[#d6a928]">
                <Building2 className="h-6 w-6" />
              </div>

              <p className="mt-6 font-bold uppercase tracking-widest text-[#9a7212]">
                Texas and El Paso
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#07162f]">
                Local context matters
              </h2>
            </div>

            <div className="space-y-5 text-lg leading-8 text-slate-700">
              {page.localContent.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#07162f] text-[#d6a928]">
                <CircleAlert className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-3xl font-bold text-[#07162f]">
                Common mistakes to avoid
              </h2>

              <ul className="mt-6 space-y-4">
                {commonMistakes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#9a7212]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-200 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#07162f] text-[#d6a928]">
                <Gavel className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-3xl font-bold text-[#07162f]">
                Questions to ask before hiring
              </h2>

              <ul className="mt-6 space-y-4 text-slate-700">
                {[
                  "How often do you handle matters like mine?",
                  "Who will be responsible for my case?",
                  "How are legal fees and expenses structured?",
                  "What information should I bring to the consultation?",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <MessageSquareText className="mt-1 h-5 w-5 shrink-0 text-[#9a7212]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <PracticeAreaFirmDirectory page={page} />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-bold uppercase tracking-widest text-[#9a7212]">
            Helpful Resources
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#07162f]">
            Related legal guides
          </h2>

          {page.resourceLinks && page.resourceLinks.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {page.resourceLinks.map((resource) => (
                <Link
                  key={resource.path}
                  to={resource.path}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:border-[#d6a928] hover:shadow-sm"
                >
                  <BookOpen className="h-8 w-8 text-[#9a7212]" />
                  <h3 className="mt-5 text-xl font-bold text-[#07162f]">
                    {resource.label}
                  </h3>
                  <p className="mt-4 inline-flex items-center gap-2 font-semibold text-[#9a7212]">
                    Read guide
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { title: `How to choose an El Paso ${page.shortTitle.toLowerCase()} lawyer`, icon: Users },
                { title: `Questions to ask about a ${page.shortTitle.toLowerCase()} matter`, icon: FileText },
                { title: `Understanding Texas ${page.shortTitle.toLowerCase()} issues`, icon: BookOpen },
              ].map(({ title, icon: Icon }) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <Icon className="h-8 w-8 text-[#9a7212]" />
                  <h3 className="mt-5 text-xl font-bold text-[#07162f]">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    Explore our Texas Law Guides for practical information related to this practice area.
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#07162f] text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-center">
            <p className="font-bold uppercase tracking-widest text-[#d6a928]">
              Frequently Asked Questions
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {page.shortTitle} Questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {page.faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-xl border border-white/15 bg-white/10 p-6"
              >
                <summary className="cursor-pointer text-lg font-bold">
                  {faq.question}
                </summary>

                <p className="mt-4 leading-7 text-slate-200">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 rounded-3xl bg-white p-8 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-[#9a7212]">
              <Clock3 className="h-5 w-5" />
              <span className="font-bold uppercase tracking-widest">
                Start Your Search
              </span>
            </div>

            <h2 className="mt-3 text-3xl font-bold text-[#07162f]">
              Speak with an El Paso {page.shortTitle.toLowerCase()} lawyer
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              Use the directory to compare participating firms, review services,
              and contact a law office directly about your legal matter.
            </p>
          </div>

          <Link
            to="/#lead-form"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d6a928] px-6 py-3 font-bold text-[#07162f]"
          >
            Find Legal Help
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#07162f]">
            Related practice areas
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {page.relatedPages.map((related) => (
              <Link
                key={related.path}
                to={related.path}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-[#07162f] transition hover:border-[#d6a928] hover:text-[#9a7212]"
              >
                {related.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#07162f] text-[#d6a928]">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-[#07162f]">
                El Paso's Best Lawyers
              </p>
              <p className="text-sm text-slate-600">
                Connecting El Paso with local legal professionals.
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-[#07162f]"
          >
            Return to the directory
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
