const featuredFirms = [
  {
    name: "Johnson Injury Lawyers",
    area: "Personal Injury",
    phone: "(915) 555-1000",
    website: "https://example.com",
    badge: "CATEGORY EXCLUSIVE",
    rating: "5.0",
    reviews: "214 Reviews",
    description:
      "Top-rated El Paso personal injury attorneys handling car accidents, wrongful death, trucking accidents, and catastrophic injury claims.",
  },
  {
    name: "El Paso Family Law Group",
    area: "Family Law",
    phone: "(915) 555-2000",
    website: "https://example.com",
    badge: "FEATURED",
    rating: "4.9",
    reviews: "132 Reviews",
    description:
      "Trusted family law attorneys helping with divorce, custody, child support, and complex family disputes.",
  },
  {
    name: "Border Defense Criminal Lawyers",
    area: "Criminal Defense",
    phone: "(915) 555-3000",
    website: "https://example.com",
    badge: "FEATURED",
    rating: "4.8",
    reviews: "189 Reviews",
    description:
      "Aggressive criminal defense representation for DWI, felonies, federal charges, and drug offenses.",
  },
];

const firms = featuredFirms;

const plans = [
  {
    name: "Category Exclusive",
    price: "$5,000 / mo",
    badge: "Most Exclusive",
    scarcity: "Only 5 total available in El Paso",
    intro: "Everything in Category Featured, plus:",
    features: [
      "1 firm per category",
      "Top placement in category",
      "Category Owner badge",
      "Full homepage exposure",
      "Competitor lockout",
      "Up to 20 attorney profiles",
    ],
    button: "Apply for Exclusivity",
  },
  {
    name: "Category Featured",
    price: "$2,000 / mo",
    badge: "Popular",
    scarcity: "Limited to 10 firms total",
    intro: "Everything in Expert, plus:",
    features: [
      "Premium placement under Exclusive",
      "Rotating homepage exposure",
      "Max 2 firms per category",
      "Priority lead routing",
      "Up to 10 attorney profiles",
    ],
    button: "Become Featured",
  },
  {
    name: "Expert",
    price: "$299 / mo",
    badge: "Best Value",
    scarcity: "+$10/mo per additional attorney",
    intro: "Everything in Pro, plus:",
    features: [
      "Enhanced firm profile",
      "Lead capture form",
      "Analytics dashboard",
      "Up to 5 attorney profiles",
    ],
    button: "Upgrade to Expert",
  },
  {
    name: "Pro",
    price: "$99 / mo",
    badge: "Pro",
    scarcity: "+$15/mo per additional attorney",
    intro: "Everything in Free, plus:",
    features: [
      "Website link on profile",
      "Multiple practice areas",
      "Up to 2 attorney profiles",
    ],
    button: "Get Started",
  },
  {
    name: "Free",
    price: "Free",
    badge: "Free",
    scarcity: "",
    intro: "Basic firm listing includes:",
    features: [
      "Firm name listing",
      "Address display",
      "Phone number",
      "One practice area focus",
    ],
    button: "Claim Free Listing",
  },
];

function Header() {
  return (
    <header style={styles.header}>
      <a href="/" style={styles.logo}>El Paso's Best Lawyers</a>

      <nav style={styles.nav}>
        <a href="/el-paso-personal-injury-lawyers" style={styles.navLink}>
          Personal Injury
        </a>

        <a href="/pricing" style={styles.navLink}>
          Pricing
        </a>

        <a href="/pricing" style={styles.ctaSmall}>
          List Your Firm
        </a>
      </nav>
    </header>
  );
}

function LeadForm() {
  return (
    <section style={styles.formBox}>
      <h2 style={styles.sectionTitle}>Get Listed or Claim a Category</h2>

      <p style={styles.muted}>
        Attorneys and law firms can request a free listing, featured placement,
        or exclusive category sponsorship.
      </p>

      <form style={styles.form}>
        <input style={styles.input} placeholder="Firm name" />
        <input style={styles.input} placeholder="Contact name" />
        <input style={styles.input} placeholder="Email address" />
        <input style={styles.input} placeholder="Phone number" />

        <select style={styles.input}>
          <option>Interested in...</option>
          <option>Free Listing</option>
          <option>Pro - $99/mo</option>
          <option>Expert - $299/mo</option>
          <option>Category Featured - $2,000/mo</option>
          <option>Category Exclusive - $5,000/mo</option>
        </select>

        <textarea
          style={styles.textarea}
          placeholder="Tell us your practice area and goals."
        />

        <button type="button" style={styles.button}>
          Request Information
        </button>
      </form>
    </section>
  );
}

function AttorneyCard({ firm }: { firm: typeof firms[number] }) {
  return (
    <article style={styles.card}>
      <div style={styles.badge}>{firm.tier}</div>

      <h3 style={styles.cardTitle}>{firm.name}</h3>

      <p style={styles.muted}>{firm.description}</p>

      <p>
        <strong>Practice Area:</strong> {firm.category}
      </p>

      <p>
        <strong>Location:</strong> {firm.location}
      </p>

      <p>
        <strong>Phone:</strong> {firm.phone}
      </p>

      <button style={styles.secondaryButton}>View Profile</button>
    </article>
  );
}

function Home() {
  return (
    <>
      <Header />

      <main>
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <p style={styles.kicker}>El Paso Legal Directory</p>

            <h1 style={styles.heroTitle}>
              Find trusted attorneys in El Paso, Texas.
            </h1>

            <p style={styles.heroText}>
              El Paso's Best Lawyers helps people find trusted attorneys while helping leading law firms increase visibility, generate qualified leads, and dominate their practice areas.
              area while giving attorneys a clean way to get discovered,
              capture leads, and own premium category placement.
            </p>

            <div style={styles.actions}>
              <a
                href="/el-paso-personal-injury-lawyers"
                style={styles.buttonLink}
              >
                Find Personal Injury Lawyers
              </a>

              <a href="/pricing" style={styles.outlineLink}>
                List Your Firm
              </a>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <p style={styles.kicker}>Featured Categories</p>

          <h2 style={styles.sectionTitle}>
            Built for high-intent legal searches
          </h2>

          <div style={styles.grid3}>
            <div style={styles.featureBox}>
              <h3>Personal Injury</h3>

              <p>
                Car accidents, injury claims, negligence, and settlement-focused representation.
              </p>
            </div>

            <div style={styles.featureBox}>
              <h3>Family Law</h3>

              <p>
                Divorce, custody, support, modifications, and family court matters.
              </p>
            </div>

            <div style={styles.featureBox}>
              <h3>Criminal Defense</h3>

              <p>
                DWI, misdemeanor, felony, and defense counsel visibility.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.darkSection}>
          <p style={styles.kicker}>For Law Firms</p>

          <h2 style={styles.sectionTitleLight}>
            Own the category before your competitors do.
          </h2>

          <p style={styles.lightText}>
            Category Exclusive gives one firm the strongest placement in a
            practice area. Featured gives premium visibility to a limited
            number of firms.
          </p>

          <a href="/pricing" style={styles.buttonLink}>
            View Pricing
          </a>
        </section>
      </main>
    </>
  );
}

function PricingPage() {
  return (
    <>
      <Header />

      <main>
        <section style={styles.pageHero}>
          <p style={styles.kicker}>Law Firm Pricing</p>

          <h1 style={styles.heroTitle}>
            Choose your visibility level.
          </h1>

          <p style={styles.heroText}>
            Start with a free listing or secure premium placement in a
            high-value legal category.
          </p>
        </section>

        <section style={styles.section}>
          <div style={styles.grid4}>
            {plans.map((plan) => (
              <article key={plan.name} style={styles.priceCard}>
                <div style={styles.badge}>{plan.badge}</div>

                <h2>{plan.name}</h2>

                <p style={styles.price}>{plan.price}</p>

                {plan.scarcity && (
                  <p style={styles.scarcity}>{plan.scarcity}</p>
                )}

                <p style={styles.muted}>{plan.intro}</p>

                <ul style={styles.featureList}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={styles.featureItem}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>

                <button style={styles.button}>
                  {plan.button}
                </button>
              </article>
            ))}
          </div>
        </section>

        <LeadForm />
      </main>
    </>
  );
}

function CategoryPage() {
  return (
    <>
      <Header />

      <main>
        <section style={styles.pageHero}>
          <p style={styles.kicker}>Personal Injury Lawyers</p>

          <h1 style={styles.heroTitle}>
            Best Personal Injury Lawyers in El Paso, TX
          </h1>

          <p style={styles.heroText}>
            Find the Right El Paso Lawyer in Minutes
            with attorneys serving accident victims and injury clients.
          </p>
        </section>

        <section style={styles.section}>
          <div style={styles.grid3}>
            {firms.map((firm) => (
              <AttorneyCard key={firm.name} firm={firm} />
            ))}
          </div>
        </section>

        <LeadForm />
      </main>
    </>
  );
}

function App() {
  const path = window.location.pathname;

  if (path === "/pricing") return <PricingPage />;

  if (path === "/el-paso-personal-injury-lawyers") {
    return <CategoryPage />;
  }

  return <Home />;
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "22px 48px",
    borderBottom: "1px solid #e5e7eb",
    background: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  logo: {
    fontWeight: 800,
    fontSize: 22,
    color: "#0f172a",
    textDecoration: "none",
  },

  nav: {
    display: "flex",
    gap: 22,
    alignItems: "center",
  },

  navLink: {
    color: "#334155",
    textDecoration: "none",
    fontWeight: 600,
  },

  ctaSmall: {
    background: "#0f172a",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 700,
  },

  hero: {
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "#fff",
    padding: "90px 48px",
  },

  heroContent: {
    maxWidth: 900,
  },

  pageHero: {
    padding: "72px 48px",
    background: "#f8fafc",
  },

  kicker: {
    color: "#d4af37",
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontSize: 13,
  },

  heroTitle: {
    fontSize: 54,
    lineHeight: 1.05,
    margin: "12px 0 20px",
    maxWidth: 900,
  },

  heroText: {
    fontSize: 20,
    lineHeight: 1.6,
    maxWidth: 800,
  },

  actions: {
    display: "flex",
    gap: 16,
    marginTop: 32,
    flexWrap: "wrap",
  },

  buttonLink: {
    display: "inline-block",
    background: "#d4af37",
    color: "#111827",
    padding: "14px 22px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 800,
  },

  outlineLink: {
    display: "inline-block",
    border: "1px solid #fff",
    color: "#fff",
    padding: "14px 22px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 800,
  },

  section: {
    padding: "64px 48px",
  },

  darkSection: {
    padding: "70px 48px",
    background: "#0f172a",
    color: "#fff",
  },

  sectionTitle: {
    fontSize: 36,
    margin: "10px 0 18px",
    color: "#0f172a",
  },

  sectionTitleLight: {
    fontSize: 36,
    margin: "10px 0 18px",
    color: "#fff",
  },

  lightText: {
    color: "#cbd5e1",
    fontSize: 18,
    maxWidth: 760,
    lineHeight: 1.6,
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 24,
  },

  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 24,
  },

  featureBox: {
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 26,
    background: "#fff",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  },

  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 20,
    padding: 28,
    background: "#fff",
    boxShadow: "0 12px 35px rgba(15, 23, 42, 0.08)",
  },

  priceCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 20,
    padding: 28,
    background: "#fff",
    boxShadow: "0 12px 35px rgba(15, 23, 42, 0.08)",
  },

  badge: {
    display: "inline-block",
    background: "#fef3c7",
    color: "#92400e",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 12,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 24,
    margin: "8px 0",
  },

  muted: {
    color: "#64748b",
    lineHeight: 1.6,
  },

  price: {
    fontSize: 34,
    fontWeight: 900,
    color: "#0f172a",
  },

  scarcity: {
    color: "#92400e",
    fontWeight: 800,
    marginTop: -10,
  },

  featureList: {
    paddingLeft: 0,
    listStyle: "none",
    display: "grid",
    gap: 10,
    marginTop: 18,
  },

  featureItem: {
    color: "#334155",
    lineHeight: 1.5,
  },

  button: {
    background: "#0f172a",
    color: "#fff",
    padding: "13px 18px",
    borderRadius: 12,
    border: "none",
    fontWeight: 800,
    cursor: "pointer",
    width: "100%",
    marginTop: 14,
  },

  secondaryButton: {
    background: "#d4af37",
    color: "#111827",
    padding: "12px 16px",
    borderRadius: 12,
    border: "none",
    fontWeight: 800,
    cursor: "pointer",
    marginTop: 12,
  },

  formBox: {
    margin: "20px 48px 70px",
    padding: 36,
    borderRadius: 24,
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
  },

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
    marginTop: 24,
  },

  input: {
    padding: 14,
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    fontSize: 16,
  },

  textarea: {
    padding: 14,
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    fontSize: 16,
    minHeight: 110,
    gridColumn: "1 / -1",
  },
};

export default App;