type PracticeAreaProps = {
  title: string;
  description: string;
  topics: string[];
};

export default function PracticeArea({
  title,
  description,
  topics,
}: PracticeAreaProps) {
  document.title = title;

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
        <h1 style={{ fontSize: "52px", color: "#fbbf24" }}>{title}</h1>

        <p style={{ fontSize: "20px", color: "#cbd5e1", lineHeight: 1.7 }}>
          {description}
        </p>

        <section
          style={{
            background: "#111827",
            padding: "32px",
            borderRadius: "18px",
            border: "1px solid #1e293b",
            marginTop: "40px",
          }}
        ><section
  style={{
    background: "#111827",
    padding: "32px",
    borderRadius: "18px",
    border: "1px solid #1e293b",
    marginTop: "40px",
  }}
>
  <h2 style={{ color: "#fbbf24", marginBottom: "30px" }}>
    Frequently Asked Questions
  </h2>

  <div style={{ marginBottom: "28px" }}>
    <h3 style={{ color: "white", marginBottom: "10px" }}>
      How do I choose the right lawyer in El Paso?
    </h3>

    <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
      Compare attorney experience, reviews, case results, communication style,
      and whether the law firm regularly handles cases similar to yours.
    </p>
  </div>

  <div style={{ marginBottom: "28px" }}>
    <h3 style={{ color: "white", marginBottom: "10px" }}>
      Do most lawyers offer free consultations?
    </h3>

    <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
      Many El Paso law firms offer free consultations, especially for personal
      injury, criminal defense, and immigration matters.
    </p>
  </div>

  <div style={{ marginBottom: "28px" }}>
    <h3 style={{ color: "white", marginBottom: "10px" }}>
      How much does an attorney cost in Texas?
    </h3>

    <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
      Legal fees vary depending on the practice area, complexity of the case,
      and whether billing is hourly, flat-fee, or contingency based.
    </p>
  </div>

  <div>
    <h3 style={{ color: "white", marginBottom: "10px" }}>
      Can I contact multiple law firms before hiring one?
    </h3>

    <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
      Yes. Comparing multiple firms can help you better understand your legal
      options and determine which attorney is the best fit.
    </p>
  </div>
</section>
          <h2 style={{ color: "#fbbf24" }}>Common Legal Topics</h2>

          <ul style={{ color: "#cbd5e1", lineHeight: 2 }}>
            {topics.map((topic) => (
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
          <h2 style={{ color: "#fbbf24" }}>Featured Placement Available</h2>

          <p style={{ color: "#cbd5e1" }}>
            Law firms can claim featured or exclusive placement on this page.
          </p>

          <a
            href="/#lead-form"
            style={{
              display: "inline-block",
              marginTop: "20px",
              background: "#fbbf24",
              color: "#0f172a",
              padding: "14px 24px",
              borderRadius: "12px",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Claim This Page
          </a>
        </section>

        <p style={{ marginTop: "40px" }}>
          <a
            href="/"
            style={{
              color: "#fbbf24",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            ← Back to Home
          </a>
        </p>
      </div>
    </main>
  );
}