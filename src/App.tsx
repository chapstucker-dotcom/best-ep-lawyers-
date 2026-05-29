import "./App.css";
import { useState } from "react";
import { firms } from "./data/firms";
import CarAccidentLawyers from "./pages/CarAccidentLawyers";

export default function App() {
  const path = window.location.pathname;
  const [search, setSearch] = useState("");

  if (path === "/el-paso-car-accident-lawyers") {
    return <CarAccidentLawyers />;
  }

  const categories = [
    "Personal Injury",
    "Car Accidents",
    "Truck Accidents",
    "Criminal Defense",
    "DWI",
    "Immigration",
    "Divorce",
    "Family Law",
  ];

  const filteredFirms = firms.filter((firm) =>
    `${firm.name} ${firm.category} ${firm.bio}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HERO */}
      <section
        style={{
          padding: "90px 24px 70px",
          textAlign: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#fbbf24",
            fontSize: "72px",
            lineHeight: 1.05,
            marginBottom: "24px",
          }}
        >
          El Paso’s Best Lawyers
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "24px",
            lineHeight: 1.7,
            maxWidth: "850px",
            margin: "0 auto 36px",
          }}
        >
          Find trusted El Paso attorneys for injury, criminal defense,
          immigration, divorce, DWI, trucking accidents, and more.
        </p>

        <input
          placeholder="Search by lawyer, firm, or practice area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "720px",
            padding: "20px 24px",
            borderRadius: "16px",
            border: "1px solid #334155",
            background: "#111827",
            color: "white",
            fontSize: "18px",
            marginBottom: "28px",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#firms"
            style={primaryButton}
          >
            Find a Lawyer
          </a>

          <a
            href="#pricing"
            style={outlineButton}
          >
            Claim Your Category
          </a>
        </div>
      </section>

      {/* PRACTICE AREAS */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <h2 style={sectionTitle}>Practice Areas</h2>

        <div style={grid}>
          {categories.map((cat) => (
            <a
              key={cat}
              href={
                cat === "Car Accidents"
                  ? "/el-paso-car-accident-lawyers"
                  : "#pricing"
              }
              style={card}
            >
              <h3 style={cardTitle}>{cat}</h3>
              <p style={cardText}>
                Compare El Paso attorneys and request a consultation.
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* FEATURED FIRMS */}
      <section
        id="firms"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px 90px",
        }}
      >
        <h2 style={sectionTitle}>Featured Law Firms</h2>

        <div style={grid}>
          {filteredFirms.map((firm) => (
            <div key={firm.name} style={card}>
              <div style={{ marginBottom: "20px" }}>
                {firm.exclusive && <span style={badge}>CATEGORY EXCLUSIVE</span>}
                {!firm.exclusive && firm.featured && (
                  <span style={badge}>FEATURED</span>
                )}
              </div>

              <h3 style={cardTitle}>{firm.name}</h3>

              <p style={{ color: "#fbbf24", fontWeight: "bold" }}>
                ⭐ {firm.rating} • {firm.reviews}
              </p>

              <p style={{ color: "#cbd5e1", fontWeight: "bold" }}>
                {firm.category}
              </p>

              <p style={cardText}>{firm.bio}</p>

              <p style={{ fontSize: "18px", marginTop: "20px" }}>
                {firm.phone}
              </p>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <a href={firm.website} target="_blank" style={primarySmall}>
                  Visit Website
                </a>

                <a href={firm.slug} style={outlineSmall}>
                  View Profile
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px 90px",
        }}
      >
        <h2 style={sectionTitle}>Advertise With Us</h2>

        <div style={grid}>
          {[
            {
              name: "Expert Listing",
              price: "$299/mo",
              text: "Enhanced profile, lead form, SEO visibility, and attorney listing.",
            },
            {
              name: "Category Featured",
              price: "$2,000/mo",
              text: "Premium placement, featured badge, homepage rotation, and priority leads.",
            },
            {
              name: "Category Exclusive",
              price: "$5,000/mo",
              text: "Own one legal category with top placement and competitor lockout.",
            },
          ].map((plan) => (
            <div key={plan.name} style={card}>
              <h3 style={cardTitle}>{plan.name}</h3>
              <div
                style={{
                  fontSize: "38px",
                  fontWeight: "bold",
                  margin: "20px 0",
                }}
              >
                {plan.price}
              </div>
              <p style={cardText}>{plan.text}</p>
              <a href="/el-paso-car-accident-lawyers" style={primarySmall}>
                Claim This Spot
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "#111827",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <h2 style={sectionTitle}>Only One Exclusive Firm Per Category</h2>
        <p
          style={{
            color: "#cbd5e1",
            fontSize: "22px",
            maxWidth: "850px",
            margin: "0 auto 32px",
            lineHeight: 1.7,
          }}
        >
          Secure premium visibility before your competitors do. Featured and
          Exclusive placements are limited by practice area.
        </p>

        <a href="#pricing" style={primaryButton}>
          View Placement Options
        </a>
      </section>

      <footer
        style={{
          padding: "40px 24px",
          textAlign: "center",
          color: "#94a3b8",
          borderTop: "1px solid #1e293b",
        }}
      >
        © 2026 El Paso’s Best Lawyers
      </footer>
    </main>
  );
}

const sectionTitle = {
  color: "#fbbf24",
  fontSize: "48px",
  marginBottom: "40px",
  textAlign: "center" as const,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "28px",
};

const card = {
  background: "#111827",
  border: "1px solid #1e293b",
  borderRadius: "22px",
  padding: "34px",
  color: "white",
  textDecoration: "none",
};

const cardTitle = {
  color: "#fbbf24",
  fontSize: "26px",
  marginBottom: "16px",
};

const cardText = {
  color: "#cbd5e1",
  lineHeight: 1.8,
  fontSize: "17px",
};

const badge = {
  background: "#fbbf24",
  color: "#0f172a",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: "bold",
  fontSize: "13px",
};

const primaryButton = {
  background: "#fbbf24",
  color: "#0f172a",
  padding: "18px 28px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "18px",
};

const outlineButton = {
  border: "2px solid #fbbf24",
  color: "#fbbf24",
  padding: "18px 28px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "18px",
};

const primarySmall = {
  background: "#fbbf24",
  color: "#0f172a",
  padding: "14px 18px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: "bold",
};

const outlineSmall = {
  border: "1px solid #fbbf24",
  color: "#fbbf24",
  padding: "14px 18px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: "bold",
};