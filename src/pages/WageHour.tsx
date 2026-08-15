import { useEffect } from "react";
import LeadCaptureForm from "../components/LeadCaptureForm";

const faqs = [
  {
    q: "What is a wage and hour dispute?",
    a: "A wage and hour dispute can involve unpaid wages, overtime, minimum wage, timekeeping, off-the-clock work, deductions, commissions, bonuses, or employee classification. The legal analysis depends on the facts, pay practices, records, agreements, and applicable law.",
  },
  {
    q: "When is overtime pay required?",
    a: "Whether overtime is required depends on the worker's classification, duties, pay method, hours worked, and the laws that apply. Some employees are exempt from overtime requirements, while others may be entitled to additional pay for qualifying hours worked.",
  },
  {
    q: "What records should I preserve in an overtime or pay dispute?",
    a: "Preserve paystubs, time records, schedules, emails, text messages, compensation plans, commission agreements, payroll records, policies, offer letters, job descriptions, and notes showing the hours worked and payments received.",
  },
  {
    q: "Can misclassification affect overtime rights?",
    a: "Yes. Disputes can arise over whether a worker was properly classified as exempt or nonexempt, or as an employee or independent contractor. Classification depends on the legal test that applies and the actual working relationship.",
  },
  {
    q: "Can unpaid commissions or bonuses be part of a pay dispute?",
    a: "Yes. Compensation disputes may involve commissions, bonuses, incentive pay, deductions, expense reimbursement, or other promised compensation. The terms of the agreement and applicable wage laws can be important.",
  },
  {
    q: "Can employers require off-the-clock work?",
    a: "Off-the-clock work can raise wage and hour issues when employees perform compensable work that is not recorded or paid. The facts, employer knowledge, timekeeping practices, and applicable law matter.",
  },
  {
    q: "Can retaliation follow a wage complaint?",
    a: "Retaliation can raise separate legal issues when adverse treatment follows certain protected wage complaints, reports, or participation in a protected process. Timing, documentation, and the employer's stated reason for the action can be important.",
  },
  {
    q: "Do wage and overtime claims have deadlines?",
    a: "Yes. Wage and hour disputes can involve statutes of limitation, administrative deadlines, contractual requirements, and other time limits. Prompt review can help identify which deadlines may apply.",
  },
];

export default function WageHour() {
  useEffect(() => {
    const oldTitle = document.title;
    document.title =
      "Best Wage & Hour Lawyers in El Paso, TX | Overtime & Pay Disputes";

    const existingMeta = document.querySelector('meta[name="description"]');
    const oldDescription = existingMeta?.getAttribute("content") ?? null;
    const meta =
      existingMeta ?? document.head.appendChild(document.createElement("meta"));

    meta.setAttribute("name", "description");
    meta.setAttribute(
      "content",
      "Compare wage and hour lawyers in El Paso, TX for unpaid overtime, unpaid wages, misclassification, commissions, bonuses, deductions, and other pay disputes."
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

  const card = {
    background: "#111827",
    border: "1px solid #1e293b",
    borderRadius: "14px",
    padding: "20px",
  };

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
            El Paso Employment Law Directory
          </p>

          <h1
            style={{
              color: "#fbbf24",
              fontSize: "56px",
              marginBottom: "24px",
              lineHeight: 1.1,
            }}
          >
            Best Wage & Hour Lawyers in El Paso, TX
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
            Compare El Paso wage and hour lawyers and employment attorneys
            handling unpaid overtime, unpaid wages, employee misclassification,
            commissions, bonuses, deductions, timekeeping disputes, and other
            compensation claims.
          </p>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "17px",
              lineHeight: 1.75,
              maxWidth: "930px",
            }}
          >
            Pay disputes often turn on time records, schedules, payroll data,
            compensation agreements, job duties, classification, and what work
            was actually performed. This page helps consumers compare
            participating El Paso law firms handling overtime and wage claims.
          </p>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "18px" }}>
            Overtime and Pay Disputes
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              "Unpaid Overtime",
              "Unpaid Wages",
              "Off-the-Clock Work",
              "Employee Misclassification",
              "Independent Contractor Disputes",
              "Commissions",
              "Bonuses & Incentive Pay",
              "Payroll Deductions",
              "Minimum Wage Claims",
              "Timekeeping Disputes",
              "Meal & Break Pay Issues",
              "Wage Complaint Retaliation",
            ].map((item) => (
              <div key={item} style={card}>
                <strong>{item}</strong>
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
          <div style={{ ...card, padding: "28px" }}>
            <h2 style={{ fontSize: "27px", marginTop: 0 }}>
              Evidence That May Matter
            </h2>
            <ul style={{ color: "#cbd5e1", lineHeight: 1.8, paddingLeft: "20px", marginBottom: 0 }}>
              <li>Paystubs and payroll records</li>
              <li>Timecards and timekeeping data</li>
              <li>Schedules and shift records</li>
              <li>Emails and text messages about work hours</li>
              <li>Compensation and commission agreements</li>
              <li>Job descriptions and duty records</li>
              <li>Policies concerning overtime and time reporting</li>
              <li>Notes showing hours worked and amounts paid</li>
            </ul>
          </div>

          <div style={{ ...card, padding: "28px" }}>
            <h2 style={{ fontSize: "27px", marginTop: 0 }}>
              How an Employment Attorney May Help
            </h2>
            <ul style={{ color: "#cbd5e1", lineHeight: 1.8, paddingLeft: "20px", marginBottom: 0 }}>
              <li>Review compensation practices and payroll records</li>
              <li>Evaluate overtime and classification issues</li>
              <li>Analyze commission, bonus, or deduction disputes</li>
              <li>Identify potentially applicable wage laws</li>
              <li>Help preserve relevant employment records</li>
              <li>Evaluate retaliation related to wage complaints</li>
              <li>Negotiate or litigate when appropriate</li>
            </ul>
          </div>
        </section>

        <section style={{ ...card, padding: "30px", marginBottom: "52px" }}>
          <h2 style={{ fontSize: "30px", marginTop: 0 }}>
            Wage and Hour Claims in El Paso
          </h2>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75 }}>
            Wage and hour disputes in El Paso can arise in restaurants,
            hospitality, healthcare, construction, logistics, transportation,
            retail, call centers, professional services, manufacturing,
            government contracting, and other workplaces throughout El Paso
            County.
          </p>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75 }}>
            A pay dispute may involve whether all hours worked were recorded,
            whether overtime was calculated correctly, whether a worker was
            properly classified, whether commissions or bonuses were paid under
            the applicable agreement, or whether deductions were authorized.
          </p>

          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: 0 }}>
            An El Paso overtime or wage lawyer can review payroll and time
            records, compensation agreements, schedules, job duties,
            communications, and other evidence to evaluate whether additional
            wages may be owed and what procedures may apply.
          </p>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "18px" }}>
            Related Employment Law Topics
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              ["Employment Law", "/el-paso-employment-lawyers"],
              ["Wrongful Termination", "/el-paso-wrongful-termination-lawyers"],
              ["Workplace Discrimination", "/el-paso-workplace-discrimination-lawyers"],
              ["Workplace Retaliation", "/el-paso-retaliation-lawyers"],
              ["Sexual Harassment", "/el-paso-sexual-harassment-lawyers"],
              ["Employment Contracts", "/el-paso-employment-contract-lawyers"],
              ["Severance Agreements", "/el-paso-severance-agreement-lawyers"],
            ].map(([label, path]) => (
              <a
                key={path}
                href={path}
                style={{
                  ...card,
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                {label}
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
              <div key={faq.q} style={card}>
                <h3 style={{ marginTop: 0, marginBottom: "10px" }}>{faq.q}</h3>
                <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: 0 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...card, padding: "28px", marginBottom: "40px" }}>
          <h2 style={{ marginTop: 0 }}>
            Connect With an El Paso Overtime & Pay Disputes Lawyer
          </h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
            Use the form below to submit your information and connect with a
            participating law firm.
          </p>
          <LeadCaptureForm />
        </section>

        <a
          href="/el-paso-employment-lawyers"
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
          ← Employment Law
        </a>
      </div>
    </main>
  );
}
