import { useEffect } from "react";

import LeadCaptureForm from "../components/LeadCaptureForm";
import PracticeAreaFirmDirectory from "../components/PracticeAreaFirmDirectory";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const relatedPages = [
  ["DWI / DUI", "/el-paso-dwi-lawyers"],
  ["Drug Crimes", "/el-paso-drug-crimes-lawyers"],
  ["Felony Defense", "/el-paso-felony-lawyers"],
  ["Theft", "/el-paso-theft-lawyers"],
  ["Assault", "/el-paso-assault-lawyers"],
  ["Domestic Violence", "/el-paso-domestic-violence-lawyers"],
  ["Expunction", "/el-paso-expunction-lawyers"],
  ["Civil Litigation", "/el-paso-civil-litigation-lawyers"],
];

const faqs = [
  {
    q: "How do I choose a criminal defense lawyer in El Paso?",
    a: "Compare experience with the type of charge involved, courtroom and trial experience, familiarity with local procedures, communication, fee structure, and whether the attorney regularly handles cases at the misdemeanor, felony, state, or federal level relevant to your matter.",
  },
  {
    q: "When should I contact a criminal defense attorney?",
    a: "Prompt legal advice can be important after an arrest, investigation, search, citation, indictment, bond issue, or request for questioning. Early review may help identify deadlines, preserve evidence, and address conditions of release or other immediate concerns.",
  },
  {
    q: "Can a criminal lawyer help before charges are filed?",
    a: "Sometimes. If a person knows they are under investigation or expects charges, counsel may be able to review the situation, communicate with investigators or prosecutors when appropriate, advise on interviews, and help preserve relevant evidence.",
  },
  {
    q: "What is the difference between a misdemeanor and a felony in Texas?",
    a: "Texas classifies criminal offenses at different levels, with felonies generally carrying more serious potential penalties than misdemeanors. The exact classification and sentencing range depend on the charged offense and circumstances.",
  },
  {
    q: "Can a criminal record be cleared in Texas?",
    a: "Some records may qualify for expunction or an order of nondisclosure, while others may not. Eligibility depends on the charge, disposition, prior history, waiting periods, and other statutory requirements.",
  },
  {
    q: "What should I bring to a criminal-defense consultation?",
    a: "Bring charging papers, bond documents, court notices, police reports if available, photos or videos, witness information, relevant messages, prior case information, and a written timeline of important events.",
  },
  {
    q: "Can criminal charges affect immigration status?",
    a: "Potentially. Certain arrests, pleas, convictions, or dispositions can create immigration consequences. When immigration status is involved, criminal-defense and immigration issues may need to be evaluated together.",
  },
  {
    q: "Do criminal cases have deadlines?",
    a: "Yes. Court dates, filing deadlines, discovery issues, bond conditions, preservation requests, appeal periods, and other time-sensitive requirements can arise throughout a criminal case.",
  },
];

const criminalDefenseDirectoryPage = {
  path: "/el-paso-criminal-defense-lawyers",
  shortTitle: "Criminal Defense",
  title: "Best Criminal Defense Lawyers in El Paso, TX",
  description:
    "Compare El Paso criminal defense law firms handling DWI, drug charges, assault, domestic violence, theft, felonies, misdemeanors, federal matters, and other criminal cases.",
  metaDescription:
    "Compare criminal defense lawyers in El Paso, Texas for DWI, drug charges, assault, theft, felonies, misdemeanors, and other criminal cases.",
  heroText:
    "Compare El Paso criminal defense attorneys and law firms by practice focus, firm information, and contact details.",
  topics: [
    "DWI / DUI",
    "Drug Crimes",
    "Felony Defense",
    "Assault",
    "Domestic Violence",
    "Theft",
    "Federal Criminal Defense",
  ],
  overview: [],
  whenToHire: [],
  localContent: [],
} as PracticeAreaPageData;

export default function CriminalDefense() {
  useEffect(() => {
    const title =
      "Best Criminal Defense Lawyers in El Paso, TX | El Paso's Best Lawyers";

    const description =
      "Compare criminal defense lawyers in El Paso, Texas for DWI, drug charges, assault, domestic violence, theft, felonies, misdemeanors, federal cases, and other criminal matters.";

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
    setMeta("robots", "index, follow");

    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:type", "website");

    const canonicalUrl =
      "https://elpasosbestlawyers.com/el-paso-criminal-defense-lawyers";

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
            name: "Criminal Defense Lawyers in El Paso, Texas",
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
              name: "Criminal Defense Lawyers",
              item: canonicalUrl,
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
    };

    let script = document.getElementById(
      "criminal-defense-seo-schema"
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = "criminal-defense-seo-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.text = JSON.stringify(schema);

    return () => {
      document.getElementById("criminal-defense-seo-schema")?.remove();
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
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <section
          style={{
            marginBottom: "48px",
          }}
        >
          <p
            style={{
              color: "#fbbf24",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "12px",
            }}
          >
            El Paso Criminal Defense Lawyer Directory
          </p>

          <h1
            style={{
              color: "#fbbf24",
              fontSize: "56px",
              marginBottom: "24px",
              lineHeight: 1.1,
            }}
          >
            Best Criminal Defense Lawyers in El Paso, TX
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
            Compare El Paso criminal defense lawyers and attorneys handling
            DWI and DUI charges, drug crimes, assault, domestic violence,
            theft, felonies, misdemeanors, probation issues, expunctions,
            and other criminal cases.
          </p>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "17px",
              lineHeight: 1.75,
              maxWidth: "930px",
            }}
          >
            If you are searching for a criminal attorney in El Paso, use
            this directory to compare participating local firms, review
            related practice areas, and learn what information may matter
            at the beginning of a criminal case. The right attorney may
            depend on the specific charge, whether the matter is pending in
            state or federal court, and the lawyer&apos;s experience with the
            procedures and consequences involved.
          </p>
        </section>

        <section
          style={{
            marginBottom: "52px",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              marginBottom: "14px",
            }}
          >
            Criminal Cases Handled by El Paso Defense Attorneys
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              "DWI / DUI",
              "Drug Possession & Distribution",
              "Assault Charges",
              "Domestic Violence",
              "Theft & Property Crimes",
              "Felony Charges",
              "Misdemeanor Charges",
              "Probation Violations",
              "Weapons Charges",
              "Expunctions",
              "Orders of Nondisclosure",
              "Federal Criminal Cases",
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
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
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
            <h2
              style={{
                marginBottom: "14px",
                fontSize: "26px",
              }}
            >
              How to Compare Criminal Defense Attorneys
            </h2>

            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>Experience with the specific charge involved</li>
              <li>Trial, motion, and negotiation experience</li>
              <li>Familiarity with El Paso courts and procedures</li>
              <li>Communication and availability</li>
              <li>Clear explanation of fees and representation scope</li>
              <li>
                Experience with collateral issues such as immigration
              </li>
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
            <h2
              style={{
                marginBottom: "14px",
                fontSize: "26px",
              }}
            >
              What a Criminal Defense Lawyer Can Help With
            </h2>

            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>
                Reviewing the arrest, charge, and available evidence
              </li>
              <li>
                Evaluating searches, statements, and constitutional issues
              </li>
              <li>Addressing bond and release conditions</li>
              <li>Obtaining and reviewing discovery</li>
              <li>
                Negotiating with prosecutors when appropriate
              </li>
              <li>
                Preparing motions, hearings, trial, or appeal issues
              </li>
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
          <h2
            style={{
              marginBottom: "14px",
              fontSize: "30px",
            }}
          >
            Criminal Defense in El Paso
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.75,
              marginBottom: "16px",
            }}
          >
            Criminal cases in El Paso may involve municipal courts, El
            Paso County courts, district courts, state agencies, or the
            federal court system depending on the charge and
            circumstances. Cases may begin with a traffic stop, arrest,
            warrant, investigation, indictment, or other law-enforcement
            action.
          </p>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.75,
              marginBottom: "16px",
            }}
          >
            El Paso&apos;s border location can also create additional
            issues in some criminal cases, including federal
            investigations, immigration consequences, cross-border
            evidence, or charges involving ports of entry, controlled
            substances, firearms, or interstate activity.
          </p>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            An El Paso criminal defense attorney can review the
            allegations, police reports, body-camera or dash-camera
            video, witness accounts, search and seizure issues,
            statements, forensic evidence, prior record, court
            documents, and other information that may affect the defense
            strategy.
          </p>
        </section>
      </div>

      {/* LIVE CRIMINAL DEFENSE DIRECTORY */}
      <PracticeAreaFirmDirectory
        page={criminalDefenseDirectoryPage}
      />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <section
          style={{
            marginTop: "52px",
            marginBottom: "52px",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              marginBottom: "18px",
            }}
          >
            Explore Criminal Defense Practice Areas
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
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

        <section
          style={{
            marginBottom: "52px",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              marginBottom: "20px",
            }}
          >
            Frequently Asked Questions
          </h2>

          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
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

                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
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
          <h2
            style={{
              marginTop: 0,
              marginBottom: "12px",
              fontSize: "28px",
            }}
          >
            Connect With an El Paso Criminal Defense Lawyer
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            Use the form below to submit your information and connect with
            a participating law firm.
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