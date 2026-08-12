import PracticeAreaTemplate from "../components/PracticeAreaTemplate";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const slipAndFallPage: PracticeAreaPageData = {
  path: "/el-paso-slip-and-fall-lawyers",
  shortTitle: "Slip and Fall",
  title: "Best Slip and Fall Lawyers in El Paso, Texas",
  description:
    "Compare El Paso slip and fall attorneys handling unsafe property conditions, premises liability claims, serious injuries, insurance disputes, negligent maintenance, and wrongful death.",
  metaDescription:
    "Compare slip and fall lawyers in El Paso for unsafe property conditions, premises liability claims, serious injuries, and insurance disputes.",
  heroText:
    "Compare El Paso slip and fall attorneys for unsafe property conditions, premises liability claims, serious injuries, and insurance disputes.",
  topics: [
    "Unsafe Floors",
    "Poor Lighting",
    "Broken Stairs",
    "Uneven Walkways",
    "Wet Surfaces",
    "Negligent Maintenance",
    "Apartment Complex Injuries",
    "Retail Store Injuries",
    "Serious Injuries",
    "Wrongful Death",
  ],
  overview: [
    "A slip and fall lawyer represents people injured because of unsafe conditions on property owned, occupied, or controlled by another person or business.",
    "Important evidence may include photographs, surveillance video, incident reports, maintenance records, inspection logs, witness statements, medical records, and proof that the dangerous condition existed long enough to be discovered or corrected.",
    "Property owners and businesses may dispute whether a condition was dangerous, whether they had notice, or whether the injured person was partly responsible. Prompt evidence preservation can be critical.",
    "Compensation may include medical expenses, lost income, pain, impairment, disfigurement, and other damages allowed by law.",
  ],
  whenToHire: [
    "You were seriously injured at a store, apartment complex, hotel, restaurant, workplace, parking lot, or other property.",
    "The property owner or insurer disputes responsibility.",
    "Surveillance video, maintenance records, or witness information must be preserved.",
    "The injury caused hospitalization, surgery, missed work, or permanent limitations.",
    "A loved one died because of an unsafe property condition.",
  ],
  localContent: [
    "Slip and fall claims in El Paso may involve retail stores, apartment complexes, hotels, restaurants, offices, parking areas, sidewalks, and other public or private property.",
    "An El Paso attorney can help investigate notice, maintenance practices, property control, insurance coverage, and the full extent of the injury.",
  ],
  faqs: [
    { question: "What must be proven in a slip and fall case?", answer: "The required proof depends on the facts, but often includes a dangerous condition, responsibility for the property, notice or knowledge, and a connection between the condition and the injury." },
    { question: "What evidence should I preserve?", answer: "Preserve photographs, video, witness names, incident reports, clothing and shoes, medical records, bills, and communications with the property owner or insurer." },
    { question: "What if there was no warning sign?", answer: "The absence of a warning may be relevant, but the full circumstances, including notice and the nature of the hazard, still matter." },
    { question: "What if I was partly at fault?", answer: "Texas proportionate-responsibility rules may reduce recovery and can bar recovery when the claimant's responsibility exceeds the statutory limit." },
    { question: "How long do I have to file?", answer: "Texas limitation periods and special notice requirements may apply, so prompt legal review is important." },
    { question: "Should I speak with the insurance company?", answer: "Consider legal advice before giving a recorded statement or signing a release." },
    { question: "Can I recover for lost wages?", answer: "Lost income and reduced earning capacity may be recoverable when supported by evidence." },
    { question: "What if the fall happened at an apartment complex?", answer: "The landlord, property manager, maintenance company, or another party may be involved depending on control, notice, and the condition." },
    { question: "How long does a slip and fall case take?", answer: "Timing varies based on medical treatment, fault disputes, evidence, negotiations, and litigation." },
    { question: "When should I contact a lawyer?", answer: "As soon as practical after a serious fall, especially when video or maintenance records may be lost." },
  ],
  relatedPages: [
    { label: "Personal Injury", path: "/el-paso-personal-injury-lawyers" },
    { label: "Car Accident", path: "/el-paso-car-accident-lawyers" },
    { label: "Wrongful Death", path: "/el-paso-wrongful-death-lawyers" },
    { label: "Civil Litigation", path: "/el-paso-civil-litigation-lawyers" },
  ],
};

export default function SlipAndFall() {
  return <PracticeAreaTemplate page={slipAndFallPage} />;
}