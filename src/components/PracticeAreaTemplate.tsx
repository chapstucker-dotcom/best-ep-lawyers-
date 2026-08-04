import React from "react";

type PracticeAreaPage = {
  title: string;
  description: string;
  topics: string[];
};

type Props = {
  page: PracticeAreaPage;
};

export default function PracticeAreaTemplate({ page }: Props) {
  document.title = page.title;

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
        <h1
          style={{
            fontSize: "52px",
            color: "#fbbf24",
            marginBottom: "20px",
          }}
        >
          {page.title}
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#cbd5e1",
            lineHeight: 1.8,
          }}
        >
          {page.description}
        </p>

        <section
          style={{
            background: "#111827",
            padding: "32px",
            borderRadius: "18px",
            border: "1px solid #1e293b",
            marginTop: "40px",
          }}
        >
          <h2 style={{ color: "#fbbf24" }}>Common Legal Topics</h2>

          <ul
            style={{
              color: "#cbd5e1",
              lineHeight: 2,
              marginTop: "20px",
            }}
          >
            {page.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </section>

        <section
          style={{
            background: "#111827",
            padding: "32px",
            borderRadius: "18px",
            border: "1px solid #1e293b",
            marginTop: "40px",
          }}
        >
          <h2 style={{ color: "#fbbf24", marginBottom: "25px" }}>
            Frequently Asked Questions
          </h2>

          <div style={{ marginBottom: "28px" }}>
            <h3 style={{ color: "white" }}>
              How do I choose the right lawyer in El Paso?
            </h3>

            <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
              Compare attorney experience, reviews, communication style, fees,
              and whether the firm regularly handles cases like yours.
            </p>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <h3 style={{ color: "white" }}>
              Do most lawyers offer free consultations?
            </h3>

            <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
              Many El Paso law firms provide free consultations depending on the
              practice area.
            </p>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <h3 style={{ color: "white" }}>
              How much does an attorney cost?
            </h3>

            <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
              Fees vary by practice area and may be hourly, flat-fee, or
              contingency based.
            </p>
          </div>

          <div>
            <h3 style={{ color: "white" }}>
              Can I contact multiple law firms?
            </h3>

            <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
              Yes. Comparing several firms helps you choose the attorney who is
              the best fit for your legal matter.
            </p>
          </div>
        </section>

        <section
          style={{
            background: "#111827",
            padding: "32px",
            borderRadius: "18px",
            border: "1px solid #1e293b",
            marginTop: "40px",
          }}
        >
          <h2 style={{ color: "#fbbf24" }}>Featured Placement Available</h2>

          <p style={{ color: "#cbd5e1" }}>
            Law firms can claim Featured or Exclusive placement for this
            practice area.
          </p>

          <a
            href="/pricing"
            style={{
              display: "inline-block",
              marginTop: "20px",
              background: "#fbbf24",
              color: "#0f172a",
              padding: "14px 24px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Claim This Page
          </a>
        </section>

        <div style={{ marginTop: "50px" }}>
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
        </div>
      </div>
    </main>
  );
}