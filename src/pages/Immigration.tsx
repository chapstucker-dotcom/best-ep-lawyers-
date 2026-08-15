import { useEffect } from "react";
import LeadCaptureForm from "../components/LeadCaptureForm";

const relatedPages = [
  ["Green Card", "/el-paso-green-card-lawyers"],
  ["Citizenship", "/el-paso-citizenship-lawyers"],
  ["Visa", "/el-paso-visa-lawyers"],
  ["Deportation Defense", "/el-paso-deportation-defense-lawyers"],
  ["Business Immigration", "/el-paso-business-immigration-lawyers"],
  ["Family Law", "/el-paso-family-lawyers"],
];

const faqs = [
  {
    q: "How do I choose an immigration lawyer in El Paso?",
    a: "Compare experience with the type of immigration matter you have, communication, language access, responsiveness, fee structure, and whether the attorney regularly handles cases involving USCIS, consular processing, removal proceedings, waivers, or other issues relevant to your situation.",
  },
  {
    q: "Can an immigration lawyer help with a green card?",
    a: "Immigration attorneys may help evaluate eligibility for lawful permanent residence, prepare petitions and applications, organize supporting evidence, respond to government requests, and address issues involving adjustment of status or consular processing.",
  },
  {
    q: "Can an immigration attorney help with deportation or removal proceedings?",
    a: "Yes. Depending on the circumstances, an immigration lawyer may review the charging documents, immigration history, potential defenses or forms of relief, deadlines, hearing requirements, and related criminal or family issues.",
  },
  {
    q: "What is the difference between adjustment of status and consular processing?",
    a: "Adjustment of status generally refers to certain eligible applicants seeking permanent residence from inside the United States. Consular processing generally involves completing immigrant-visa processing through a U.S. embassy or consulate outside the United States.",
  },
  {
    q: "Can a criminal record affect an immigration case?",
    a: "It can. Arrests, charges, convictions, pleas, and other criminal history may affect admissibility, eligibility, status, naturalization, detention, or removal issues. The immigration consequences depend on the specific record and circumstances.",
  },
  {
    q: "Can an immigration lawyer help with citizenship?",
    a: "Immigration attorneys may assist with naturalization, citizenship through parents, certificates of citizenship, interview preparation, requests for evidence, and issues involving travel, taxes, criminal history, or prior immigration filings.",
  },
  {
    q: "Do immigration cases have deadlines?",
    a: "Yes. Immigration matters can involve filing deadlines, hearing dates, response deadlines, expiration dates, appeal periods, and other time-sensitive requirements. The applicable deadline depends on the case.",
  },
  {
    q: "Can I find a Spanish-speaking immigration lawyer in El Paso?",
    a: "Many El Paso immigration firms serve Spanish-speaking clients. When comparing attorneys, ask whether consultations, documents, case updates, and staff support are available in Spanish if that is important to you.",
  },
];

export default function Immigration() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Best Immigration Lawyers in El Paso, TX | Compare Attorneys";

    const existingMeta = document.querySelector('meta[name="description"]');
    const previousContent = existingMeta?.getAttribute("content") ?? null;
    const meta =
      existingMeta ?? document.head.appendChild(document.createElement("meta"));

    meta.setAttribute("name", "description");
    meta.setAttribute(
      "content",
      "Compare immigration lawyers in El Paso, TX for green cards, citizenship, visas, deportation defense, family immigration, waivers, and consular processing."
    );

    return () => {
      document.title = previousTitle;
      if (existingMeta && previousContent !== null) {
        existingMeta.setAttribute("content", previousContent);
      } else if (!existingMeta) {
        meta.remove();
      }
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
            El Paso Immigration Lawyer Directory
          </p>

          <h1
            style={{
              color: "#fbbf24",
              fontSize: "56px",
              marginBottom: "24px",
              lineHeight: 1.1,
            }}
          >
            Best Immigration Lawyers in El Paso, TX
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
            Compare El Paso immigration lawyers and attorneys helping families,
            individuals, workers, employers, and businesses with green cards,
            citizenship, visas, deportation defense, waivers, consular
            processing, and other U.S. immigration matters.
          </p>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "17px",
              lineHeight: 1.75,
              maxWidth: "930px",
            }}
          >
            El Paso's location on the U.S.-Mexico border makes immigration law
            especially important to local families and businesses. Use this
            directory to explore common immigration practice areas and compare
            participating local firms.
          </p>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "14px" }}>
            Immigration Matters Handled by El Paso Attorneys
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              "Green Cards",
              "Family Immigration",
              "Citizenship & Naturalization",
              "Deportation / Removal Defense",
              "Visas",
              "Consular Processing",
              "Adjustment of Status",
              "Immigration Waivers",
              "Marriage-Based Immigration",
              "Business Immigration",
              "Employment-Based Immigration",
              "Requests for Evidence",
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
              How to Compare Immigration Lawyers
            </h2>
            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>Experience with your type of immigration matter</li>
              <li>USCIS, consular, or immigration-court experience</li>
              <li>Communication and responsiveness</li>
              <li>English / Spanish language support when needed</li>
              <li>Clear explanation of fees and case scope</li>
              <li>Experience with complicated immigration histories</li>
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
              What an Immigration Attorney Can Help With
            </h2>
            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>Reviewing immigration history and eligibility</li>
              <li>Preparing petitions, applications, and evidence</li>
              <li>Responding to requests for evidence or notices</li>
              <li>Preparing for interviews and hearings</li>
              <li>Evaluating waivers and possible relief</li>
              <li>Coordinating cross-border and consular matters</li>
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
            Immigration Law in El Paso
          </h2>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: "16px" }}>
            El Paso immigration matters often involve families, employers, and
            individuals with close ties to Ciudad Juárez, Chihuahua, New Mexico,
            and communities throughout Mexico and the border region. Cases may
            involve USCIS filings, U.S. consular processing, ports of entry,
            immigration-court proceedings, travel history, prior entries, or
            family relationships spanning both countries.
          </p>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: "16px" }}>
            Fort Bliss also makes military-related immigration and citizenship
            issues especially relevant in the region. Service members, veterans,
            spouses, and family members may encounter immigration questions
            involving naturalization, family petitions, travel, documentation,
            and status.
          </p>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, margin: 0 }}>
            An El Paso immigration attorney can review immigration history,
            family relationships, prior applications, travel, criminal history,
            government notices, and supporting documents to help determine which
            process or options may apply.
          </p>
        </section>

        <section
          lang="es"
          style={{
            background: "#111827",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #1e293b",
            marginBottom: "52px",
          }}
        >
          <p
            style={{
              color: "#fbbf24",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "10px",
            }}
          >
            Recursos en Español
          </p>

          <h2 style={{ marginBottom: "14px", fontSize: "30px" }}>
            ¿Busca un abogado de inmigración en El Paso?
          </h2>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: "14px" }}>
            Compare abogados de inmigración en El Paso que atienden asuntos de
            residencia permanente, ciudadanía, visas, inmigración familiar,
            defensa contra deportación, perdones migratorios y procesos
            consulares.
          </p>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, margin: 0 }}>
            Si prefiere comunicarse en español, pregunte a cada despacho sobre
            consultas, personal bilingüe, actualizaciones del caso y documentos
            disponibles en español.
          </p>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "18px" }}>
            Explore Immigration Practice Areas
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
            Connect With an El Paso Immigration Lawyer
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
