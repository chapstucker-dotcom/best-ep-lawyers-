import { useEffect } from "react";
import { Link } from "react-router-dom";
import PracticeAreaFirmDirectory from "../components/PracticeAreaFirmDirectory";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const cases = [
  "Dooring Accidents",
  "Intersection Collisions",
  "Distracted Driving",
  "Failure to Yield",
  "Unsafe Passing",
  "Hit-and-Run Accidents",
  "Commercial Vehicle Collisions",
  "Road Hazard Accidents",
  "Serious Head Injuries",
  "Spinal Cord Injuries",
  "Broken Bones",
  "Wrongful Death Claims",
];

const faqs = [
  {
    question: "What should I do after a bicycle accident in El Paso?",
    answer:
      "Get medical attention, preserve photographs and witness information, and keep records related to treatment, lost work, and damaged property. An attorney can evaluate the facts and explain possible claims.",
  },
  {
    question: "Can a bicyclist recover compensation after being hit by a car in Texas?",
    answer:
      "Depending on the facts, an injured bicyclist may have claims involving medical expenses, lost income, pain and other damages. Fault, insurance coverage, available evidence, and Texas law can affect a claim.",
  },
  {
    question: "What if the driver says the bicycle rider caused the crash?",
    answer:
      "Disputed fault does not necessarily end a claim. Crash reports, photographs, video, witness accounts, vehicle damage, roadway conditions, and other records may help determine responsibility.",
  },
  {
    question: "How do I compare El Paso bicycle accident lawyers?",
    answer:
      "Consider experience with bicycle and personal injury cases, disputed-liability claims, communication practices, fee arrangements, and serious injury matters.",
  },
];

const bicycleDirectoryPage: PracticeAreaPageData = {
  path: "/el-paso-bicycle-accident-lawyers",
  shortTitle: "Bicycle Accident",
  title: "Best Bicycle Accident Lawyers in El Paso, TX",
  description:
    "Compare El Paso bicycle accident lawyers handling cyclist injuries, vehicle collisions, hit-and-run crashes, disputed fault, serious injuries, and wrongful death claims.",
  metaDescription:
    "Compare El Paso bicycle accident lawyers and attorneys handling cyclist injuries, vehicle collisions, hit-and-runs, serious injuries, and wrongful death claims.",
  heroText:
    "Compare El Paso bicycle accident lawyers handling cyclist injuries, vehicle collisions, hit-and-run crashes, disputed fault, serious injuries, and wrongful death claims.",
  topics: cases,
  overview: [
    "Bicycle riders have little physical protection when a collision involves a car, pickup, commercial vehicle, or other motor vehicle. Bicycle accident claims can involve serious injuries, damaged property, insurance disputes, lost income, and disputed responsibility.",
    "Important evidence may include crash reports, scene photographs, witness statements, traffic-camera or business video, vehicle damage, bicycle damage, medical records, insurance correspondence, and records documenting lost work.",
    "When fault is disputed, roadway conditions, traffic controls, visibility, vehicle movements, witness accounts, and available video may help determine how the collision occurred.",
  ],
  whenToHire: [
    "You suffered a serious head injury, spinal injury, broken bone, or another injury requiring substantial medical treatment.",
    "The driver or insurer disputes fault or claims the bicycle rider caused or contributed to the collision.",
    "The crash involved a hit-and-run driver, commercial vehicle, dangerous roadway condition, or multiple potentially responsible parties.",
    "Video, witness information, photographs, or other evidence may need to be preserved quickly.",
    "You lost income, face continuing medical care, or may have permanent impairment.",
    "A family member died in a bicycle collision.",
  ],
  localContent: [
    "Bicycle riders in El Paso share city streets and major corridors with cars, pickups, commercial vehicles, and other traffic. Collisions can occur at intersections, driveways, parking areas, construction zones, and along roads where drivers and cyclists must safely share limited space.",
    "Bicycle crashes may involve failure to yield, unsafe passing, distracted driving, dooring incidents, hit-and-run collisions, roadway hazards, or disputes about visibility and right of way.",
    "The location of the crash, investigating agency, roadway conditions, available video, witness information, insurance coverage, and severity of the injuries can affect how a bicycle accident claim is evaluated.",
  ],
  faqs,
  relatedPages: [
    { label: "Personal Injury", path: "/el-paso-personal-injury-lawyers" },
    { label: "Car Accident", path: "/el-paso-car-accident-lawyers" },
    { label: "Truck Accident", path: "/el-paso-truck-accident-lawyers" },
    { label: "Motorcycle Accident", path: "/el-paso-motorcycle-accident-lawyers" },
    { label: "Wrongful Death", path: "/el-paso-wrongful-death-lawyers" },
  ],
  lastUpdated: "August 30, 2026",
};

export default function BicycleAccident() {
  useEffect(() => {
    const title =
      "Best Bicycle Accident Lawyers in El Paso, TX | El Paso's Best Lawyers";
    const description =
      "Compare El Paso bicycle accident lawyers and attorneys handling cyclist injuries, vehicle collisions, hit-and-runs, serious injuries, and wrongful death claims.";
    const canonical =
      "https://www.elpasosbestlawyers.com/el-paso-bicycle-accident-lawyers";

    const previousTitle = document.title;
    document.title = title;

    const upsertMeta = (name: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(
        `meta[name="${name}"]`
      );

      if (!tag) {
        tag = document.createElement("meta");
        tag.name = name;
        document.head.appendChild(tag);
      }

      tag.content = content;
    };

    const upsertProperty = (property: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(
        `meta[property="${property}"]`
      );

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }

      tag.content = content;
    };

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

    const schemaId = "bicycle-accident-seo-schema";
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
              item: "https://www.elpasosbestlawyers.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Personal Injury",
              item:
                "https://www.elpasosbestlawyers.com/el-paso-personal-injury-lawyers",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Bicycle Accident Lawyers",
              item: canonical,
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
    });

    document.head.appendChild(schema);

    return () => {
      document.title = previousTitle;
      document.getElementById(schemaId)?.remove();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1529] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-amber-400">
          El Paso Bicycle Accident Lawyer Directory
        </p>

        <h1 className="max-w-5xl text-4xl font-medium leading-tight text-amber-400 md:text-6xl">
          Best Bicycle Accident Lawyers in El Paso, TX
        </h1>

        <p className="mt-7 max-w-5xl text-xl leading-8 text-slate-100">
          Compare El Paso bicycle accident lawyers and attorneys handling cyclist
          injuries, vehicle collisions, hit-and-run crashes, disputed fault,
          serious injuries, and wrongful death claims.
        </p>

        <p className="mt-5 max-w-5xl leading-7 text-slate-300">
          If you were injured while riding a bicycle in El Paso, this directory
          can help you understand common bicycle accident issues and compare
          participating local attorneys.
        </p>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">
            Compare El Paso Bicycle Accident Law Firms
          </h2>
          <p className="mt-4 max-w-5xl leading-7 text-slate-300">
            Review participating El Paso firms that identify bicycle accidents or
            related personal injury matters as areas of practice.
          </p>
          <div className="mt-8">
            <PracticeAreaFirmDirectory page={bicycleDirectoryPage} />
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">
            Common El Paso Bicycle Accident Cases
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cases.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-5 py-5 font-semibold"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-7">
            <h2 className="text-2xl font-medium">
              How to Compare Bicycle Accident Attorneys
            </h2>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-slate-200">
              <li>Experience with bicycle and motor-vehicle injury claims</li>
              <li>Handling disputed fault and insurance issues</li>
              <li>Experience with serious and catastrophic injuries</li>
              <li>Ability to preserve video, witness, and crash evidence</li>
              <li>Clear explanation of fees and communication practices</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-7">
            <h2 className="text-2xl font-medium">
              What a Bicycle Accident Lawyer Can Help With
            </h2>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-slate-200">
              <li>Investigating how the collision happened</li>
              <li>Identifying potentially responsible parties</li>
              <li>Reviewing insurance coverage and liability disputes</li>
              <li>Documenting injuries, expenses, and lost income</li>
              <li>Evaluating settlement and litigation options</li>
            </ul>
          </article>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Bicycle Accidents in El Paso</h2>
          <div className="mt-5 max-w-5xl space-y-5 leading-7 text-slate-300">
            <p>
              Bicycle riders share El Paso streets with cars, pickups,
              commercial vehicles, and other traffic. Collisions can occur when
              a driver turns across a cyclist&apos;s path, opens a vehicle door,
              fails to yield, passes unsafely, or does not notice a rider at an
              intersection.
            </p>
            <p>
              Because cyclists have little physical protection, crashes can
              cause significant injuries. Claims may involve medical treatment,
              rehabilitation, lost work, damaged property, insurance disputes,
              and questions about responsibility.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-xl border border-slate-700/70 bg-slate-900/45 p-6"
              >
                <h3 className="text-xl font-semibold text-amber-400">
                  {faq.question}
                </h3>
                <p className="mt-3 leading-7 text-slate-300">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-amber-400/30 bg-slate-900/60 p-8">
          <h2 className="text-3xl font-medium">
            Related El Paso Injury Lawyer Directories
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/el-paso-personal-injury-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Personal Injury Lawyers
            </Link>
            <Link
              to="/el-paso-car-accident-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Car Accident Lawyers
            </Link>
            <Link
              to="/el-paso-truck-accident-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Truck Accident Lawyers
            </Link>
            <Link
              to="/el-paso-motorcycle-accident-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Motorcycle Accident Lawyers
            </Link>
            <Link
              to="/el-paso-wrongful-death-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Wrongful Death Lawyers
            </Link>
          </div>
        </section>

        <section className="mt-14 border-t border-slate-700 pt-8 text-sm leading-6 text-slate-400">
          El Paso&apos;s Best Lawyers is a lawyer directory and informational
          resource. It is not a law firm and does not provide legal advice.
        </section>
      </section>
    </main>
  );
}
