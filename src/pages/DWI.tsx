import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileWarning,
  Gavel,
  MapPin,
  Scale,
  ShieldCheck,
} from "lucide-react";

const services = [
  {
    title: "First-Offense DWI",
    description:
      "Compare El Paso lawyers handling first-time DWI arrests, bond conditions, court dates, and license issues.",
    icon: ShieldCheck,
  },
  {
    title: "Repeat DWI Charges",
    description:
      "Find attorneys defending clients with prior alcohol- or drug-related driving convictions.",
    icon: Gavel,
  },
  {
    title: "Blood and Breath Tests",
    description:
      "Review firms handling evidentiary issues involving breath samples, blood draws, warrants, and laboratory testing.",
    icon: FileWarning,
  },
  {
    title: "License Suspension Hearings",
    description:
      "Connect with lawyers addressing administrative license revocation deadlines and hearing requests.",
    icon: Scale,
  },
];

const faqs = [
  {
    question: "What happens after a DWI arrest in Texas?",
    answer:
      "A DWI arrest may involve booking, bond, court settings, license deadlines, evidence review, negotiations, motions, and possibly trial. The exact process depends on the charge and circumstances.",
  },
  {
    question: "Can I lose my driver’s license after a DWI arrest?",
    answer:
      "A DWI arrest may trigger a separate administrative license process in addition to the criminal case. Deadlines may apply to request a hearing, so prompt legal advice can be important.",
  },
  {
    question: "Can a DWI charge be dismissed?",
    answer:
      "A dismissal may depend on the traffic stop, testing procedures, video, witnesses, probable cause, constitutional issues, and prosecutorial decisions. No outcome can be guaranteed.",
  },
  {
    question: "Should I hire a lawyer for a first DWI?",
    answer:
      "A lawyer can review the stop, testing, evidence, license consequences, possible defenses, plea options, and trial strategy. The decision depends on the facts and your circumstances.",
  },
];

export default function DWI() {
  useEffect(() => {
    const previousTitle = document.title;

    document.title =
      "Best DWI Lawyers in El Paso, TX | El Paso's Best Lawyers";

    let descriptionTag =
      document.querySelector<HTMLMetaElement>(
        'meta[name="description"]'
      );

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.name = "description";
      document.head.appendChild(descriptionTag);
    }

    let canonicalTag =
      document.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]'
      );

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.rel = "canonical";
      document.head.appendChild(canonicalTag);
    }

    const previousDescription = descriptionTag.content;
    const previousCanonical = canonicalTag.href;

    descriptionTag.content =
      "Compare DWI lawyers in El Paso, Texas handling first-offense DWI, repeat charges, license suspensions, blood tests, breath tests, and intoxication offenses.";

    canonicalTag.href =
      "https://elpasosbestlawyers.com/el-paso-dwi-lawyers";

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.id = "dwi-page-schema";
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name:
            "Best DWI Lawyers in El Paso, TX | El Paso's Best Lawyers",
          description:
            "Compare DWI lawyers in El Paso, Texas handling first-offense DWI, repeat charges, license suspensions, blood tests, breath tests, and intoxication offenses.",
          url:
            "https://elpasosbestlawyers.com/el-paso-dwi-lawyers",
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
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://elpasosbestlawyers.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "DWI Lawyers",
              item:
                "https://elpasosbestlawyers.com/el-paso-dwi-lawyers",
            },
          ],
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
    document.getElementById("dwi-firms")?.scrollIntoView({
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
            <Link to="/" className="transition hover:text-[#D4A62A]">
              Home
            </Link>

            <ChevronRight className="h-4 w-4" />

            <span>Practice Areas</span>

            <ChevronRight className="h-4 w-4" />

            <span className="text-white">DWI / DUI</span>
          </nav>
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4A62A]/40 bg-[#D4A62A]/10 px-4 py-2 text-sm font-semibold text-[#F3CA62]">
              <MapPin className="h-4 w-4" />
              Serving El Paso, Texas
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Best DWI Lawyers in El Paso, Texas
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              Compare El Paso DWI attorneys handling drunk-driving
              arrests, license suspensions, blood and breath testing,
              repeat offenses, and intoxication-related charges.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={scrollToFirms}
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4A62A] px-6 py-3 font-bold text-[#021B45] transition hover:brightness-105"
              >
                Browse DWI Firms
                <ArrowRight className="h-5 w-5" />
              </button>

              <Link
                to="/#list-form"
                className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                List Your Firm
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/15 bg-white/10 p-7 backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F3CA62]">
              DWI Defense Help
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Compare local lawyers for a Texas DWI case
            </h2>

            <ul className="mt-6 space-y-4 text-slate-100">
              {[
                "Review El Paso DWI firms",
                "Compare attorney profiles",
                "Explore license and testing issues",
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
            El Paso DWI Defense Attorneys
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#021B45] sm:text-4xl">
            Find a lawyer for your DWI case
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-700">
            A Texas DWI arrest can create both criminal and
            administrative consequences. Issues may include bond,
            court appearances, driver’s-license deadlines, testing,
            video evidence, prior convictions, employment concerns,
            and possible probation or jail exposure.
          </p>

          <p className="mt-4 text-lg leading-8 text-slate-700">
            El Paso&apos;s Best Lawyers helps residents compare local
            DWI attorneys and criminal defense firms. The directory
            does not recommend a particular lawyer or guarantee
            results.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#021B45] text-[#D4A62A]">
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#021B45]">
                {title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="dwi-firms"
        className="scroll-mt-24 border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-bold uppercase tracking-widest text-[#9A7212]">
            Local Directory
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#021B45]">
            Featured El Paso DWI Law Firms
          </h2>

          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <Scale className="mx-auto h-10 w-10 text-[#D4A62A]" />

            <h3 className="mt-4 text-2xl font-bold text-[#021B45]">
              DWI firm listings will appear here
            </h3>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
              This section will connect to your firm database and
              display firms whose practice areas include DWI or
              criminal defense.
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
              DWI Questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-xl border border-white/15 bg-white/10 p-6"
              >
                <summary className="cursor-pointer list-none text-lg font-bold">
                  {faq.question}
                </summary>

                <p className="mt-4 leading-7 text-slate-200">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-bold text-[#021B45]">
          Related El Paso Legal Services
        </h2>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Criminal Defense Lawyers",
              to: "/el-paso-criminal-defense-lawyers",
            },
            {
              label: "Personal Injury Lawyers",
              to: "/el-paso-personal-injury-lawyers",
            },
            {
              label: "Family Lawyers",
              to: "/el-paso-family-lawyers",
            },
            {
              label: "Immigration Lawyers",
              to: "/el-paso-immigration-lawyers",
            },
          ].map((page) => (
            <Link
              key={page.to}
              to={page.to}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 font-bold text-[#021B45] shadow-sm transition hover:border-[#D4A62A]"
            >
              {page.label}
              <ChevronRight className="h-5 w-5 text-[#D4A62A]" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}