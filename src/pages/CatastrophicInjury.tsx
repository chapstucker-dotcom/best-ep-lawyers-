import PracticeAreaTemplate from "../components/PracticeAreaTemplate";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const catastrophicInjuryPage: PracticeAreaPageData = {
  path: "/el-paso-catastrophic-injury-lawyers",
  shortTitle: "Catastrophic Injury",
  title: "Best Catastrophic Injury Lawyers in El Paso, Texas",
  description:
    "Compare El Paso catastrophic injury attorneys handling permanent disability, spinal cord injuries, traumatic brain injuries, severe burns, amputations, and life-changing accidents.",
  metaDescription:
    "Compare catastrophic injury lawyers in El Paso for permanent disabilities, brain injuries, spinal cord injuries, severe burns, amputations, and serious accident claims.",
  heroText:
    "Find and compare El Paso attorneys representing people with severe, life-changing injuries and long-term medical and financial needs.",
  topics: [
    "Catastrophic Injuries",
    "Permanent Disability",
    "Traumatic Brain Injuries",
    "Spinal Cord Injuries",
    "Paralysis",
    "Severe Burns",
    "Amputations",
    "Multiple Fractures",
    "Long-Term Rehabilitation",
    "Future Medical Expenses",
    "Lost Earning Capacity",
    "Wrongful Death",
  ],
  overview: [
    "Catastrophic injuries are severe injuries that can permanently affect a person's health, mobility, independence, ability to work, or quality of life. They may result from vehicle collisions, workplace accidents, construction incidents, defective products, falls, or other events.",
    "These cases can involve complex questions about liability, medical causation, future treatment, rehabilitation, accessibility modifications, ongoing assistance, and long-term financial losses.",
    "Attorneys handling catastrophic injury claims may work with medical professionals, rehabilitation specialists, vocational experts, economists, and other qualified witnesses to evaluate the full extent of an injury and its consequences.",
    "The appropriate legal strategy depends on the cause of the injury, available evidence, applicable insurance coverage, responsible parties, and Texas law.",
  ],
  whenToHire: [
    "An accident caused permanent impairment, paralysis, amputation, severe burns, or significant neurological damage.",
    "You or a family member requires extensive rehabilitation, long-term care, or assistance with daily activities.",
    "The injury prevents a return to previous employment or substantially reduces earning capacity.",
    "Several businesses, drivers, contractors, or other parties may share responsibility.",
    "An insurer disputes liability, the severity of the injury, or the cost of future care.",
  ],
  localContent: [
    "Catastrophic injuries in El Paso may arise from collisions on Interstate 10, Loop 375, U.S. Highway 54, and other local roads, as well as industrial facilities, construction sites, workplaces, and commercial properties throughout El Paso County.",
    "Serious injury claims may require medical records, incident reports, photographs, surveillance footage, vehicle or equipment data, witness accounts, employment records, and documentation of long-term care needs.",
    "Depending on the circumstances, an El Paso catastrophic injury attorney may investigate potentially responsible parties, preserve evidence, review insurance coverage, and assess the financial effects of permanent disability.",
    "Texas generally applies a two-year limitations period to personal injury lawsuits, but exceptions and different deadlines can apply. Prompt legal review can help protect evidence and identify applicable deadlines.",
  ],
  faqs: [
    {
      question: "What qualifies as a catastrophic injury?",
      answer:
        "The term generally refers to a severe injury with lasting or permanent consequences, such as paralysis, traumatic brain injury, spinal cord damage, amputation, or serious burns. The legal significance depends on the circumstances.",
    },
    {
      question: "What compensation may be available?",
      answer:
        "Depending on liability and applicable law, recoverable damages may include medical expenses, future care, lost earnings, reduced earning capacity, physical impairment, pain, and other legally recognized losses.",
    },
    {
      question: "Can future medical care be included in a claim?",
      answer:
        "Potentially. When supported by appropriate evidence, anticipated medical treatment, rehabilitation, equipment, and long-term assistance may be considered.",
    },
    {
      question: "Who may be responsible for a catastrophic injury?",
      answer:
        "Responsibility depends on the facts and may involve negligent drivers, employers or contractors in certain circumstances, property owners, manufacturers, or other parties.",
    },
    {
      question: "Do catastrophic injury cases require expert witnesses?",
      answer:
        "Some cases benefit from medical, vocational, engineering, or economic experts, particularly when causation, permanent impairment, or future losses are disputed.",
    },
    {
      question: "How long do I have to file a lawsuit in Texas?",
      answer:
        "Many Texas personal injury claims have a two-year limitations period, but exceptions and special notice rules can apply. An attorney can evaluate the applicable deadline.",
    },
    {
      question: "What if my injury prevents me from working?",
      answer:
        "An attorney may evaluate documented lost income, reduced earning capacity, and other consequences of the injury, subject to applicable law and available evidence.",
    },
    {
      question: "How do I compare catastrophic injury lawyers?",
      answer:
        "Consider relevant case experience, trial preparation, resources for complex medical evidence, communication, fee arrangements, and whether the attorney handles claims similar to yours.",
    },
  ],
  relatedPages: [
    { label: "Personal Injury", path: "/el-paso-personal-injury-lawyers" },
    { label: "Brain Injury", path: "/el-paso-brain-injury-lawyers" },
    { label: "Construction Accident", path: "/el-paso-construction-accident-lawyers" },
    { label: "Truck Accident", path: "/el-paso-truck-accident-lawyers" },
    { label: "Medical Malpractice", path: "/el-paso-medical-malpractice-lawyers" },
    { label: "Wrongful Death", path: "/el-paso-wrongful-death-lawyers" },
  ],
  resourceLinks: [
    { label: "El Paso Legal Guides", path: "/guides" },
    { label: "What Evidence Matters After a Truck Accident in Texas?", path: "/guides/truck-accident-evidence-texas" },
  ],
  lastUpdated: "October 27, 2026",
};

export default function CatastrophicInjury() {
  return <PracticeAreaTemplate page={catastrophicInjuryPage} />;
}