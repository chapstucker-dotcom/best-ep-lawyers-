import PracticeAreaTemplate from "../components/PracticeAreaTemplate";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const criminalDefensePage: PracticeAreaPageData = {
  path: "/el-paso-criminal-defense-lawyers",
  shortTitle: "Criminal Defense",
  title: "Best Criminal Defense Lawyers in El Paso, Texas",
  description:
    "Compare El Paso criminal defense attorneys handling DWI, assault, drug charges, theft, family violence, weapons allegations, juvenile matters, federal cases, expunctions, and appeals.",
  metaDescription:
    "Compare criminal defense lawyers in El Paso for DWI, assault, drug charges, theft, family violence, weapons allegations, juvenile cases, federal matters, and appeals.",
  heroText:
    "Compare El Paso criminal defense attorneys for DWI, assault, drug charges, theft, family violence, weapons allegations, juvenile matters, federal cases, expunctions, and appeals.",
  topics: [
    "DWI and DUI",
    "Assault Charges",
    "Drug Offenses",
    "Theft and Property Crimes",
    "Family Violence",
    "Weapons Charges",
    "Juvenile Defense",
    "Federal Criminal Defense",
    "Expunctions and Nondisclosures",
  ],
  overview: [
    "A criminal defense lawyer represents people accused of misdemeanors, felonies, and federal offenses. The work may include reviewing probable cause, examining evidence, challenging unlawful searches or statements, negotiating with prosecutors, preparing pretrial motions, and representing the client at hearings, trial, sentencing, or appeal.",
    "A criminal case can affect freedom, employment, professional licensing, immigration status, driving privileges, housing, and reputation. The available strategy depends on the charge, evidence, criminal history, court, deadlines, and whether diversion, dismissal, plea negotiations, trial, or another resolution may be available.",
    "Texas criminal cases may involve arrest warrants, bond conditions, protective orders, laboratory evidence, body-camera footage, witness statements, digital records, and forensic testing. Early legal review can help preserve evidence, identify defenses, and avoid statements or decisions that may harm the case.",
  ],
  whenToHire: [
    "You were arrested, cited, questioned, or told that you are under investigation.",
    "You received a complaint, information, indictment, warrant, bond condition, protective order, or court date.",
    "The case involves DWI, assault, family violence, drugs, theft, weapons, probation, or a felony allegation.",
    "You believe evidence was obtained through an unlawful search, seizure, stop, interrogation, or identification procedure.",
    "You need help with bond, pretrial release, probation, revocation, expunction, nondisclosure, appeal, or post-conviction relief.",
    "A criminal case may affect immigration status, military service, employment, licensing, education, or professional credentials.",
  ],
  localContent: [
    "El Paso criminal cases may be handled in municipal courts, county criminal courts at law, district courts, juvenile courts, or the El Paso Division of the United States District Court for the Western District of Texas, depending on the charge and jurisdiction.",
    "El Paso County maintains county criminal courts for misdemeanor matters and district courts for felony and other criminal cases. Local procedures, bond practices, prosecutor policies, diversion programs, and court schedules can affect how a case moves forward.",
    "An El Paso criminal defense attorney can help evaluate the charge, court, bond conditions, evidence, collateral consequences, and whether negotiation, dismissal, diversion, trial, appeal, expunction, or another strategy may be appropriate.",
  ],
  faqs: [
    {
      question: "What should I do after an arrest?",
      answer:
        "Remain calm, avoid discussing the facts of the case with anyone other than your lawyer, comply with lawful booking procedures, and contact criminal defense counsel as soon as possible.",
    },
    {
      question: "What is the difference between a misdemeanor and a felony?",
      answer:
        "Misdemeanors are generally less serious offenses than felonies, but both can lead to jail, fines, probation, and lasting consequences. Felonies carry the possibility of prison and more severe collateral effects.",
    },
    {
      question: "What is bail or bond?",
      answer:
        "Bond is a financial or legal condition intended to help ensure a defendant appears in court. Conditions may also restrict travel, contact, alcohol use, weapons, or other activity.",
    },
    {
      question: "Can criminal charges be dismissed?",
      answer:
        "Some cases may be dismissed because of insufficient evidence, legal defects, suppression of evidence, witness issues, diversion, negotiations, or other circumstances. Dismissal is never guaranteed.",
    },
    {
      question: "What happens at an arraignment?",
      answer:
        "An arraignment or initial court setting may involve notice of the charge, a plea, bond issues, appointment of counsel, scheduling, or other preliminary matters depending on the court.",
    },
    {
      question: "What is a plea bargain?",
      answer:
        "A plea bargain is an agreement in which the defendant resolves the case by pleading guilty or no contest in exchange for negotiated terms. A lawyer can explain the risks, benefits, and consequences.",
    },
    {
      question: "Can evidence be suppressed?",
      answer:
        "A court may exclude evidence obtained in violation of constitutional or statutory protections. Whether suppression applies depends on the facts and legal issues.",
    },
    {
      question: "What is an expunction?",
      answer:
        "An expunction is a court process that may allow eligible arrest and case records to be destroyed or removed from public access. Eligibility is limited and depends on the disposition and statute.",
    },
    {
      question: "What is an order of nondisclosure?",
      answer:
        "An order of nondisclosure may restrict public access to eligible criminal history records, but it does not erase every record and is not available in every case.",
    },
    {
      question: "When should I contact a criminal defense lawyer?",
      answer:
        "Contact counsel as early as possible after an arrest, accusation, investigation, warrant, court notice, bond restriction, or request for questioning.",
    },
  ],
  relatedPages: [
    { label: "DWI / DUI", path: "/el-paso-dwi-lawyers" },
    { label: "Civil Litigation", path: "/el-paso-civil-litigation-lawyers" },
    { label: "Immigration", path: "/el-paso-immigration-lawyers" },
    { label: "Family Law", path: "/el-paso-family-lawyers" },
  ],
};

export default function CriminalDefense() {
  return <PracticeAreaTemplate page={criminalDefensePage} />;
}