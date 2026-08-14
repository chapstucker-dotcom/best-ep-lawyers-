import { useEffect } from "react";

const practiceAreas = [
  ["Car Accident", "/el-paso-car-accident-lawyers"],
  ["Truck Accident", "/el-paso-truck-accident-lawyers"],
  ["18-Wheeler Accident", "/el-paso-18-wheeler-accident-lawyer"],
  ["Motorcycle Accident", "/el-paso-motorcycle-accident-lawyers"],
  ["Pedestrian Accident", "/el-paso-pedestrian-accident-lawyers"],
  ["Bicycle Accident", "/el-paso-bicycle-accident-lawyers"],
  ["Uber / Lyft Accident", "/el-paso-uber-lyft-accident-lawyers"],
  ["Construction Accident", "/el-paso-construction-accident-lawyers"],
  ["Slip and Fall", "/el-paso-slip-and-fall-lawyers"],
  ["Dog Bite", "/el-paso-dog-bite-lawyers"],
  ["Brain Injury", "/el-paso-traumatic-brain-injury-lawyers"],
  ["Wrongful Death", "/el-paso-wrongful-death-lawyers"],
];

const faqs = [
  {
    q: "How do I choose the best personal injury lawyer in El Paso?",
    a: "Compare experience with your type of injury claim, communication, trial and negotiation experience, fee structure, local knowledge, and whether the attorney regularly handles cases involving serious injuries, disputed liability, or complex insurance issues.",
  },
  {
    q: "What types of cases do personal injury attorneys handle?",
    a: "Personal injury attorneys may handle car and truck crashes, motorcycle accidents, pedestrian and bicycle collisions, rideshare crashes, construction accidents, premises liability, dog bites, catastrophic injuries, brain injuries, and wrongful death claims.",
  },
  {
    q: "How much does a personal injury lawyer cost?",
    a: "Many personal injury firms use contingency-fee arrangements, meaning attorney fees are tied to a recovery. Fee percentages, case expenses, and other terms vary by firm and should be reviewed before hiring counsel.",
  },
  {
    q: "What should I bring to a personal injury consultation?",
    a: "Helpful materials can include accident reports, photographs, medical records, bills, insurance information, correspondence, witness information, and a timeline of what happened and how the injury has affected your work and daily life.",
  },
  {
    q: "How long do personal injury cases take?",
    a: "Timing depends on the severity of the injuries, medical treatment, insurance disputes, investigation, negotiations, litigation, and court schedules. Some claims resolve relatively quickly while more complex cases can take much longer.",
  },
  {
    q: "What if the insurance company says I was partly at fault?",
    a: "Fault should be evaluated from the evidence. Police reports, photographs, video, witness statements, vehicle damage, expert analysis, and other records may affect how responsibility is allocated.",
  },
  {
    q: "What damages may be available in a personal injury claim?",
    a: "Depending on the facts and applicable law, damages may include medical expenses, lost income, reduced earning capacity, pain, physical impairment, property damage, and in some cases other legally recoverable losses.",
  },
  {
    q: "When should I contact an El Paso personal injury lawyer?",
    a: "Consider contacting counsel promptly after a serious injury, especially when fault is disputed, multiple parties may be involved, important evidence could disappear, or an insurer is requesting statements, releases, or broad medical authorizations.",
  },
];

export default function PersonalInjury() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Best Personal Injury Lawyers in El Paso, TX";

    const existingMeta = document.querySelector('meta[name="description"]');
    const previousContent = existingMeta?.getAttribute("content") ?? null;
    const meta =
      existingMeta ?? document.head.appendChild(document.createElement("meta"));

    meta.setAttribute("name", "description");
    meta.setAttribute(
      "content",
      "Compare personal injury lawyers in El Paso, TX for car accidents, trucking crashes, motorcycle accidents, construction injuries, wrongful death, and serious injury claims."
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
            El Paso Personal Injury Directory
          </p>

          <h1
            style={{
              fontSize: "48px",
              lineHeight: 1.1,
              color: "#fbbf24",
              marginBottom: "20px",
            }}
          >
            Best Personal Injury Lawyers in El Paso, TX
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#cbd5e1",
              lineHeight: 1.7,
              marginBottom: "20px",
              maxWidth: "950px",
            }}
          >
            Compare personal injury lawyers and attorneys serving El Paso, Texas.
            Browse local firms handling car accidents, 18-wheeler crashes,
            motorcycle collisions, construction injuries, premises liability,
            catastrophic injuries, brain injuries, and wrongful death claims.
          </p>

          <p
            style={{
              fontSize: "17px",
              color: "#94a3b8",
              lineHeight: 1.7,
              maxWidth: "950px",
            }}
          >
            El Paso&apos;s Best Lawyers is designed to help consumers compare
            local legal options by practice area, explore attorney profiles, and
            connect with firms that handle the type of injury claim they are
            facing.
          </p>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "12px", color: "white" }}>
            Explore Personal Injury Lawyers by Case Type
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.7,
              marginBottom: "24px",
              maxWidth: "900px",
            }}
          >
            Different injury claims involve different evidence, insurance
            issues, deadlines, and legal strategies. Start with the practice
            area that best matches your situation.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {practiceAreas.map(([label, href]) => (
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
                  lineHeight: 1.4,
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
              How to Compare El Paso Personal Injury Attorneys
            </h2>
            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>Experience with your specific type of injury claim</li>
              <li>Communication and responsiveness</li>
              <li>Negotiation and litigation experience</li>
              <li>Contingency-fee and case-expense terms</li>
              <li>Knowledge of serious-injury and insurance issues</li>
              <li>Ability to explain strategy, timing, and next steps clearly</li>
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
              What a Personal Injury Lawyer Can Help With
            </h2>
            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>Investigating fault and preserving evidence</li>
              <li>Reviewing insurance coverage and communications</li>
              <li>Documenting medical treatment and financial losses</li>
              <li>Identifying responsible people or companies</li>
              <li>Negotiating with insurers and opposing parties</li>
              <li>Filing and litigating claims when necessary</li>
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
            Personal Injury Cases in El Paso
          </h2>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: "16px" }}>
            Injury cases in El Paso can involve Interstate 10, Loop 375, U.S. 54,
            busy surface streets, commercial trucking traffic, construction
            projects, workplaces, apartment complexes, businesses, and other
            locations throughout El Paso County.
          </p>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: "16px" }}>
            Serious claims may involve multiple insurance policies, commercial
            carriers, employers, property owners, contractors, government
            entities, or other potentially responsible parties. Evidence can
            include photographs, video, police or incident reports, witness
            statements, medical records, employment records, electronic data,
            and insurance documents.
          </p>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, margin: 0 }}>
            Because evidence and deadlines can become important quickly,
            consumers should preserve records and compare qualified local
            attorneys as early as practical after a significant injury.
          </p>
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
            <h2 style={{ marginBottom: "10px" }}>Featured Firm Slot Available</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
              Personal injury firms can claim featured or exclusive category
              placement and receive stronger visibility within this practice
              area.
            </p>
          </div>

          <div
            style={{
              background: "#111827",
              padding: "28px",
              borderRadius: "16px",
              border: "1px solid #1e293b",
            }}
          >
            <h2 style={{ marginBottom: "10px" }}>Are You a Personal Injury Firm?</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
              Claim or upgrade your listing to add firm details, attorney
              profiles, lead-generation features, enhanced placement, and other
              premium visibility options.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: "48px" }}>
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
                    color: "#f8fafc",
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

        <p style={{ marginTop: "40px" }}>
          <a
            href="/"
            style={{
              color: "#fbbf24",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            ← Back to Home
          </a>
        </p>
      </div>
    </main>
  );
}
