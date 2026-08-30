import { useEffect } from "react";
import LeadCaptureForm from "../components/LeadCaptureForm";

const relatedPages = [
  ["Personal Injury", "/el-paso-personal-injury-lawyers"],
  ["Truck Accident", "/el-paso-truck-accident-lawyers"],
  ["18-Wheeler Accident", "/el-paso-18-wheeler-accident-lawyer"],
  ["Motorcycle Accident", "/el-paso-motorcycle-accident-lawyers"],
  ["Pedestrian Accident", "/el-paso-pedestrian-accident-lawyers"],
  ["Bicycle Accident", "/el-paso-bicycle-accident-lawyers"],
  ["Uber / Lyft Accident", "/el-paso-uber-lyft-accident-lawyers"],
  ["Wrongful Death", "/el-paso-wrongful-death-lawyers"],
];

const faqs = [
  {
    q: "How do I choose the best car accident lawyer in El Paso?",
    a: "Compare experience with motor-vehicle injury claims, disputed fault, serious injuries, insurance negotiations, litigation, communication, and fee terms. The right fit depends on the facts of the crash and the type of help you need.",
  },
  {
    q: "What should I do after a car accident in El Paso?",
    a: "Get appropriate medical attention, report the collision when required, preserve photographs and video, obtain witness information, keep insurance and repair records, and save medical bills, wage information, and other documents connected to the crash.",
  },
  {
    q: "What if the insurance company says I caused the crash?",
    a: "Fault should be evaluated from the available evidence. Police reports, photographs, video, witness statements, vehicle damage, roadway evidence, traffic signals, and other records may affect how responsibility is determined.",
  },
  {
    q: "Can I still have a claim if I was partly at fault?",
    a: "Potential recovery can depend on how responsibility is allocated under applicable Texas law. An attorney can review the evidence and explain how comparative responsibility may affect a particular claim.",
  },
  {
    q: "What damages may be available after a car accident?",
    a: "Depending on the facts and applicable law, damages may include medical expenses, lost income, reduced earning capacity, pain, physical impairment, property damage, and in fatal cases potentially wrongful-death or survival damages.",
  },
  {
    q: "What if the other driver does not have insurance?",
    a: "The available options depend on the facts and insurance coverage. Uninsured or underinsured motorist coverage, other applicable policies, and the responsible driver's assets may need to be evaluated.",
  },
  {
    q: "What evidence can help prove a car accident claim?",
    a: "Useful evidence may include crash reports, scene photographs, video, witness statements, medical records, repair estimates, vehicle data, phone records, roadway conditions, traffic-camera footage, and insurance documents.",
  },
  {
    q: "When should I contact a car accident attorney?",
    a: "Prompt legal review may be useful when injuries are serious, fault is disputed, multiple vehicles are involved, an insurer is requesting statements or releases, or important video and other evidence may need to be preserved.",
  },
];

export default function CarAccidentLawyers() {
  useEffect(() => {
    const title =
      "Best Car Accident Lawyers in El Paso, TX | El Paso's Best Lawyers";
    const description =
      "Compare car accident lawyers in El Paso, TX for injury claims, insurance disputes, hit-and-run crashes, uninsured motorists, serious injuries, and wrongful death.";
    const canonical =
      "https://www.elpasosbestlawyers.com/el-paso-car-accident-lawyers";

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

    const schemaId = "car-accident-seo-schema";
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
              name: "Car Accident Lawyers",
              item: canonical,
            },
          ],
        },
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
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
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "60px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <section style={{ marginBottom: "48px" }}>
          <p
            style={{
              color: "#fbbf24",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "12px",
            }}
          >
            El Paso Car Accident Lawyer Directory
          </p>

          <h1
            style={{
              color: "#fbbf24",
              fontSize: "56px",
              marginBottom: "24px",
              lineHeight: 1.1,
            }}
          >
            Best Car Accident Lawyers in El Paso, TX
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "21px",
              lineHeight: 1.75,
              marginBottom: "18px",
              maxWidth: "930px",
            }}
          >
            Compare El Paso car accident lawyers and attorneys handling injury
            claims, insurance disputes, hit-and-run crashes, uninsured motorists,
            serious collisions, and wrongful death cases.
          </p>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "17px",
              lineHeight: 1.75,
              maxWidth: "930px",
            }}
          >
            Whether you are searching for a car accident lawyer in El Paso,
            comparing local attorneys after a crash, or looking for help with a
            serious injury claim, this page is designed to help you understand
            your options and connect with participating firms.
          </p>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "14px" }}>
            Common El Paso Car Accident Cases
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              "Rear-End Collisions",
              "Intersection Crashes",
              "Left-Turn Accidents",
              "Distracted Driving",
              "Hit-and-Run Accidents",
              "Uninsured Motorists",
              "Rideshare Accidents",
              "Serious Injury Crashes",
              "Multi-Vehicle Accidents",
              "Wrongful Death Claims",
              "Commercial Vehicle Crashes",
              "Disputed Liability Claims",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "#111827",
                  border: "1px solid #1e293b",
                  borderRadius: "14px",
                  padding: "18px",
                  color: "#f8fafc",
                  fontWeight: 700,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            marginBottom: "52px",
          }}
        >
          <div
            style={{
              background: "#111827",
              padding: "28px",
              borderRadius: "16px",
              border: "1px solid #1e293b",
            }}
          >
            <h2 style={{ marginBottom: "14px", fontSize: "26px" }}>
              How to Compare Car Accident Attorneys
            </h2>
            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>Experience with car accident and injury claims</li>
              <li>Handling disputed fault and insurance issues</li>
              <li>Experience with serious and catastrophic injuries</li>
              <li>Negotiation and litigation background</li>
              <li>Communication and responsiveness</li>
              <li>Contingency-fee and case-expense terms</li>
            </ul>
          </div>

          <div
            style={{
              background: "#111827",
              padding: "28px",
              borderRadius: "16px",
              border: "1px solid #1e293b",
            }}
          >
            <h2 style={{ marginBottom: "14px", fontSize: "26px" }}>
              What a Car Accident Lawyer Can Help With
            </h2>
            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>Investigating how the collision happened</li>
              <li>Preserving video, witness, and vehicle evidence</li>
              <li>Reviewing insurance coverage and correspondence</li>
              <li>Documenting medical treatment and lost income</li>
              <li>Identifying potentially responsible parties</li>
              <li>Negotiating or litigating when necessary</li>
            </ul>
          </div>
        </section>

        <section
          style={{
            background: "#111827",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #1e293b",
            marginBottom: "52px",
          }}
        >
          <h2 style={{ marginBottom: "14px", fontSize: "30px" }}>
            Car Accidents in El Paso
          </h2>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: "16px" }}>
            El Paso car accidents can occur on Interstate 10, Loop 375, US 54,
            Montana Avenue, Mesa Street, Zaragoza Road, Alameda Avenue, Dyer
            Street, Downtown streets, neighborhood roads, and other busy routes
            throughout El Paso County.
          </p>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: "16px" }}>
            Local crashes may involve commuters, rideshare vehicles, commercial
            traffic, uninsured drivers, construction zones, high-speed roads,
            intersections, and drivers traveling between Texas and New Mexico.
            The exact location, traffic pattern, roadway design, and available
            video can become important evidence.
          </p>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, margin: 0 }}>
            An El Paso car accident attorney can evaluate the crash report,
            photographs, witness statements, medical records, insurance
            information, vehicle damage, available video, roadway evidence, and
            other records that may help establish fault and damages.
          </p>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "18px" }}>
            Explore Related Accident Lawyers
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {relatedPages.map(([label, href]) => (
              <a
                key={href}
                href={href}
                style={{
                  display: "block",
                  background: "#111827",
                  border: "1px solid #1e293b",
                  borderRadius: "14px",
                  padding: "18px",
                  color: "#f8fafc",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                {label} Lawyers
                <span
                  style={{
                    display: "block",
                    color: "#fbbf24",
                    fontSize: "14px",
                    marginTop: "8px",
                  }}
                >
                  Compare El Paso attorneys →
                </span>
              </a>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: "grid", gap: "16px" }}>
            {faqs.map((faq) => (
              <div
                key={faq.q}
                style={{
                  background: "#111827",
                  border: "1px solid #1e293b",
                  borderRadius: "14px",
                  padding: "22px",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "10px",
                    fontSize: "20px",
                  }}
                >
                  {faq.q}
                </h3>
                <p style={{ color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "28px",
            marginBottom: "40px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "12px", fontSize: "28px" }}>
            Connect With an El Paso Car Accident Lawyer
          </h2>
          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            Use the form below to submit your information and connect with a
            participating law firm.
          </p>
          <LeadCaptureForm />
        </section>

        <a
          href="/"
          style={{
            display: "inline-block",
            background: "#fbbf24",
            color: "#0f172a",
            padding: "16px 24px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Back Home
        </a>
      </div>
    </main>
  );
}
