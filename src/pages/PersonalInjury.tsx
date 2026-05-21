export default function PersonalInjury() {
  document.title = "Best Personal Injury Lawyers in El Paso, TX";

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
            fontSize: "48px",
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
            marginBottom: "40px",
          }}
        >
          Compare top-rated personal injury attorneys in El Paso, Texas.
          Browse local law firms, explore practice areas, and connect with
          lawyers handling car accidents, trucking accidents, wrongful death,
          workplace injuries, and catastrophic injury cases.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
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
            <h2 style={{ marginBottom: "10px" }}>
              Featured Firm Slot Available
            </h2>

            <p style={{ color: "#cbd5e1" }}>
              Personal injury firms can claim featured or exclusive category
              placement.
            </p>
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