import PracticeAreaTemplate from "../components/PracticeAreaTemplate";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const immigrationPage: PracticeAreaPageData = {
  path: "/el-paso-immigration-lawyers",
  shortTitle: "Immigration",
  title: "Best Immigration Lawyers in El Paso, Texas",
  description:
    "Compare El Paso immigration attorneys handling family petitions, green cards, adjustment of status, consular processing, citizenship, asylum, waivers, removal defense, and appeals.",
  metaDescription:
    "Compare immigration lawyers in El Paso for family petitions, green cards, adjustment of status, citizenship, asylum, waivers, removal defense, and appeals.",
  heroText:
    "Compare El Paso immigration attorneys for family-based immigration, green cards, adjustment of status, consular processing, citizenship, asylum, waivers, removal defense, and appeals.",
  topics: [
    "Family-Based Immigration",
    "Green Cards",
    "Adjustment of Status",
    "Consular Processing",
    "Naturalization and Citizenship",
    "Asylum",
    "Waivers of Inadmissibility",
    "Removal Defense",
    "Immigration Appeals",
  ],
  overview: [
    "An immigration lawyer helps individuals, families, employers, and businesses understand and navigate U.S. immigration law. The work may include preparing petitions and applications, gathering supporting evidence, responding to government requests, preparing clients for interviews, and representing people in removal proceedings or appeals.",
    "Immigration matters can involve family relationships, employment, humanitarian protection, prior immigration history, criminal records, unlawful presence, admissibility concerns, and changing federal procedures. Small errors or missed deadlines can create serious consequences, so careful preparation is important.",
    "Depending on the case, counsel may assist with family petitions, adjustment of status, consular processing, work authorization, naturalization, asylum, waivers, cancellation of removal, motions to reopen, or appeals before immigration authorities and federal courts.",
  ],
  whenToHire: [
    "You want to sponsor a spouse, child, parent, sibling, fiancé, or another qualifying family member.",
    "You need help applying for a green card, adjustment of status, consular processing, or work authorization.",
    "You are applying for naturalization or have concerns about prior immigration history, travel, taxes, arrests, or good moral character.",
    "You or a family member received a notice to appear, removal order, detention notice, request for evidence, denial, or other immigration document.",
    "You may need asylum, humanitarian protection, a waiver, cancellation of removal, or another form of relief.",
    "Your business needs help with employment-based immigration, work visas, compliance, or sponsorship.",
  ],
  localContent: [
    "El Paso immigration matters are shaped by the city's location on the U.S.-Mexico border, its international families, Fort Bliss, regional employers, and frequent cross-border travel. Cases may involve relatives, records, or property in Mexico and may require coordination with consulates, federal agencies, or courts in different jurisdictions.",
    "Local immigration matters may involve U.S. Citizenship and Immigration Services, the Department of State, U.S. Customs and Border Protection, U.S. Immigration and Customs Enforcement, the Executive Office for Immigration Review, or the El Paso Division of the United States District Court for the Western District of Texas.",
    "An El Paso immigration attorney can help identify eligibility, organize evidence, prepare for interviews or hearings, respond to government notices, preserve deadlines, and evaluate whether an application, waiver, motion, appeal, or defense strategy may be appropriate.",
  ],
  faqs: [
    {
      question: "What is family-based immigration?",
      answer:
        "Family-based immigration allows certain U.S. citizens and lawful permanent residents to petition for qualifying relatives. Eligibility, wait times, and available categories depend on the relationship and immigration status involved.",
    },
    {
      question: "What is adjustment of status?",
      answer:
        "Adjustment of status is the process of applying for lawful permanent residence from inside the United States when legal requirements are met.",
    },
    {
      question: "What is consular processing?",
      answer:
        "Consular processing is the procedure for applying for an immigrant visa through a U.S. embassy or consulate outside the United States.",
    },
    {
      question: "How long does it take to get a green card?",
      answer:
        "Processing times vary based on the category, agency workload, country of chargeability, background checks, evidence, and whether additional review is required.",
    },
    {
      question: "What are the requirements for naturalization?",
      answer:
        "Requirements may include lawful permanent residence for the required period, continuous residence, physical presence, English and civics testing, good moral character, and an oath of allegiance, subject to exceptions.",
    },
    {
      question: "What is asylum?",
      answer:
        "Asylum is a form of protection for people who meet the legal definition of a refugee and cannot safely return to their country because of persecution or a well-founded fear of persecution on a protected ground.",
    },
    {
      question: "What is a waiver of inadmissibility?",
      answer:
        "A waiver may forgive certain grounds that would otherwise prevent admission or immigration benefits. Eligibility depends on the specific ground, qualifying relatives, hardship, and other legal requirements.",
    },
    {
      question: "What happens in removal proceedings?",
      answer:
        "Removal proceedings are held before an immigration judge. The government presents the charges, and the respondent may contest removability or apply for available relief.",
    },
    {
      question: "Can an immigration decision be appealed?",
      answer:
        "Some immigration decisions may be appealed or challenged through motions to reopen, motions to reconsider, administrative appeals, or federal court review. Deadlines can be short.",
    },
    {
      question: "When should I contact an immigration lawyer?",
      answer:
        "Consider contacting counsel before filing a complex application or immediately after receiving a denial, request for evidence, notice to appear, detention notice, or other time-sensitive immigration document.",
    },
  ],
  relatedPages: [
    { label: "Green Card", path: "/el-paso-green-card-lawyers" },
    { label: "Citizenship", path: "/el-paso-citizenship-lawyers" },
    { label: "Family Law", path: "/el-paso-family-lawyers" },
    { label: "Employment Law", path: "/el-paso-employment-lawyers" },
  ],
};

export default function Immigration() {
  return <PracticeAreaTemplate page={immigrationPage} />;
}