import LeadCaptureForm from "../components/LeadCaptureForm";

export default function CarAccidentLawyers() {
  document.title = "Best Car Accident Lawyers in El Paso, TX";

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
        <h1
          style={{
            color: "#fbbf24",
            fontSize: "64px",
            marginBottom: "24px",
            lineHeight: 1.1,
          }}
        >
          Best Car Accident Lawyers in El Paso, TX
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "22px",
            lineHeight: 1.8,
            marginBottom: "40px",
            maxWidth: "900px",
          }}
        >
          Compare experienced El Paso car accident lawyers handling
          injury claims, trucking accidents, wrongful death lawsuits,
          and insurance disputes.
        </p>

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
            marginBottom: "60px",
          }}
        >
          ← Back Home
        </a>

        <LeadCaptureForm />
      </div>
    </main>
  );
}


