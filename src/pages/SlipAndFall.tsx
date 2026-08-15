import { useEffect } from "react";
import LeadCaptureForm from "../components/LeadCaptureForm";

const faqs = [
  {
    q: "What is a slip and fall case?",
    a: "A slip and fall case is a type of premises-liability claim involving an injury caused by a condition on property. Whether a claim exists depends on facts such as the condition, notice, the visitor's status, warnings, causation, and damages.",
  },
  {
    q: "What should I do after a slip and fall accident in El Paso?",
    a: "Consider reporting the incident, getting appropriate medical attention, identifying witnesses, preserving shoes and clothing, taking photographs or video when possible, and keeping records related to the incident and resulting losses.",
  },
  {
    q: "What evidence can matter in a slip and fall claim?",
    a: "Potential evidence can include photographs, surveillance video, incident reports, witness statements, maintenance and inspection records, prior complaints, medical records, receipts, and documentation showing when the dangerous condition existed.",
  },
  {
    q: "Can surveillance video be important after a fall?",
    a: "Yes. Video may show the condition of the property, how the fall happened, employee activity, inspections, warnings, or how long a condition existed. Some recordings may be overwritten, so preservation can become time-sensitive.",
  },
  {
    q: "Who may be responsible for a dangerous property condition?",
    a: "Depending on the circumstances, potentially responsible parties can include property owners, occupiers, businesses, landlords, management companies, contractors, or others responsible for the area or condition involved.",
  },
  {
    q: "What if the property owner says I should have seen the hazard?",
    a: "Visibility of the condition and the injured person's actions can be disputed issues. Texas law can consider comparative responsibility, so the specific facts and available evidence matter.",
  },
  {
    q: "How long do I have to pursue a slip and fall claim in Texas?",
    a: "Legal deadlines can apply to injury claims, and special notice requirements or shorter deadlines may apply in some circumstances. A lawyer can evaluate which deadlines apply to a particular incident.",
  },
  {
    q: "How do I compare slip and fall lawyers in El Paso?",
    a: "Consider experience with Texas premises-liability cases, investigation practices, litigation and trial experience, communication, fee structure, and the attorney's approach to evidence such as surveillance footage, maintenance records, and expert testimony.",
  },
];

export default function SlipAndFall() {
  useEffect(() => {
    const oldTitle = document.title;
    document.title =
      "Best Slip and Fall Lawyers in El Paso, TX | Compare Attorneys";

    const existingMeta = document.querySelector('meta[name="description"]');
    const oldDescription = existingMeta?.getAttribute("content") ?? null;
    const meta =
      existingMeta ?? document.head.appendChild(document.createElement("meta"));

    meta.setAttribute("name", "description");
    meta.setAttribute(
      "content",
      "Compare slip and fall lawyers in El Paso, TX handling premises liability claims involving stores, businesses, apartments, unsafe walkways, wet floors, and other dangerous property conditions."
    );

    return () => {
      document.title = oldTitle;
      if (existingMeta && oldDescription !== null) {
        existingMeta.setAttribute("content", oldDescription);
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
            El Paso Premises Liability Directory
          </p>

          <h1
            style={{
              color: "#fbbf24",
              fontSize: "56px",
              marginBottom: "24px",
              lineHeight: 1.1,
            }}
          >
            Best Slip and Fall Lawyers in El Paso, TX
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "21px",
              lineHeight: 1.75,
              maxWidth: "930px",
              marginBottom: "18px",
            }}
          >
            Compare El Paso slip and fall lawyers and premises liability
            attorneys handling injuries involving wet floors, unsafe walkways,
            poorly maintained property, inadequate lighting, broken stairs,
            apartment hazards, stores, restaurants, and other dangerous
            conditions.
          </p>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "17px",
              lineHeight: 1.75,
              maxWidth: "930px",
            }}
          >
            A serious fall can lead to medical expenses, lost income, pain,
            mobility problems, and disputes over who was responsible for the
            property. This directory helps consumers compare participating El
            Paso law firms and learn about common issues in Texas slip and fall
            claims.
          </p>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "18px" }}>
            Common Slip and Fall and Premises Liability Cases
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              "Wet or Slippery Floors",
              "Uneven Sidewalks & Walkways",
              "Broken Stairs & Handrails",
              "Poor Lighting",
              "Store & Retail Accidents",
              "Restaurant Falls",
              "Apartment & Rental Property Hazards",
              "Parking Lot Accidents",
              "Construction & Property Defects",
              "Falling Merchandise",
              "Unmarked Hazards",
              "Negligent Property Maintenance",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "#111827",
                  border: "1px solid #1e293b",
                  borderRadius: "14px",
                  padding: "18px",
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
            <h2 style={{ fontSize: "27px", marginTop: 0, marginBottom: "14px" }}>
              Evidence That May Matter After a Fall
            </h2>
            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>Photos and video of the dangerous condition</li>
              <li>Surveillance-camera recordings</li>
              <li>Incident and accident reports</li>
              <li>Witness names and statements</li>
              <li>Inspection and maintenance records</li>
              <li>Prior complaints or similar incidents</li>
              <li>Medical records and bills</li>
              <li>Documentation of lost income and other losses</li>
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
            <h2 style={{ fontSize: "27px", marginTop: 0, marginBottom: "14px" }}>
              How a Slip and Fall Attorney May Help
            </h2>
            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>Investigate the property and circumstances</li>
              <li>Identify potentially responsible parties</li>
              <li>Request preservation of relevant evidence</li>
              <li>Review maintenance and inspection practices</li>
              <li>Evaluate insurance coverage and claims</li>
              <li>Document injuries and claimed damages</li>
              <li>Negotiate or litigate when appropriate</li>
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
          <h2 style={{ fontSize: "30px", marginTop: 0, marginBottom: "14px" }}>
            Slip and Fall Claims in El Paso, Texas
          </h2>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: "16px" }}>
            Slip and fall claims are generally evaluated under Texas
            premises-liability law. The analysis can depend on why the injured
            person was on the property, what condition caused the incident,
            whether the responsible party knew or should have known about the
            condition, whether a warning was provided, and whether the
            condition caused the claimed injuries.
          </p>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: "16px" }}>
            Falls can occur at grocery stores, shopping centers, restaurants,
            hotels, workplaces, apartment complexes, parking lots, sidewalks,
            private residences, and other properties throughout El Paso. The
            identity of the owner, tenant, management company, contractor, or
            other responsible party can affect how a claim is investigated.
          </p>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, margin: 0 }}>
            Evidence can disappear quickly. Spills may be cleaned, defects may
            be repaired, witnesses can become difficult to locate, and
            surveillance systems may overwrite recordings. Preserving
            information about the scene can therefore be an important early
            issue after a serious fall.
          </p>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "18px" }}>
            Injuries Associated With Serious Falls
          </h2>
          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.75,
              maxWidth: "930px",
              marginBottom: "18px",
            }}
          >
            Falls can cause injuries ranging from bruises and sprains to
            fractures and other significant trauma. Depending on the
            circumstances, a claim may involve treatment costs, rehabilitation,
            lost wages, reduced earning capacity, pain, impairment, and other
            alleged damages.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            {[
              "Broken Bones",
              "Hip Injuries",
              "Head Injuries",
              "Back Injuries",
              "Neck Injuries",
              "Knee Injuries",
              "Shoulder Injuries",
              "Soft-Tissue Injuries",
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding: "16px",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#e2e8f0",
                }}
              >
                {item}
              </div>
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
            Connect With an El Paso Slip and Fall Lawyer
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

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
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

          <a
            href="/el-paso-personal-injury-lawyers"
            style={{
              display: "inline-block",
              border: "1px solid #fbbf24",
              color: "#fbbf24",
              padding: "15px 24px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Personal Injury Lawyers →
          </a>
        </div>
      </div>
    </main>
  );
}
