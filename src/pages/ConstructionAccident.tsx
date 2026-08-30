import PracticeAreaTemplate from "../components/PracticeAreaTemplate";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const constructionAccidentPage: PracticeAreaPageData = {
  path: "/el-paso-construction-accident-lawyers",
  shortTitle: "Construction Accident",
  title: "Best Construction Accident Lawyers in El Paso, Texas",
  description:
    "Compare El Paso construction accident attorneys handling falls, equipment injuries, electrocution, unsafe worksites, contractor negligence, serious injuries, and wrongful death claims.",
  metaDescription:
    "Compare construction accident lawyers in El Paso for falls, equipment injuries, unsafe worksites, contractor negligence, and wrongful death claims.",
  heroText:
    "Compare El Paso construction accident attorneys for falls, equipment injuries, unsafe worksites, serious injuries, and wrongful death claims.",

  topics: [
    "Falls from Heights",
    "Scaffolding Accidents",
    "Equipment Injuries",
    "Electrocution",
    "Falling Objects",
    "Unsafe Worksites",
    "Contractor Negligence",
    "Crane Accidents",
    "Serious Injuries",
    "Wrongful Death",
  ],

  overview: [
    "A construction accident lawyer represents workers and others injured because of unsafe conditions, defective equipment, negligent contractors, dangerous work practices, or other hazards at construction and industrial worksites.",
    "Construction projects can involve general contractors, subcontractors, property owners, equipment manufacturers, rental companies, maintenance providers, staffing companies, and multiple insurers. Determining which parties controlled the work, equipment, or dangerous condition can be an important part of the investigation.",
    "Important evidence may include incident reports, photographs, video, safety records, training documents, maintenance logs, inspection records, contracts, witness statements, medical records, employment information, and communications among contractors or supervisors.",
    "Available claims may depend on workers' compensation coverage, third-party liability, defective products, premises conditions, insurance coverage, proportionate responsibility, and the full extent of the injury. Serious cases may involve medical expenses, lost income, reduced earning capacity, impairment, future treatment, and long-term care needs.",
  ],

  whenToHire: [
    "You suffered a serious injury on a construction site.",
    "The accident involved a fall, scaffolding, machinery, electricity, a crane, trench, vehicle, or falling materials.",
    "A contractor, subcontractor, property owner, equipment company, manufacturer, or another third party may share responsibility.",
    "The injury caused hospitalization, surgery, missed work, permanent limitations, reduced earning capacity, or future care needs.",
    "Important evidence such as photographs, video, equipment records, inspection records, or witness information may need to be preserved quickly.",
    "A loved one died in a construction accident.",
  ],

  localContent: [
    "Construction accident claims in El Paso may arise from residential developments, commercial projects, highway and roadway work, warehouses, industrial sites, utility projects, and other construction activity throughout El Paso County.",
    "Projects near Interstate 10, Loop 375, U.S. Highway 54, major commercial corridors, expanding residential areas, and industrial or logistics facilities may involve multiple contractors and layers of responsibility. The location of the project and the entities controlling the work can affect what records and insurance policies should be investigated.",
    "Construction accidents can involve falls from roofs or scaffolds, falling materials, forklifts and heavy equipment, cranes, electrical hazards, trench or excavation incidents, defective tools, unsafe walking surfaces, and collisions involving work vehicles.",
    "An El Paso construction accident attorney can help identify potentially responsible parties, preserve site and equipment evidence, review safety and maintenance records, evaluate workers' compensation and third-party issues, document injuries and lost income, and determine whether additional insurance coverage may apply.",
    "Because worksites can change quickly after an accident, photographs, surveillance footage, equipment condition, witness information, inspection records, and other evidence may be altered or lost. Early preservation can be especially important when several companies were working at the site.",
  ],

  faqs: [
    {
      question: "Can I bring a claim if I receive workers' compensation?",
      answer:
        "You may still have a claim against a responsible third party depending on the facts.",
    },
    {
      question: "Who may be responsible for a construction accident?",
      answer:
        "Potentially responsible parties may include contractors, subcontractors, property owners, equipment companies, manufacturers, and others.",
    },
    {
      question: "What evidence should be preserved?",
      answer:
        "Preserve photographs, video, witness information, incident reports, safety records, medical records, employment records, and communications.",
    },
    {
      question: "What damages may be available?",
      answer:
        "Depending on the facts, damages may include medical expenses, lost income, reduced earning capacity, pain, impairment, and future care.",
    },
    {
      question: "What if defective equipment caused the accident?",
      answer:
        "The manufacturer, seller, rental company, maintenance company, or another party may be involved.",
    },
    {
      question: "What if I was partly at fault?",
      answer:
        "Texas proportionate-responsibility rules may affect recovery depending on the facts.",
    },
    {
      question: "How long do I have to file?",
      answer:
        "Texas deadlines and notice requirements may apply, so prompt legal review is important.",
    },
    {
      question: "Can a family bring a wrongful death claim?",
      answer:
        "Eligible family members may have wrongful death and survival claims depending on the circumstances.",
    },
    {
      question: "How long does a construction accident case take?",
      answer:
        "Timing varies based on medical treatment, investigation, insurance, fault disputes, negotiations, and litigation.",
    },
    {
      question: "When should I contact a lawyer?",
      answer:
        "As soon as practical after a serious construction accident, especially when evidence may disappear.",
    },
  ],

  relatedPages: [
    { label: "Personal Injury", path: "/el-paso-personal-injury-lawyers" },
    { label: "Brain Injury", path: "/el-paso-brain-injury-lawyers" },
    { label: "Wrongful Death", path: "/el-paso-wrongful-death-lawyers" },
    { label: "Slip and Fall", path: "/el-paso-slip-and-fall-lawyers" },
    { label: "Product Liability", path: "/el-paso-product-liability-lawyers" },
    { label: "Workers' Compensation", path: "/el-paso-workers-compensation-lawyers" },
  ],

  resourceLinks: [
    {
      label: "El Paso Legal Guides",
      path: "/guides",
    },
    {
      label: "What Evidence Matters After a Truck Accident in Texas?",
      path: "/guides/truck-accident-evidence-texas",
    },
  ],

  lastUpdated: "August 29, 2026",
};

export default function ConstructionAccident() {
  return <PracticeAreaTemplate page={constructionAccidentPage} />;
}
