import { useEffect } from "react";
import { Link } from "react-router-dom";
import LeadCaptureForm from "../components/LeadCaptureForm";

const caseTypes = [
  {
    title: "Car Accidents",
    description:
      "Compare El Paso lawyers handling car crashes, insurance disputes, serious injuries, and uninsured or underinsured motorist claims.",
    path: "/el-paso-car-accident-lawyers",
  },
  {
    title: "Truck Accidents",
    description:
      "Find attorneys for commercial truck and 18-wheeler crashes involving trucking companies, insurers, and complex liability issues.",
    path: "/el-paso-truck-accident-lawyers",
  },
  {
    title: "Motorcycle Accidents",
    description:
      "Explore lawyers handling motorcycle collisions, serious injuries, insurance claims, and fatal crashes.",
    path: "/el-paso-motorcycle-accident-lawyers",
  },
  {
    title: "Slip and Fall",
    description:
      "Compare attorneys for premises-liability claims involving unsafe property conditions, falls, and resulting injuries.",
    path: "/el-paso-slip-and-fall-lawyers",
  },
  {
    title: "Dog Bites",
    description:
      "Find El Paso lawyers handling dog attacks, bite injuries, scarring, medical expenses, and related liability claims.",
    path: "/el-paso-dog-bite-lawyers",
  },
  {
    title: "Wrongful Death",
    description:
      "Explore attorneys who represent families in fatal accident and wrongful-death matters.",
    path: "/el-paso-wrongful-death-lawyers",
  },
];

const faqs = [
  {
    question: "How do I find a personal injury lawyer in El Paso?",
    answer:
      "Start by comparing attorneys who regularly handle the type of accident or injury involved in your case. Review the lawyer's practice focus, experience, consultation process, fee agreement, and whether the firm appears equipped to handle the investigation and insurance issues your claim may require.",
  },
  {
    question: "How much does a personal injury lawyer cost in El Paso?",
    answer:
      "Many personal injury attorneys use contingency-fee agreements, meaning the attorney's fee is generally tied to a recovery rather than an upfront hourly charge. Terms and case expenses vary by firm, so review the written fee agreement carefully before hiring an attorney.",
  },
  {
    question: "What types of cases do El Paso personal injury attorneys handle?",
    answer:
      "Personal injury practices may handle car accidents, truck crashes, motorcycle accidents, pedestrian and bicycle injuries, slip-and-fall incidents, dog bites, serious injuries, wrongful death, and disputes with insurance companies. Individual firms may focus on only some of these matters.",
  },
  {
    question: "How long do I have to file a personal injury claim in Texas?",
    answer:
      "Texas law imposes deadlines on injury claims, and the applicable deadline can depend on the facts, the defendant, and the type of claim. Some matters can involve shorter notice requirements or special rules, so speaking with a qualified Texas attorney promptly can help identify the deadline that applies to a particular case.",
  },
  {
    question: "What should I bring to a personal injury consultation?",
    answer:
      "Useful materials can include accident reports, photographs, medical records and bills, insurance information, witness details, correspondence with insurers, proof of lost income, and a timeline of what happened. An attorney can tell you what additional evidence may be important.",
  },
  {
    question: "What should I look for when comparing personal injury attorneys?",
    answer:
      "Consider whether the attorney handles your type of case, how the firm communicates with clients, who will work on the matter, how fees and expenses are structured, and what experience the firm has with negotiations and litigation. The right fit depends on the facts and needs of your case.",
  },
];

export default function PersonalInjury() {
  useEffect(() => {
    const title =
      "Best Personal Injury Lawyers in El Paso, TX | El Paso's Best Lawyers";
    const description =
      "Compare personal injury lawyers in El Paso, Texas for car accidents, truck crashes, slip and falls, dog bites, serious injuries, wrongful death, and insurance disputes.";

    document.title = title;

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    const setProperty = (property: string, content: string) => {
      let tag = document.querySelector(
        `meta[property="${property}"]`
      ) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    setMeta("description", description);
    setMeta(
      "keywords",
      "El Paso personal injury lawyer, personal injury attorney El Paso, personal injury lawyers El Paso TX, injury lawyer El Paso, car accident lawyer El Paso, truck accident lawyer El Paso"
    );
    setMeta("robots", "index, follow");
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:type", "website");

    const canonicalUrl =
      "https://elpasosbestlawyers.com/el-paso-personal-injury-lawyers";
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: title,
          description,
          isPartOf: {
            "@type": "WebSite",
            name: "El Paso's Best Lawyers",
            url: "https://elpasosbestlawyers.com/",
          },
          about: {
            "@type": "Thing",
            name: "Personal Injury Lawyers in El Paso, Texas",
          },
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
              name: "Personal Injury Lawyers",
              item: canonicalUrl,
            },
          ],
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
    };

    let script = document.getElementById(
      "personal-injury-seo-schema"
    ) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "personal-injury-seo-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);

    return () => {
      document.getElementById("personal-injury-seo-schema")?.remove();
    };
  }, []);

  const scrollToFirms = () => {
    document.getElementById("personal-injury-firms")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <nav className="mb-8 text-sm text-slate-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-amber-400">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Personal Injury Lawyers</span>
          </nav>

          <div className="max-w-4xl">
            <p className="mb-4 font-semibold uppercase tracking-[0.18em] text-amber-400">
              El Paso, Texas Attorney Directory
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-amber-400 md:text-6xl">
              Best Personal Injury Lawyers in El Paso, TX
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
              Compare El Paso personal injury lawyers for car accidents, truck
              crashes, motorcycle wrecks, slip and falls, dog bites, serious
              injuries, wrongful death, and insurance disputes. Explore local
              legal resources and find attorneys who handle the type of injury
              claim you are facing.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                onClick={scrollToFirms}
                className="rounded-xl bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
              >
                Compare Personal Injury Lawyers
              </button>
              <Link
                to="/"
                className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-white transition hover:border-amber-400 hover:text-amber-400"
              >
                Browse All Practice Areas
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_.65fr]">
          <article>
            <h2 className="text-3xl font-bold text-white">
              El Paso Personal Injury Attorneys
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              An unexpected injury can create medical bills, time away from
              work, insurance questions, and uncertainty about who is
              responsible. Personal injury law generally addresses situations
              in which a person claims to have been harmed because of another
              person or company's negligence or wrongful conduct.
            </p>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              El Paso personal injury attorneys may investigate how an accident
              occurred, preserve evidence, communicate with insurance
              companies, document damages, evaluate potential defendants, and
              advise clients about settlement or litigation. The specific work
              required depends on the facts of each case.
            </p>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              El Paso's Best Lawyers is a local attorney directory. We help
              people compare lawyers by practice area; we are not a law firm
              and do not provide legal advice.
            </p>
          </article>

          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
            <h2 className="text-xl font-bold text-amber-400">
              Common reasons people search for an injury lawyer
            </h2>
            <ul className="mt-5 space-y-3 text-slate-300">
              <li>• Serious injuries after a vehicle crash</li>
              <li>• Disputes over fault or insurance coverage</li>
              <li>• Medical bills and lost income after an accident</li>
              <li>• Injuries caused by unsafe property conditions</li>
              <li>• Dog attacks and bite injuries</li>
              <li>• Fatal accidents involving a family member</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-3xl">
            <p className="font-semibold uppercase tracking-[0.16em] text-amber-400">
              Injury & Accident Practice Areas
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Find an El Paso lawyer for your type of injury case
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Personal injury is a broad practice area. These focused pages can
              help you compare attorneys for a specific type of accident or
              claim.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {caseTypes.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:-translate-y-1 hover:border-amber-400"
              >
                <h3 className="text-xl font-bold text-amber-400">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">
                  {item.description}
                </p>
                <span className="mt-5 inline-block font-semibold text-white">
                  Compare lawyers →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">
          What can a personal injury lawyer help with?
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 p-7">
            <h3 className="text-xl font-bold text-amber-400">
              Investigating the accident
            </h3>
            <p className="mt-3 leading-7 text-slate-300">
              Depending on the case, an attorney may review reports,
              photographs, witness information, medical records, video,
              insurance documents, vehicle evidence, property conditions, or
              other materials relevant to responsibility.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 p-7">
            <h3 className="text-xl font-bold text-amber-400">
              Identifying responsible parties
            </h3>
            <p className="mt-3 leading-7 text-slate-300">
              Some claims involve more than one potentially responsible party,
              such as drivers, employers, property owners, contractors, product
              manufacturers, or commercial businesses.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 p-7">
            <h3 className="text-xl font-bold text-amber-400">
              Documenting losses
            </h3>
            <p className="mt-3 leading-7 text-slate-300">
              Injury claims can involve medical expenses, lost earnings,
              property damage, future care, pain, impairment, and other
              claimed losses depending on the facts and applicable law.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 p-7">
            <h3 className="text-xl font-bold text-amber-400">
              Dealing with insurance companies
            </h3>
            <p className="mt-3 leading-7 text-slate-300">
              Attorneys may communicate with insurers, analyze available
              coverage, respond to disputed liability, evaluate settlement
              offers, and advise clients about litigation when a dispute
              cannot be resolved.
            </p>
          </div>
        </div>
      </section>

      <section
        id="personal-injury-firms"
        className="border-y border-slate-800 bg-slate-900/50"
      >
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="font-semibold uppercase tracking-[0.16em] text-amber-400">
            Local Directory
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            Featured El Paso Personal Injury Lawyers & Law Firms
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Compare participating El Paso firms that handle personal injury
            matters. Review each firm's profile, practice focus, attorneys, and
            contact information before deciding whom to contact.
          </p>

          <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
            <h3 className="text-xl font-bold text-white">
              Personal injury firm listings will appear here
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Law firms serving El Paso can claim or upgrade a listing to be
              considered for placement in the Personal Injury directory.
            </p>
            <Link
              to="/pricing"
              className="mt-6 inline-block rounded-xl bg-amber-400 px-6 py-3 font-bold text-slate-950 hover:bg-amber-300"
            >
              View Law Firm Listing Options
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">
          Frequently Asked Questions About Personal Injury Lawyers in El Paso
        </h2>
        <div className="mt-8 space-y-5">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="text-xl font-bold text-amber-400">
                {faq.question}
              </h3>
              <p className="mt-3 leading-7 text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="font-semibold uppercase tracking-[0.16em] text-amber-400">
                Connect With a Lawyer
              </p>
              <h2 className="mt-3 text-3xl font-bold">
                Looking for a personal injury attorney in El Paso?
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Tell us what type of legal help you are looking for. Your
                information can be used to help connect you with an appropriate
                participating attorney or firm.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 md:p-7">
              <LeadCaptureForm />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Related El Paso Legal Resources</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/el-paso-car-accident-lawyers"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-amber-400 hover:text-amber-400"
            >
              Car Accident Lawyers
            </Link>
            <Link
              to="/el-paso-truck-accident-lawyers"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-amber-400 hover:text-amber-400"
            >
              Truck Accident Lawyers
            </Link>
            <Link
              to="/el-paso-slip-and-fall-lawyers"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-amber-400 hover:text-amber-400"
            >
              Slip and Fall Lawyers
            </Link>
            <Link
              to="/el-paso-dog-bite-lawyers"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-amber-400 hover:text-amber-400"
            >
              Dog Bite Lawyers
            </Link>
            <Link
              to="/el-paso-wrongful-death-lawyers"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-amber-400 hover:text-amber-400"
            >
              Wrongful Death Lawyers
            </Link>
          </div>
        </div>

        <p className="mt-8 text-sm leading-6 text-slate-500">
          El Paso's Best Lawyers is an attorney directory and is not a law
          firm. Information on this page is general and is not legal advice.
          Attorney listings and directory placement do not guarantee any
          particular result.
        </p>
      </section>
    </main>
  );
}
