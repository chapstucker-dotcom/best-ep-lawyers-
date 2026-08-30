import { useEffect } from "react";
import { Link } from "react-router-dom";
import LeadCaptureForm from "../components/LeadCaptureForm";
import PracticeAreaFirmDirectory from "../components/PracticeAreaFirmDirectory";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const faqs = [
  {
    q: "What is a slip and fall case?",
    a: "A slip and fall case is a type of premises-liability claim involving an injury caused by a condition on property. Whether a claim exists depends on facts such as the condition, notice, the visitor's status, warnings, causation, and damages.",
  },
  {
    q: "What should I do after a slip and fall accident in El Paso?",
    a: "Consider reporting the incident, getting appropriate medical attention, identifying witnesses, preserving shoes and clothing, taking photographs or video when possible, and keeping records related to the incident and resulting losses.",
  },
  {
    q: "What evidence can matter in a slip and fall claim?",
    a: "Potential evidence can include photographs, surveillance video, incident reports, witness statements, maintenance and inspection records, prior complaints, medical records, receipts, and documentation showing when the dangerous condition existed.",
  },
  {
    q: "Can surveillance video be important after a fall?",
    a: "Yes. Video may show the condition of the property, how the fall happened, employee activity, inspections, warnings, or how long a condition existed. Some recordings may be overwritten, so preservation can become time-sensitive.",
  },
  {
    q: "Who may be responsible for a dangerous property condition?",
    a: "Depending on the circumstances, potentially responsible parties can include property owners, occupiers, businesses, landlords, management companies, contractors, or others responsible for the area or condition involved.",
  },
  {
    q: "What if the property owner says I should have seen the hazard?",
    a: "Visibility of the condition and the injured person's actions can be disputed issues. Texas law can consider comparative responsibility, so the specific facts and available evidence matter.",
  },
  {
    q: "How long do I have to pursue a slip and fall claim in Texas?",
    a: "Legal deadlines can apply to injury claims, and special notice requirements or shorter deadlines may apply in some circumstances. A lawyer can evaluate which deadlines apply to a particular incident.",
  },
  {
    q: "How do I compare slip and fall lawyers in El Paso?",
    a: "Consider experience with Texas premises-liability cases, investigation practices, litigation and trial experience, communication, fee structure, and the attorney's approach to evidence such as surveillance footage, maintenance records, and expert testimony.",
  },
];

const slipAndFallDirectoryPage: PracticeAreaPageData = {
  path: "/el-paso-slip-and-fall-lawyers",
  shortTitle: "Slip and Fall",
  title: "Best Slip and Fall Lawyers in El Paso, TX",
  description:
    "Compare El Paso slip and fall lawyers handling premises liability claims involving stores, apartments, unsafe walkways, wet floors, and dangerous property conditions.",
  metaDescription:
    "Compare slip and fall lawyers in El Paso, TX handling premises liability claims involving stores, businesses, apartments, unsafe walkways, wet floors, and other dangerous property conditions.",
  heroText:
    "Compare El Paso slip and fall lawyers and premises liability attorneys handling injuries caused by dangerous property conditions.",
  topics: [
    "Wet or Slippery Floors",
    "Uneven Sidewalks & Walkways",
    "Broken Stairs & Handrails",
    "Poor Lighting",
    "Store & Retail Accidents",
    "Restaurant Falls",
    "Apartment & Rental Property Hazards",
    "Parking Lot Accidents",
    "Construction & Property Defects",
    "Falling Merchandise",
    "Unmarked Hazards",
    "Negligent Property Maintenance",
  ],
  overview: [
    "Slip and fall claims are premises-liability matters involving injuries allegedly caused by dangerous property conditions.",
    "Important issues can include the condition of the property, notice, warnings, responsibility for maintenance or inspection, causation, comparative responsibility, and damages.",
    "Evidence may include photographs, surveillance video, incident reports, witness statements, maintenance records, inspection records, prior complaints, medical records, and documentation of lost income.",
  ],
  whenToHire: [
    "You suffered a serious injury after falling on another person's or business's property.",
    "The property owner, business, insurer, or another party disputes responsibility.",
    "Surveillance footage, photographs, maintenance records, or witness information may need to be preserved.",
    "The fall caused hospitalization, surgery, missed work, permanent limitations, or continuing treatment.",
    "Multiple parties may have been responsible for owning, occupying, maintaining, or repairing the property.",
  ],
  localContent: [
    "Falls can occur at grocery stores, shopping centers, restaurants, hotels, workplaces, apartment complexes, parking lots, sidewalks, private residences, and other properties throughout El Paso.",
    "The identity of the owner, tenant, management company, contractor, or other responsible party can affect how a claim is investigated.",
    "Because spills can be cleaned, defects repaired, witnesses lost, and surveillance recordings overwritten, preservation of evidence can become time-sensitive after a serious fall.",
  ],
  faqs: faqs.map((faq) => ({ question: faq.q, answer: faq.a })),
  relatedPages: [
    { label: "Personal Injury", path: "/el-paso-personal-injury-lawyers" },
    { label: "Construction Accident", path: "/el-paso-construction-accident-lawyers" },
    { label: "Brain Injury", path: "/el-paso-brain-injury-lawyers" },
    { label: "Wrongful Death", path: "/el-paso-wrongful-death-lawyers" },
  ],
  resourceLinks: [{ label: "El Paso Legal Guides", path: "/guides" }],
  lastUpdated: "August 30, 2026",
};

export default function SlipAndFall() {
  useEffect(() => {
    const title = "Best Slip and Fall Lawyers in El Paso, TX | El Paso's Best Lawyers";
    const description =
      "Compare slip and fall lawyers in El Paso, TX handling premises liability claims involving stores, businesses, apartments, unsafe walkways, wet floors, and other dangerous property conditions.";
    const canonical =
      "https://www.elpasosbestlawyers.com/el-paso-slip-and-fall-lawyers";

    const previousTitle = document.title;
    document.title = title;

    const upsertMeta = (selector: string, attribute: "name" | "property", key: string, value: string) => {
      let tag = document.querySelector<HTMLMetaElement>(selector);
      const existed = Boolean(tag);
      const previous = tag?.getAttribute("content") ?? null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }
      tag.content = value;
      return () => {
        if (!existed) tag?.remove();
        else if (previous !== null) tag?.setAttribute("content", previous);
      };
    };

    const cleanups = [
      upsertMeta('meta[name="description"]', "name", "description", description),
      upsertMeta('meta[name="robots"]', "name", "robots", "index, follow"),
      upsertMeta('meta[property="og:type"]', "property", "og:type", "website"),
      upsertMeta('meta[property="og:title"]', "property", "og:title", title),
      upsertMeta('meta[property="og:description"]', "property", "og:description", description),
      upsertMeta('meta[property="og:url"]', "property", "og:url", canonical),
      upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", "El Paso's Best Lawyers"),
    ];

    let canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalExisted = Boolean(canonicalTag);
    const previousCanonical = canonicalTag?.getAttribute("href") ?? null;
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.rel = "canonical";
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = canonical;

    const schemaId = "slip-and-fall-seo-schema";
    document.getElementById(schemaId)?.remove();
    const schema = document.createElement("script");
    schema.id = schemaId;
    schema.type = "application/ld+json";
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": canonical,
          url: canonical,
          name: title,
          description,
          isPartOf: {
            "@type": "WebSite",
            name: "El Paso's Best Lawyers",
            url: "https://www.elpasosbestlawyers.com",
          },
          breadcrumb: { "@id": `${canonical}#breadcrumb` },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.elpasosbestlawyers.com" },
            {
              "@type": "ListItem",
              position: 2,
              name: "Personal Injury",
              item: "https://www.elpasosbestlawyers.com/el-paso-personal-injury-lawyers",
            },
            { "@type": "ListItem", position: 3, name: "Slip and Fall Lawyers", item: canonical },
          ],
        },
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        },
      ],
    });
    document.head.appendChild(schema);

    return () => {
      document.title = previousTitle;
      cleanups.forEach((cleanup) => cleanup());
      document.getElementById(schemaId)?.remove();
      if (!canonicalExisted) canonicalTag?.remove();
      else if (previousCanonical !== null) canonicalTag?.setAttribute("href", previousCanonical);
    };
  }, []);

  const cardStyle = {
    background: "#111827",
    border: "1px solid #1e293b",
    borderRadius: "14px",
  };

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
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <section style={{ marginBottom: "48px" }}>
          <p style={{ color: "#fbbf24", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            El Paso Premises Liability Directory
          </p>
          <h1 style={{ color: "#fbbf24", fontSize: "56px", marginBottom: "24px", lineHeight: 1.1 }}>
            Best Slip and Fall Lawyers in El Paso, TX
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "21px", lineHeight: 1.75, maxWidth: "930px", marginBottom: "18px" }}>
            Compare El Paso slip and fall lawyers and premises liability attorneys handling injuries involving wet floors, unsafe walkways, poorly maintained property, inadequate lighting, broken stairs, apartment hazards, stores, restaurants, and other dangerous conditions.
          </p>
          <p style={{ color: "#94a3b8", fontSize: "17px", lineHeight: 1.75, maxWidth: "930px" }}>
            A serious fall can lead to medical expenses, lost income, pain, mobility problems, and disputes over who was responsible for the property. This directory helps consumers compare participating El Paso law firms and learn about common issues in Texas slip and fall claims.
          </p>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "14px" }}>Compare El Paso Slip and Fall Law Firms</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.75, maxWidth: "930px", marginBottom: "24px" }}>
            Review participating El Paso firms that identify slip and fall, premises liability, or related personal injury matters as areas of practice.
          </p>
          <PracticeAreaFirmDirectory page={slipAndFallDirectoryPage} />
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "18px" }}>Common Slip and Fall and Premises Liability Cases</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            {slipAndFallDirectoryPage.topics.map((item) => (
              <div key={item} style={{ ...cardStyle, padding: "18px", fontWeight: 700 }}>{item}</div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "52px" }}>
          <div style={{ ...cardStyle, padding: "28px" }}>
            <h2 style={{ fontSize: "27px", marginTop: 0, marginBottom: "14px" }}>Evidence That May Matter After a Fall</h2>
            <ul style={{ color: "#cbd5e1", lineHeight: 1.8, paddingLeft: "20px", margin: 0 }}>
              <li>Photos and video of the dangerous condition</li>
              <li>Surveillance-camera recordings</li>
              <li>Incident and accident reports</li>
              <li>Witness names and statements</li>
              <li>Inspection and maintenance records</li>
              <li>Prior complaints or similar incidents</li>
              <li>Medical records and bills</li>
              <li>Documentation of lost income and other losses</li>
            </ul>
          </div>
          <div style={{ ...cardStyle, padding: "28px" }}>
            <h2 style={{ fontSize: "27px", marginTop: 0, marginBottom: "14px" }}>How a Slip and Fall Attorney May Help</h2>
            <ul style={{ color: "#cbd5e1", lineHeight: 1.8, paddingLeft: "20px", margin: 0 }}>
              <li>Investigate the property and circumstances</li>
              <li>Identify potentially responsible parties</li>
              <li>Request preservation of relevant evidence</li>
              <li>Review maintenance and inspection practices</li>
              <li>Evaluate insurance coverage and claims</li>
              <li>Document injuries and claimed damages</li>
              <li>Negotiate or litigate when appropriate</li>
            </ul>
          </div>
        </section>

        <section style={{ ...cardStyle, padding: "30px", marginBottom: "52px" }}>
          <h2 style={{ fontSize: "30px", marginTop: 0, marginBottom: "14px" }}>Slip and Fall Claims in El Paso, Texas</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: "16px" }}>
            Slip and fall claims are generally evaluated under Texas premises-liability law. The analysis can depend on why the injured person was on the property, what condition caused the incident, whether the responsible party knew or should have known about the condition, whether a warning was provided, and whether the condition caused the claimed injuries.
          </p>
          <p style={{ color: "#cbd5e1", lineHeight: 1.75, marginBottom: "16px" }}>
            Falls can occur at grocery stores, shopping centers, restaurants, hotels, workplaces, apartment complexes, parking lots, sidewalks, private residences, and other properties throughout El Paso. The identity of the owner, tenant, management company, contractor, or other responsible party can affect how a claim is investigated.
          </p>
          <p style={{ color: "#cbd5e1", lineHeight: 1.75, margin: 0 }}>
            Evidence can disappear quickly. Spills may be cleaned, defects may be repaired, witnesses can become difficult to locate, and surveillance systems may overwrite recordings. Preserving information about the scene can therefore be an important early issue after a serious fall.
          </p>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "18px" }}>Injuries Associated With Serious Falls</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.75, maxWidth: "930px", marginBottom: "18px" }}>
            Falls can cause injuries ranging from bruises and sprains to fractures and other significant trauma. Depending on the circumstances, a claim may involve treatment costs, rehabilitation, lost wages, reduced earning capacity, pain, impairment, and other alleged damages.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
            {["Broken Bones", "Hip Injuries", "Head Injuries", "Back Injuries", "Neck Injuries", "Knee Injuries", "Shoulder Injuries", "Soft-Tissue Injuries"].map((item) => (
              <div key={item} style={{ padding: "16px", border: "1px solid #334155", borderRadius: "12px", color: "#e2e8f0" }}>{item}</div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>Frequently Asked Questions</h2>
          <div style={{ display: "grid", gap: "16px" }}>
            {faqs.map((faq) => (
              <div key={faq.q} style={{ ...cardStyle, padding: "22px" }}>
                <h3 style={{ marginTop: 0, marginBottom: "10px", fontSize: "20px" }}>{faq.q}</h3>
                <p style={{ color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, padding: "28px", marginBottom: "40px" }}>
          <h2 style={{ marginTop: 0, marginBottom: "12px", fontSize: "28px" }}>Connect With an El Paso Slip and Fall Lawyer</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "24px" }}>
            Use the form below to submit your information and connect with a participating law firm.
          </p>
          <LeadCaptureForm />
        </section>

        <section style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "18px" }}>Related El Paso Injury Lawyer Directories</h2>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            {slipAndFallDirectoryPage.relatedPages?.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                style={{ display: "inline-block", border: "1px solid #fbbf24", color: "#fbbf24", padding: "15px 20px", borderRadius: "12px", textDecoration: "none", fontWeight: "bold" }}
              >
                {page.label} Lawyers
              </Link>
            ))}
            <Link
              to="/guides"
              style={{ display: "inline-block", border: "1px solid #64748b", color: "#e2e8f0", padding: "15px 20px", borderRadius: "12px", textDecoration: "none", fontWeight: "bold" }}
            >
              El Paso Legal Guides
            </Link>
          </div>
        </section>

        <section style={{ borderTop: "1px solid #334155", paddingTop: "24px", color: "#94a3b8", fontSize: "14px", lineHeight: 1.7 }}>
          <p style={{ margin: "0 0 8px" }}>
            El Paso&apos;s Best Lawyers is a lawyer directory and informational resource. It is not a law firm and does not provide legal advice.
          </p>
          <p style={{ margin: 0 }}>Last updated August 30, 2026.</p>
        </section>
      </div>
    </main>
  );
}
