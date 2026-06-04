import { useMemo, useState } from "react";
import "./App.css";

const practiceAreas = [
  ["Personal Injury", "Car accidents, wrongful death, catastrophic injury, and negligence claims."],
  ["Car Accidents", "Compare El Paso attorneys handling auto accident and insurance claims."],
  ["Truck Accidents", "18-wheeler, commercial vehicle, and serious trucking accident cases."],
  ["Criminal Defense", "DWI, misdemeanors, felonies, and federal defense representation."],
  ["DWI", "DWI defense, license issues, and criminal court representation."],
  ["Immigration", "Visas, deportation defense, residency, green cards, and citizenship."],
  ["Family Law", "Divorce, custody, child support, and family court matters."],
  ["Estate Planning", "Wills, trusts, probate, and estate planning support."],
  ["Business Law", "Contracts, disputes, business formation, and commercial legal matters."],
];

const exclusiveSlots = [
  ["Personal Injury", "Available", "$5,000/mo"],
  ["Criminal Defense", "Available", "$5,000/mo"],
  ["Immigration", "Available", "$5,000/mo"],
  ["Family Law", "Available", "$5,000/mo"],
  ["DWI", "Available", "$5,000/mo"],
];

const firms = [
  ["Cesar Ornelas Injury Law", "Personal Injury", "(915) 209-0646", "Category Exclusive", "Car accidents, injury claims, wrongful death, and serious injury cases."],
  ["Setra Law Firm", "Criminal Defense", "(915) 337-8100", "Featured", "DWI, misdemeanors, felonies, and criminal defense representation."],
  ["Villar & Garcia Immigration Attorneys", "Immigration", "(915) 314-2363", "Featured", "Immigration, deportation defense, residency, and visa matters."],
  ["El Paso Family Law Group", "Family Law", "(915) 555-2000", "Featured", "Divorce, custody, support, and family law matters."],
  ["Border Defense Lawyers", "DWI / Criminal Defense", "(915) 555-3000", "Featured", "DWI, criminal defense, and courtroom representation."],
  ["West Texas Estate Counsel", "Estate Planning", "(915) 555-4000", "Expert", "Wills, trusts, probate, and estate planning."],
];

export default function App() {
  const [search, setSearch] = useState("");

  const filteredFirms = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return firms;
    return firms.filter((firm) => firm.join(" ").toLowerCase().includes(q));
  }, [search]);

  return (
    <main>
      <header className="site-header">
        <div className="logo">El Paso&apos;s Best Lawyers</div>
        <nav>
          <a href="#areas">Practice Areas</a>
          <a href="#exclusive">Exclusive Slots</a>
          <a href="#firms">Featured Firms</a>
          <a href="#pricing">Pricing</a>
          <a className="header-button" href="#lead">List Your Firm</a>
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">EL PASO LEGAL DIRECTORY</p>
        <h1>Find the Right El Paso Lawyer in Minutes.</h1>
        <p className="hero-text">
          Search and compare trusted El Paso attorneys by practice area, reviews,
          experience, availability, and premium category placement.
        </p>

        <div className="search-box">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search attorneys, law firms, or practice areas..."
          />
   <button
  type="button"
  onClick={() => document.getElementById("firms")?.scrollIntoView({ behavior: "smooth" })}
>
  Search
</button>
        </div>

        <div className="hero-actions">
          <a className="button gold" href="#firms">Find a Lawyer</a>
          <a className="button outline" href="#exclusive">Claim a Category</a>
        </div>

        <div className="trust-strip">
          <span>Verified Local Firm Profiles</span>
          <span>Fast Consultation Requests</span>
          <span>Premium Category Placement</span>
        </div>
      </section>

      <section id="exclusive" className="section exclusive-section">
        <p className="eyebrow centered">CATEGORY EXCLUSIVE PARTNERS</p>
        <h2>Own Your Practice Area Before a Competitor Does</h2>

        <div className="grid">
          {exclusiveSlots.map(([category, status, price]) => (
            <article className="exclusive-card" key={category}>
              <span className="badge">CATEGORY EXCLUSIVE</span>
              <h3>{category}</h3>
              <p>One firm only. Top placement. Competitor lockout.</p>
              <strong>{status}</strong>
              <div className="price smaller">{price}</div>
              <a className="button gold" href="#lead">Claim This Category</a>
            </article>
          ))}
        </div>
      </section>

      <section id="areas" className="section light">
        <p className="eyebrow centered">PRACTICE AREAS</p>
        <h2>Browse El Paso Legal Categories</h2>

        <div className="grid">
          {practiceAreas.map(([title, text]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
              <a href="#firms">View Lawyers →</a>
            </article>
          ))}
        </div>
      </section>

      <section id="firms" className="section white">
        <p className="eyebrow centered">FEATURED EL PASO LAW FIRMS</p>
        <h2>Top-Rated Attorneys You Can Trust</h2>

        <div className="grid">
<p className="results-count">
  Showing {filteredFirms.length} firm{filteredFirms.length === 1 ? "" : "s"}
  {search ? ` for "${search}"` : ""}
</p>
          {filteredFirms.map(([name, category, phone, badge, description]) => (
            <article className="firm-card" key={name}>
              <span className="badge">{badge}</span>
              <div className="firm-avatar">{name.charAt(0)}</div>
              <h3>{name}</h3>
              <p className="stars">★★★★★ 4.9 Reviews</p>
              <p><strong>{category}</strong></p>
              <p>{description}</p>
              <p className="phone">{phone}</p>
              <div className="card-actions">
                <a className="button small gold" href="#lead">Request Consultation</a>
                <a className="button small dark-btn" href="#lead">View Profile</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="section dark">
        <p className="eyebrow centered">FOR ATTORNEYS</p>
        <h2>Turn Local Search Into Qualified Legal Leads</h2>

        <div className="grid">
          <article className="price-card">
            <h3>Expert Listing</h3>
            <div className="price">$299/mo</div>
            <p>Enhanced profile, lead capture form, analytics, and up to 5 attorney profiles.</p>
            <a className="button gold" href="#lead">Claim This Spot</a>
          </article>

          <article className="price-card featured">
            <h3>Category Featured</h3>
            <div className="price">$2,000/mo</div>
            <p>Premium placement, homepage exposure, featured badge, and priority lead visibility.</p>
            <a className="button gold" href="#lead">Become Featured</a>
          </article>

          <article className="price-card">
            <h3>Category Exclusive</h3>
            <div className="price">$5,000/mo</div>
            <p>One firm per category, top placement, Category Owner badge, and competitor lockout.</p>
            <a className="button gold" href="#lead">Apply for Exclusivity</a>
          </article>
        </div>
      </section>

      <section id="lead" className="section lead">
        <p className="eyebrow centered">GET MATCHED</p>
        <h2>Need a Lawyer or Want to List Your Firm?</h2>
        <p>Tell us what you need. We&apos;ll help connect people with trusted El Paso law firms.</p>

        <form className="lead-form">
          <input placeholder="Full Name" />
          <input placeholder="Phone Number" />
          <input placeholder="Email Address" />
          <select>
            <option>Practice Area</option>
            <option>Personal Injury</option>
            <option>Car Accidents</option>
            <option>Criminal Defense</option>
            <option>DWI</option>
            <option>Immigration</option>
            <option>Family Law</option>
            <option>Attorney Advertising</option>
          </select>
          <textarea placeholder="Briefly describe your legal issue or listing request" />
          <button type="button">Submit Request</button>
        </form>
      </section>

      <footer>
        <strong>El Paso&apos;s Best Lawyers</strong>
        <span>© 2026 El Paso&apos;s Best Lawyers. All rights reserved.</span>
      </footer>
    </main>
  );
}