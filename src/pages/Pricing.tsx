# Full `src/pages/Pricing.tsx` Replacement

```tsx
export default function Pricing() {
  document.title = "Law Firm Pricing | El Paso's Best Lawyers";

  const plans = [
    {
      name: "Pro Listing",
      price: "$99/mo",
      description:
        "Enhanced law firm visibility with upgraded profile placement.",
      features: [
        "Firm name listing",
        "Address display",
        "Phone number",
        "One practice area focus",
        "Website link on profile",
        "Multiple practice areas",
        "Up to 2 attorney profiles",
        "Enhanced firm profile",
      ],
      link: "https://buy.stripe.com/5kQ6oG6cg4dQ8Zd3OyaAw00",
      badge: "STARTER",
    },
    {
      name: "Expert Listing",
      price: "$299/mo",
      description:
        "Premium branding, enhanced visibility, analytics, and lead capture tools.",
      features: [
        "Everything in Pro",
        "Lead capture form",
        "Analytics dashboard",
        "Priority visibility",
        "Up to 5 attorney profiles",
      ],
      link: "https://buy.stripe.com/7sY8wOgQU8u65N198SaAw01",
      badge: "POPULAR",
    },
    {
      name: "Category Featured",
      price: "$2,000/mo",
      description:
        "Premium category placement with homepage exposure and lead routing priority.",
      features: [
        "Everything in Expert",
        "Premium placement under Exclusive",
        "Rotating homepage exposure",
        "Max 2 firms per category",
        "Priority lead routing",
        "Up to 10 attorney profiles",
        "Featured badge",
        "Only 5 total available in El Paso",
      ],
      link: "https://buy.stripe.com/fZu6oG0RWeSu2AP98SaAw03",
      badge: "FEATURED",
    },
    {
      name: "Category Exclusive",
      price: "$5,000/mo",
      description:
        "Own the category with total market exclusivity and homepage dominance.",
      features: [
        "Everything in Category Featured",
        "1 firm per category (hard limit)",
        "Top placement in category",
        "Category Owner badge",
        "Full homepage exposure",
        "Competitor lockout",
        "Priority lead routing",
        "Up to 20 attorney profiles",
        "Only 5 total available in El Paso",
      ],
      link: "https://buy.stripe.com/8x27sK3046lYb7lgBkaAw04",
      badge: "MOST EXCLUSIVE",
    },
  ];

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
            fontSize: "56px",
            color: "#fbbf24",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Law Firm Pricing
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            fontSize: "20px",
            marginBottom: "60px",
          }}
        >
          Grow your visibility, leads, and authority with premium law firm placement.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: "#111827",
                border: "1px solid #1e293b",
                borderRadius: "18px",
                padding: "32px",
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
                {plan.badge}
              </div>

              <h2
                style={{
                  color: "#fbbf24",
                  marginBottom: "10px",
                }}
              >
                {plan.name}
              </h2>

              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  marginBottom: "24px",
                }}
              >
                {plan.price}
              </div>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.7,
                  marginBottom: "24px",
                }}
              >
                {plan.description}
              </p>

              <ul
                style={{
                  color: "#cbd5e1",
                  lineHeight: 2,
                  paddingLeft: "20px",
                  marginBottom: "30px",
                }}
              >
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <a
                href={plan.link}
                target="_blank"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#fbbf24",
                  color: "#0f172a",
                  textDecoration: "none",
                  padding: "16px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                Upgrade Now
              </a>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: "60px",
            textAlign: "center",
          }}
        >
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
```

# Then Run

```powershell
cd "C:\Users\PC\Projects\best-ep-lawyers-\EP BEST LAWYERS"
npm run build
```

If successful:

```powershell
cd "C:\Users\PC\Projects\best-ep-lawyers-"
git add -A
git commit -m "upgrade pricing scarcity and exclusivity"
git push
```

# This Updates Your Site To Reflect

* Scarcity-based positioning
* Market exclusivity
* Attorney profile limits
* Homepage exposure hierarchy
* Featured vs Exclusive differentiation
* Real SaaS marketplace pricing psychology
