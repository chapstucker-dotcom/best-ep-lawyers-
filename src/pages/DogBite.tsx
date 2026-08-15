import { useEffect } from "react";
import LeadCaptureForm from "../components/LeadCaptureForm";

const faqs = [
  {
    q: "What should I do after a dog bite in El Paso?",
    a: "Consider getting appropriate medical care, documenting the injuries, identifying the dog and its owner, obtaining witness information, preserving photographs and clothing, and keeping records of treatment and expenses. Reporting requirements may also apply depending on the circumstances.",
  },
  {
    q: "Can a dog owner be responsible for a bite in Texas?",
    a: "Potential responsibility depends on the facts and the legal theory involved. Issues can include the owner's knowledge of dangerous behavior, negligence, leash or restraint rules, control of the animal, and the circumstances leading to the incident.",
  },
  {
    q: "What evidence can matter in a dog bite case?",
    a: "Evidence may include photographs, medical records, witness statements, animal-control records, prior incident reports, veterinary information, communications with the owner, property records, and available insurance information.",
  },
  {
    q: "What if the dog had never bitten anyone before?",
    a: "A prior bite can be relevant in some cases, but it is not necessarily the only issue. Other facts concerning the owner's conduct, restraint of the animal, warnings, local rules, and the circumstances of the attack may also matter.",
  },
  {
    q: "Can children bring claims for dog bite injuries?",
    a: "Children can suffer serious physical and emotional injuries in animal attacks. Claims involving minors can raise additional procedural and damages issues, so the specific circumstances should be evaluated carefully.",
  },
  {
    q: "What types of injuries can result from dog attacks?",
    a: "Dog attacks can cause puncture wounds, lacerations, infections, fractures, nerve damage, scarring, disfigurement, and psychological effects. The nature and severity of injuries vary significantly by incident.",
  },
  {
    q: "Does homeowners or renters insurance ever cover dog bite claims?",
    a: "Some homeowners, renters, or other liability policies may provide coverage, but exclusions and policy terms vary. Identifying potentially applicable coverage can be an important part of evaluating a claim.",
  },
  {
    q: "How do I compare dog bite lawyers in El Paso?",
    a: "Consider experience with Texas injury and animal-attack claims, investigation practices, insurance issues, litigation experience, communication, fee structure, and the lawyer's approach to documenting medical injuries and long-term effects.",
  },
];

export default function DogBite() {
  useEffect(() => {
    const oldTitle = document.title;
    document.title =
      "Best Dog Bite Lawyers in El Paso, TX | Compare Attorneys";

    const existingMeta = document.querySelector('meta[name="description"]');
    const oldDescription = existingMeta?.getAttribute("content") ?? null;
    const meta =
      existingMeta ?? document.head.appendChild(document.createElement("meta"));

    meta.setAttribute("name", "description");
    meta.setAttribute(
      "content",
      "Compare dog bite lawyers in El Paso, TX handling dog attacks, animal bites, scarring, child injuries, insurance claims, and other serious animal-related injuries."
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
            El Paso Dog Bite Lawyer Directory
          </p>

          <h1
            style={{
              color: "#fbbf24",
              fontSize: "56px",
              marginBottom: "24px",
              lineHeight: 1.1,
            }}
          >
            Best Dog Bite Lawyers in El Paso, TX
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
            Compare El Paso dog bite lawyers and personal injury attorneys
            handling dog attacks, animal bites, scarring, disfigurement,
            infections, child injuries, insurance claims, and other serious
            animal-related injuries.
          </p>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "17px",
              lineHeight: 1.75,
              maxWidth: "930px",
            }}
          >
            Dog attacks can create medical, financial, insurance, and legal
            issues. This directory helps consumers compare participating El
            Paso law firms and understand common questions that can arise after
            a dog bite or animal attack in Texas.
          </p>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "18px" }}>
            Dog Bite and Animal Attack Cases
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              "Dog Bite Injuries",
              "Child Dog Bite Injuries",
              "Facial Bites & Scarring",
              "Multiple-Dog Attacks",
              "Loose or Unrestrained Dogs",
              "Apartment Complex Incidents",
              "Neighborhood Dog Attacks",
              "Delivery Worker Injuries",
              "Infections After Animal Bites",
              "Nerve & Tissue Damage",
              "Insurance Disputes",
              "Serious & Permanent Injuries",
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
              Evidence That May Matter After a Dog Attack
            </h2>
            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>Photos of injuries and the location</li>
              <li>Medical and treatment records</li>
              <li>Witness names and statements</li>
              <li>Animal-control or incident records</li>
              <li>Information identifying the dog and owner</li>
              <li>Prior complaints or reported incidents</li>
              <li>Messages or communications concerning the dog</li>
              <li>Homeowners, renters, or liability insurance information</li>
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
              How a Dog Bite Attorney May Help
            </h2>
            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                paddingLeft: "20px",
                margin: 0,
              }}
            >
              <li>Investigate how and where the attack occurred</li>
              <li>Identify the animal's owner or other responsible parties</li>
              <li>Seek records concerning prior incidents when relevant</li>
              <li>Evaluate potentially applicable insurance coverage</li>
              <li>Document injuries, scarring, treatment, and losses</li>
              <li>Communicate with insurers and other parties</li>
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
            Dog Bite Claims in El Paso, Texas
          </h2>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: "16px" }}>
            Liability after a dog bite or animal attack can depend on the
            particular facts. Questions may include whether the owner knew of
            dangerous tendencies, whether the animal was properly controlled,
            whether applicable restraint rules were followed, where the attack
            occurred, and what actions were taken before the incident.
          </p>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: "16px" }}>
            Incidents can occur in neighborhoods, apartment complexes, parks,
            businesses, private residences, sidewalks, and other locations
            throughout El Paso. Determining who owned or controlled the dog and
            whether insurance coverage exists can be important parts of an
            investigation.
          </p>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, margin: 0 }}>
            Dog bite injuries can also change over time. Scarring, infection,
            nerve damage, follow-up procedures, and psychological effects may
            not be fully understood immediately after an attack. Medical
            documentation and photographs can help preserve information about
            the progression of an injury.
          </p>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "18px" }}>
            Injuries From Dog Bites and Animal Attacks
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            {[
              "Puncture Wounds",
              "Lacerations",
              "Facial Injuries",
              "Scarring",
              "Disfigurement",
              "Infections",
              "Nerve Damage",
              "Fractures",
              "Soft-Tissue Damage",
              "Psychological Trauma",
              "Surgical Injuries",
              "Permanent Impairment",
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
            Connect With an El Paso Dog Bite Lawyer
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
