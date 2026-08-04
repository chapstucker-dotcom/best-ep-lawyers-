import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  HeartPulse,
  MapPin,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";

const services = [
  {
    title: "Wills",
    description:
      "Compare El Paso attorneys who prepare wills and help clients document how property should be distributed.",
    icon: FileText,
  },
  {
    title: "Trusts",
    description:
      "Find lawyers assisting with revocable trusts, family trusts, asset management, and succession planning.",
    icon: ShieldCheck,
  },
  {
    title: "Powers of Attorney",
    description:
      "Connect with attorneys preparing documents that authorize trusted people to handle financial matters.",
    icon: Users,
  },
  {
    title: "Medical Directives",
    description:
      "Review firms helping clients document healthcare preferences and appoint medical decision-makers.",
    icon: HeartPulse,
  },
];

const faqs = [
  {
    question: "Do I need a will in Texas?",
    answer:
      "A will can identify beneficiaries, nominate an executor, address guardianship issues, and provide instructions for distributing property after death.",
  },
  {
    question: "What is the difference between a will and a trust?",
    answer:
      "A will generally directs property through probate after death. A trust may hold and manage assets during life and after death, depending on its terms.",
  },
  {
    question: "What documents are commonly included in an estate plan?",
    answer:
      "An estate plan may include a will, trust, financial power of attorney, medical power of attorney, directive to physicians, and beneficiary designations.",
  },
  {
    question: "How often should an estate plan be reviewed?",
    answer:
      "Documents should be reviewed after major family, financial, health, business, or legal changes and periodically to confirm they still reflect your wishes.",
  },
];

export default function EstatePlanning() {
  useEffect(() => {
    const previousTitle = document.title;

    document.title =
      "Best Estate Planning Lawyers in El Paso, TX | El Paso's Best Lawyers";

    let descriptionTag =
      document.querySelector<HTMLMetaElement>('meta[name="description"]');

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.name = "description";
      document.head.appendChild(descriptionTag);
    }

    let canonicalTag =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.rel = "canonical";
      document.head.appendChild(canonicalTag);
    }

    const previousDescription = descriptionTag.content;
    const previousCanonical = canonicalTag.href;

    descriptionTag.content =
      "Compare estate planning lawyers in El Paso, Texas for wills, trusts, powers of attorney, medical directives, asset protection, and succession planning.";

    canonicalTag.href =
      "https://elpasosbestlawyers.com/el-paso-estate-planning-lawyers";

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.id = "estate-planning-page-schema";
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name:
            "Best Estate Planning Lawyers in El Paso, TX | El Paso's Best Lawyers",
          description: descriptionTag.content,
          url: canonicalTag.href,
        },
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
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

    document.getElementById(schema.id)?.remove();
    document.head.appendChild(schema);

    return () => {
      document.title = previousTitle;
      descriptionTag.content = previousDescription;
      canonicalTag.href = previousCanonical;
      schema.remove();
    };
  }, []);

  const scrollToFirms = () => {
    document.getElementById("estate-planning-firms")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-[#021B45] text-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-slate-300"
          >
            <Link to="/" className="hover:text-[#D4A62A]">
              Home
            </Link>

            <ChevronRight className="h-4 w-4" />
            <span>Practice Areas</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Estate Planning</span>
          </nav>
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4A62A]/40 bg-[#D4A62A]/10 px-4 py-2 text-sm font-semibold text-[#F3CA62]">
              <MapPin className="h-4 w-4" />
              Serving El Paso, Texas
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Best Estate Planning Lawyers in El Paso, Texas
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              Compare El Paso estate planning attorneys helping individuals,
              families, and business owners prepare wills, trusts, powers of
              attorney, medical directives, and succession plans.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={scrollToFirms}
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4A62A] px-6 py-3 font-bold text-[#021B45]"
              >
                Browse Estate Planning Firms
                <ArrowRight className="h-5 w-5" />
              </button>

              <Link
                to="/#list-form"
                className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10"
              >
                List Your Firm
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/15 bg-white/10 p-7">
            <p className="text-sm font-bold uppercase tracking-widest text-[#F3CA62]">
              Plan With Confidence
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Compare local estate planning professionals
            </h2>

            <ul className="mt-6 space-y-4">
              {[
                "Compare El Paso law firms",
                "Review attorney profiles",
                "Explore wills and trust services",
                "Contact firms directly",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A62A]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-4xl">
          <p className="font-bold uppercase tracking-widest text-[#9A7212]">
            El Paso Estate Planning Attorneys
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#021B45] sm:text-4xl">
            Prepare for your family, property, and future
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-700">
            Estate planning can provide instructions for property, healthcare
            decisions, financial authority, guardianship, business succession,
            and estate administration. An attorney can recommend documents
            based on your family, assets, risks, and objectives.
          </p>

          <p className="mt-4 text-lg leading-8 text-slate-700">
            El Paso&apos;s Best Lawyers helps residents compare local estate
            planning attorneys and law firms. The directory does not recommend
            a particular lawyer or guarantee results.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#021B45] text-[#D4A62A]">
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#021B45]">
                {title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="estate-planning-firms"
        className="scroll-mt-24 border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-bold uppercase tracking-widest text-[#9A7212]">
            Local Directory
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#021B45]">
            Featured El Paso Estate Planning Firms
          </h2>

          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <Scale className="mx-auto h-10 w-10 text-[#D4A62A]" />

            <h3 className="mt-4 text-2xl font-bold text-[#021B45]">
              Estate planning listings will appear here
            </h3>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
              This section will connect to your firm database and display firms
              whose services include wills, trusts, and estate planning.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#021B45] text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-center">
            <p className="font-bold uppercase tracking-widest text-[#D4A62A]">
              Frequently Asked Questions
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Estate Planning Questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
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
    </main>
  );
}