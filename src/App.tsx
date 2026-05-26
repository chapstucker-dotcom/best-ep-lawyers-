
import { firms } from "./data/firms";
import CarAccidentLawyers from "./pages/CarAccidentLawyers";
import AttorneyProfile from "./pages/AttorneyProfile";

import AdminDashboard from "./pages/AdminDashboard";



const featuredFirms = firms;

export default function App() {
  const path = window.location.pathname;

  // SEO PAGE ROUTE
  if (path === "/el-paso-car-accident-lawyers") {
    return <CarAccidentLawyers />;
  }

  // ATTORNEY PROFILE ROUTES
  if (path === "/attorneys/johnson-injury-lawyers") {
    return (
      <AttorneyProfile
        firm="Johnson Injury Lawyers"
        title="El Paso Personal Injury Attorneys"
        phone="9155551000"
        website="https://example.com"
        rating="5.0"
        reviews="214 Reviews"
        description="Johnson Injury Lawyers helps clients throughout El Paso with car accidents, truck accidents, catastrophic injury claims, wrongful death litigation, and insurance disputes."
        services={[
          "Car accident claims",
          "Truck accident litigation",
          "Wrongful death",
          "Insurance disputes",
          "Catastrophic injuries",
        ]}
      />
    );
  }

  if (path === "/attorneys/el-paso-family-law-group") {
    return (
      <AttorneyProfile
        firm="El Paso Family Law Group"
        title="El Paso Divorce & Family Law Attorneys"
        phone="9155552000"
        website="https://example.com"
        rating="4.9"
        reviews="132 Reviews"
        description="El Paso Family Law Group assists clients with divorce, child custody, child support, adoption, mediation, and complex family disputes throughout El Paso County."
        services={[
          "Divorce representation",
          "Child custody",
          "Child support",
          "Adoption",
          "Family mediation",
        ]}
      />
    );
  }

  if (path === "/attorneys/border-defense-criminal-lawyers") {
    return (
      <AttorneyProfile
        firm="Border Defense Criminal Lawyers"
        title="El Paso Criminal Defense Attorneys"
        phone="9155553000"
        website="https://example.com"
        rating="4.8"
        reviews="189 Reviews"
        description="Border Defense Criminal Lawyers represents clients facing DWI charges, drug offenses, felony accusations, and federal criminal matters in El Paso, Texas."
        services={[
          "DWI defense",
          "Drug offenses",
          "Felony defense",
          "Federal criminal defense",
          "Bond hearings",
        ]}
      />
    );
  }
if (path === "/admin") {
  return <AdminDashboard />;
}
  // HOMEPAGE
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "80px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#fbbf24",
            fontSize: "64px",
            marginBottom: "20px",
          }}
        >
          Featured Law Firms
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {featuredFirms.map((firm) => (
            <div
              key={firm.name}
              style={{
                background: "#111827",
                border: "1px solid #1e293b",
                borderRadius: "18px",
                padding: "28px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: "#fbbf24",
                  color: "#0f172a",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  fontWeight: "bold",
                  marginBottom: "18px",
                }}
              >
                {firm.badge}
              </div>

              <h2
                style={{
                  marginBottom: "12px",
                }}
              >
                {firm.name}
              </h2>

              <p
                style={{
                  color: "#fbbf24",
                  marginBottom: "12px",
                  fontWeight: "bold",
                }}
              >
                ⭐ {firm.rating} • {firm.reviews}
              </p>

              <p
                style={{
                  color: "#cbd5e1",
                  marginBottom: "12px",
                }}
              >
                {firm.area}
              </p>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.7,
                  marginBottom: "20px",
                }}
              >
                {firm.description}
              </p>

              <p
                style={{
                  marginBottom: "20px",
                }}
              >
                {firm.phone}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href={firm.website}
                  target="_blank"
                  style={{
                    background: "#fbbf24",
                    color: "#0f172a",
                    padding: "14px 20px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Visit Website
                </a>

                <a
                  href={firm.profile}
                  style={{
                    border: "1px solid #fbbf24",
                    color: "#fbbf24",
                    padding: "14px 20px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  View Profile
                </a>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "80px",
            textAlign: "center",
          }}
        >
          <a
            href="/el-paso-car-accident-lawyers"
            style={{
              background: "#fbbf24",
              color: "#0f172a",
              padding: "18px 28px",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Explore Car Accident Lawyers →
          </a>
        </div>
      </div>
    </main>
  );
}