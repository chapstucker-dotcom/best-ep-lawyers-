import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

const caseTypes = [
  {
    title: "Car Accidents",
    description:
      "Find El Paso attorneys handling vehicle collisions, insurance disputes, and injury claims.",
    icon: Car,
  },
  {
    title: "Truck Accidents",
    description:
      "Compare lawyers experienced with commercial trucking cases and serious collision claims.",
    icon: Truck,
  },
  {
    title: "Wrongful Death",
    description:
      "Connect with attorneys who represent families after a fatal accident caused by negligence.",
    icon: HeartPulse,
  },
  {
    title: "Serious Injuries",
    description:
      "Locate counsel for catastrophic injuries, long-term medical care, and lost earning capacity.",
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    question: "How much does a personal injury lawyer cost in El Paso?",
    answer:
      "Many personal injury attorneys work on a contingency-fee basis. This generally means the attorney receives a percentage of a recovery rather than charging an upfront legal fee. Fee agreements vary by firm, so review the terms directly with the attorney before hiring them.",
  },
  {
    question: "How long do I have to file a personal injury claim in Texas?",
    answer:
      "Deadlines depend on the type of claim, the parties involved, and the specific facts. Claims involving government entities or certain specialized matters may have shorter notice requirements. Speak with a qualified attorney promptly about any applicable deadline.",
  },
  {
    question: "What compensation may be available after an accident?",
    answer:
      "Depending on the circumstances, a claim may involve medical expenses, lost income, property damage, pain and suffering, impairment, future care, or other damages allowed under Texas law.",
  },
  {
    question: "Should I speak with the insurance company before hiring a lawyer?",
    answer:
      "You may be contacted by an insurance company soon after an accident. Before providing a recorded statement or signing documents, consider speaking with an attorney who can explain your rights and the potential effect of your statements.",
  },
];

const relatedPages = [
  {
    label: "Car Accident Lawyers",
    to: "/el-paso-car-accident-lawyers",
  },
  {
    label: "Truck Accident Lawyers",
    to: "/el-paso-truck-accident-lawyers",
  },
  {
    label: "Family Lawyers",
    to: "/el-paso-family-lawyers",
  },
  {
    label: "Criminal Defense Lawyers",
    to: "/el-paso-criminal-defense-lawyers",
  },
];

export default function PersonalInjury() {
  useEffect(() => {
    const previousTitle = document.title;

    document.title =
      "Best Personal Injury Lawyers in El Paso, TX | El Paso's Best Lawyers";

    
      const description =
  "Compare personal injury lawyers in El Paso, TX for car accidents, truck accidents, wrongful death, slip and fall, and other serious injury claims. Browse local attorney and law firm profiles.";
    let metaDescription = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }

    const previousDescription = metaDescription.content;
    metaDescription.content = description;

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.id = "personal-injury-page-schema";
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });

    document
      .getElementById("personal-injury-page-schema")
      ?.remove();

    document.head.appendChild(schema);

    return () => {
      document.title = previousTitle;
      metaDescription.content = previousDescription;
      schema.remove();
    };
  }, []);

  const scrollToListings = () => {
    document.getElementById("personal-injury-firms")?.scrollIntoView({
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

            <span className="text-white">Personal Injury</span>
          </nav>
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4A62A]/40 bg-[#D4A62A]/10 px-4 py-2 text-sm font-semibold text-[#F3CA62]">
              <MapPin className="h-4 w-4" />
              Serving El Paso, Texas
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Best Personal Injury Lawyers in El Paso, Texas
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              Compare local personal injury law firms, explore attorney
              profiles, and connect directly with lawyers serving injured
              people throughout El Paso and surrounding communities.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={scrollToListings}
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4A62A] px-6 py-3 font-bold text-[#021B45] transition hover:brightness-105"
              >
                Browse Personal Injury Firms
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
              Search With Confidence
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Find local legal help after an injury
            </h2>

            <ul className="mt-6 space-y-4 text-slate-100">
              {[
                "Compare El Paso law firms",
                "Review attorney profiles",
                "Explore relevant practice areas",
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
            El Paso Personal Injury Attorneys
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#021B45] sm:text-4xl">
            Find an attorney for your type of injury case
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-700">
            An accident can create medical bills, lost income, insurance
            disputes, and uncertainty about what to do next. A personal injury
            attorney can evaluate the circumstances, preserve evidence,
            communicate with insurers, calculate potential damages, and explain
            available legal options.
          </p>

          <p className="mt-4 text-lg leading-8 text-slate-700">
            El Paso&apos;s Best Lawyers is a local attorney directory designed
            to help residents identify firms that handle personal injury
            matters. This directory does not recommend a particular attorney or
            guarantee results. It gives visitors a central place to compare
            profiles and contact firms directly.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {caseTypes.map(({ title, description, icon: Icon }) => (
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

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-[#021B45]">
              Why consider hiring a personal injury lawyer?
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              Personal injury claims can involve questions about negligence,
              insurance coverage, medical records, future treatment, employment
              losses, and the value of non-economic damages. An attorney can
              help organize the evidence and explain how Texas law may apply.
            </p>

            <p className="mt-4 leading-8 text-slate-700">
              When comparing lawyers, ask about relevant experience,
              communication practices, fee arrangements, expected costs, and
              who will handle the case day to day.
            </p>
          </div>

          <div className="rounded-2xl bg-[#F6F1E5] p-8">
            <h3 className="text-2xl font-bold text-[#021B45]">
              Common personal injury matters
            </h3>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Car accidents",
                "Commercial truck accidents",
                "Motorcycle crashes",
                "Pedestrian injuries",
                "Premises liability",
                "Dog bites",
                "Defective products",
                "Wrongful death",
                "Construction accidents",
                "Catastrophic injuries",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#9A7212]" />
                  <span className="font-medium text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="personal-injury-firms"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-bold uppercase tracking-widest text-[#9A7212]">
              Local Directory
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#021B45] sm:text-4xl">
              Featured El Paso Personal Injury Firms
            </h2>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-[#021B45] hover:text-[#9A7212]"
          >
            Search all firms
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Star className="mx-auto h-10 w-10 text-[#D4A62A]" />

          <h3 className="mt-4 text-2xl font-bold text-[#021B45]">
            Personal injury firm listings will appear here
          </h3>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
            We will connect this section to your existing firm database next so
            it automatically displays firms whose practice areas include
            Personal Injury.
          </p>
        </div>
      </section>

      <section className="bg-[#021B45] text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-center">
            <p className="font-bold uppercase tracking-widest text-[#D4A62A]">
              Frequently Asked Questions
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Personal Injury Questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-white/15 bg-white/10 p-6"
              >
                <summary className="cursor-pointer list-none pr-8 text-lg font-bold">
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
          {relatedPages.map((page) => (
            <Link
              key={page.to}
              to={page.to}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 font-bold text-[#021B45] shadow-sm transition hover:border-[#D4A62A] hover:shadow-md"
            >
              {page.label}
              <ChevronRight className="h-5 w-5 text-[#D4A62A]" />
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#D4A62A]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-14 lg:flex-row lg:items-center">
          <div>
            <p className="font-bold uppercase tracking-widest text-[#021B45]">
              For El Paso Law Firms
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#021B45]">
              Claim Your Complimentary Founding Listing
            </h2>

            <p className="mt-3 max-w-3xl text-lg text-[#17345E]">
              Create a professional firm profile, showcase your attorneys and
              practice areas, and increase your visibility to people searching
              for legal help in El Paso.
            </p>
          </div>

          <Link
            to="/#list-form"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#021B45] px-7 py-4 font-bold text-white transition hover:bg-[#092B62]"
          >
            List Your Firm
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
        {/* ACCIDENT_CLUSTER_INTERNAL_LINKS */}
        <section className="py-10 border-t bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-3">Related El Paso Personal Injury Resources</h2>
            <p className="text-muted-foreground mb-5">Explore related El Paso legal resources and compare lawyers by accident or injury type.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <a href="/el-paso-car-accident-lawyers" className="text-primary hover:underline">Car Accident Lawyers</a>
              <a href="/el-paso-truck-accident-lawyers" className="text-primary hover:underline">Truck Accident Lawyers</a>
              <a href="/el-paso-motorcycle-accident-lawyers" className="text-primary hover:underline">Motorcycle Accident Lawyers</a>
              <a href="/el-paso-bicycle-accident-lawyers" className="text-primary hover:underline">Bicycle Accident Lawyers</a>
              <a href="/el-paso-uber-lyft-accident-lawyers" className="text-primary hover:underline">Uber/Lyft Accident Lawyers</a>
              <a href="/el-paso-wrongful-death-lawyers" className="text-primary hover:underline">Wrongful Death Lawyers</a>
            </div>
          </div>
        </section>

    </main>
  );
}
