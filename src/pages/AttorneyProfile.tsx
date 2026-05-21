
type AttorneyProfileProps = {
  firm: string;
  title: string;
  phone: string;
  website: string;
  rating: string;
  reviews: string;
  description: string;
  services: string[];
};

export default function AttorneyProfile({
  firm,
  title,
  phone,
  website,
  rating,
  reviews,
  description,
  services,
}: AttorneyProfileProps) {
  document.title = `${firm} | El Paso's Best Lawyers`;

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
        <div
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: "18px",
            padding: "40px",
            marginBottom: "40px",
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
            FEATURED LAW FIRM
          </div>

          <h1
            style={{
              fontSize: "52px",
              color: "#fbbf24",
              marginBottom: "10px",
            }}
          >
            {firm}
          </h1>

          <p
            style={{
              fontSize: "22px",
              color: "#cbd5e1",
              marginBottom: "20px",
            }}
          >
            {title}
          </p>

          <p
            style={{
              color: "#fbbf24",
              fontWeight: "bold",
              marginBottom: "24px",
              fontSize: "20px",
            }}
          >
            ⭐ {rating} • {reviews}
          </p>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.8,
              fontSize: "18px",
              marginBottom: "30px",
            }}
          >
            {description}
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <a
              href={`tel:${phone}`}
              style={{
                background: "#fbbf24",
                color: "#0f172a",
                padding: "16px 24px",
                borderRadius: "12px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Call {phone}
            </a>

            <a
              href={website}
              target="_blank"
              style={{
                border: "1px solid #fbbf24",
                color: "#fbbf24",
                padding: "16px 24px",
                borderRadius: "12px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Visit Website
            </a>
          </div>
        </div>

        <section
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: "18px",
            padding: "40px",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              color: "#fbbf24",
              marginBottom: "24px",
            }}
          >
            Legal Services
          </h2>

          <ul
            style={{
              color: "#cbd5e1",
              lineHeight: 2,
              fontSize: "18px",
            }}
          >
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </section>

        <section
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: "18px",
            padding: "40px",
          }}
        >
          <h2
            style={{
              color: "#fbbf24",
              marginBottom: "24px",
            }}
          >
            Why Clients Choose {firm}
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.8,
              fontSize: "18px",
            }}
          >
            Clients often compare communication, experience, responsiveness,
            case results, and local reputation when selecting an attorney in El Paso.
          </p>
        </section>

        <p
          style={{
            marginTop: "40px",
          }}
        >
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