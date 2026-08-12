export default function TruckAccidentLawyers() {
  document.title = "Best Truck Accident Lawyers in El Paso, TX";

  const faqs = [
    {
      q: "What makes truck accident cases different from car accident cases?",
      a: "Truck accident cases can involve commercial carriers, federal and state trucking regulations, commercial insurance policies, driver records, vehicle maintenance records, electronic logging data, and multiple potentially responsible parties.",
    },
    {
      q: "Who may be responsible for an El Paso truck accident?",
      a: "Depending on the facts, potentially responsible parties may include the truck driver, trucking company, freight carrier, maintenance contractor, cargo company, or another business involved in the operation of the commercial vehicle.",
    },
    {
      q: "What evidence can be important after a commercial truck crash?",
      a: "Evidence may include police reports, photographs, witness statements, electronic logging information, driver qualification records, maintenance records, inspection records, dash-camera footage, electronic vehicle data, medical records, and insurance information.",
    },
    {
      q: "How much is a truck accident case worth?",
      a: "There is no standard value for a truck accident claim. Potential compensation depends on factors such as liability, the severity of the injuries, medical expenses, lost income, long-term impairment, available insurance coverage, and other damages.",
    },
    {
      q: "How long do I have to file a truck accident lawsuit in Texas?",
      a: "Texas generally applies a two-year limitations period to many personal injury claims, but exceptions and other deadlines may apply. A lawyer can evaluate the deadline that applies to a particular case.",
    },
  ];

  const caseTypes = [
    "18-Wheeler Accidents",
    "Semi-Truck Collisions",
    "Commercial Vehicle Crashes",
    "Driver Fatigue Cases",
    "Unsafe Lane Changes",
    "Rear-End Truck Collisions",
    "Jackknife Accidents",
    "Cargo and Load Accidents",
    "Truck Maintenance Failures",
    "Wrongful Death Claims",
  ];

  const relatedPages = [
    {
      label: "Personal Injury Lawyers",
      href: "/el-paso-personal-injury-lawyers",
    },
    {
      label: "Car Accident Lawyers",
      href: "/el-paso-car-accident-lawyers",
    },
    {
      label: "Motorcycle Accident Lawyers",
      href: "/el-paso-motorcycle-accident-lawyers",
    },
    {
      label: "Wrongful Death Lawyers",
      href: "/el-paso-wrongful-death-lawyers",
    },
  ];

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
          padding: "80px 24px",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#fbbf24",
              color: "#0f172a",
              padding: "8px 16px",
              borderRadius: "999px",
              fontWeight: "bold",
              marginBottom: "24px",
            }}
          >
            EL PASO TRUCK ACCIDENT LAWYERS
          </div>

          <h1
            style={{
              fontSize: "clamp(42px, 7vw, 64px)",
              color: "#fbbf24",
              marginBottom: "24px",
              lineHeight: 1.1,
            }}
          >
            Best Truck Accident Lawyers in El Paso, TX
          </h1>

          <p
            style={{
              fontSize: "22px",
              color: "#cbd5e1",
              lineHeight: 1.8,
              maxWidth: "900px",
            }}
          >
            Compare El Paso truck accident lawyers handling 18-wheeler
            collisions, commercial trucking crashes, catastrophic injuries,
            wrongful death claims, and commercial insurance disputes
            throughout El Paso County.
          </p>
        </div>
      </section>

      {/* FEATURED ATTORNEYS */}
      <section style={{ padding: "60px 24px" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "42px",
              color: "#fbbf24",
              marginBottom: "30px",
            }}
          >
            Featured Truck Accident Attorneys
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            <div
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
                CATEGORY EXCLUSIVE
              </div>

              <h3
                style={{
                  fontSize: "30px",
                  marginBottom: "12px",
                }}
              >
                Johnson Injury Lawyers
              </h3>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.8,
                  marginBottom: "24px",
                }}
              >
                Experienced trucking accident attorneys handling serious
                collisions involving 18-wheelers, commercial carriers, freight
                companies, and catastrophic highway accidents.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href="/attorneys/johnson-injury-lawyers"
                  style={{
                    background: "#fbbf24",
                    color: "#0f172a",
                    padding: "14px 20px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  View Profile
                </a>

                <a
                  href="tel:9155551000"
                  style={{
                    border: "1px solid #fbbf24",
                    color: "#fbbf24",
                    padding: "14px 20px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section style={{ padding: "40px 24px 80px" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "42px",
              color: "#fbbf24",
              marginBottom: "30px",
            }}
          >
            Truck Accident Cases in El Paso
          </h2>

          <div
            style={{
              color: "#cbd5e1",
              fontSize: "19px",
              lineHeight: 1.9,
            }}
          >
            <p style={{ marginBottom: "28px" }}>
              El Paso is a major commercial transportation corridor with
              significant truck traffic traveling Interstate 10, Loop 375,
              Zaragoza Road, and routes connecting Texas with New Mexico and
              international trade crossings. Collisions involving tractor
              trailers and other commercial vehicles can cause severe and
              life-changing injuries.
            </p>

            <p style={{ marginBottom: "28px" }}>
              Truck accident cases can be more complicated than ordinary
              passenger-vehicle collisions. An investigation may involve the
              truck driver, motor carrier, commercial insurer, maintenance
              contractors, freight companies, cargo companies, and other
              parties involved in operating or maintaining the vehicle.
            </p>

            <p style={{ marginBottom: "28px" }}>
              Important evidence can include electronic logging information,
              driver qualification records, inspection and maintenance records,
              photographs, video, witness statements, police reports,
              electronic vehicle data, medical records, and insurance
              information.
            </p>

            <p style={{ marginBottom: "28px" }}>
              People injured in serious commercial truck crashes may face
              hospitalization, surgery, rehabilitation, lost income, permanent
              impairment, and substantial future medical needs. Fatal trucking
              collisions may also result in wrongful death claims by eligible
              surviving family members.
            </p>
          </div>
        </div>
      </section>

      {/* CASE TYPES */}
      <section style={{ padding: "0 24px 80px" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "42px",
              color: "#fbbf24",
              marginBottom: "30px",
            }}
          >
            Common Types of Truck Accident Claims
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            {caseTypes.map((item) => (
              <div
                key={item}
                style={{
                  background: "#111827",
                  border: "1px solid #1e293b",
                  borderRadius: "14px",
                  padding: "20px",
                  color: "#e2e8f0",
                  fontWeight: "bold",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PAGES */}
      <section style={{ padding: "0 24px 80px" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "36px",
              color: "#fbbf24",
              marginBottom: "24px",
            }}
          >
            Related El Paso Injury Lawyer Guides
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            {relatedPages.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  border: "1px solid #fbbf24",
                  color: "#fbbf24",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "0 24px 80px" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "42px",
              color: "#fbbf24",
              marginBottom: "30px",
            }}
          >
            Frequently Asked Questions
          </h2>

          <div
            style={{
              display: "grid",
              gap: "20px",
            }}
          >
            {faqs.map((faq) => (
              <div
                key={faq.q}
                style={{
                  background: "#111827",
                  border: "1px solid #1e293b",
                  borderRadius: "18px",
                  padding: "28px",
                }}
              >
                <h3
                  style={{
                    color: "#fbbf24",
                    marginBottom: "14px",
                    fontSize: "24px",
                  }}
                >
                  {faq.q}
                </h3>

                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: 1.8,
                    fontSize: "18px",
                  }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "36px",
              fontSize: "14px",
            }}
          >
            Last updated: August 11, 2026
          </p>
        </div>
      </section>
    </main>
  );
}