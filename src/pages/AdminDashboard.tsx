export default function AdminDashboard() {
  document.title = "Admin Dashboard | El Paso's Best Lawyers";

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
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#fbbf24",
            fontSize: "56px",
            marginBottom: "20px",
          }}
        >
          Admin Dashboard
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "20px",
            marginBottom: "50px",
          }}
        >
          Manage legal leads, attorney listings, and featured placements.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
            marginBottom: "50px",
          }}
        >
          {[
            {
              title: "New Leads",
              value: "24",
            },
            {
              title: "Featured Firms",
              value: "6",
            },
            {
              title: "Exclusive Categories",
              value: "3",
            },
            {
              title: "Monthly Revenue",
              value: "$8,398",
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                background: "#111827",
                border: "1px solid #1e293b",
                borderRadius: "18px",
                padding: "30px",
              }}
            >
              <div
                style={{
                  color: "#cbd5e1",
                  marginBottom: "14px",
                  fontSize: "18px",
                }}
              >
                {card.title}
              </div>

              <div
                style={{
                  color: "#fbbf24",
                  fontSize: "42px",
                  fontWeight: "bold",
                }}
              >
                {card.value}
              </div>
            </div>
          ))}
        </div>

        <section
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: "18px",
            padding: "32px",
          }}
        >
          <h2
            style={{
              color: "#fbbf24",
              marginBottom: "24px",
            }}
          >
            Recent Lead Activity
          </h2>

          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {[
              {
                name: "John Smith",
                area: "Personal Injury",
                status: "New",
              },
              {
                name: "Maria Garcia",
                area: "Family Law",
                status: "Contacted",
              },
              {
                name: "David Johnson",
                area: "Immigration",
                status: "Pending",
              },
            ].map((lead) => (
              <div
                key={lead.name}
                style={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "14px",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "6px",
                    }}
                  >
                    {lead.name}
                  </div>

                  <div
                    style={{
                      color: "#cbd5e1",
                    }}
                  >
                    {lead.area}
                  </div>
                </div>

                <div
                  style={{
                    color: "#fbbf24",
                    fontWeight: "bold",
                  }}
                >
                  {lead.status}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}