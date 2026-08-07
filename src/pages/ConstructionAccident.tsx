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
    "A construction accident lawyer represents workers and others injured because of unsafe conditions, defective equipment, negligent contractors, or dangerous work practices.",
    "Construction sites often involve multiple employers, contractors, subcontractors, property owners, equipment companies, and insurers.",
    "Important evidence may include incident reports, photographs, video, safety records, training documents, maintenance logs, witness statements, medical records, and employment information.",
    "Compensation may depend on workers' compensation coverage, third-party liability, insurance, fault, and the full extent of the injury.",
  ],
  whenToHire: [
    "You suffered a serious injury on a construction site.",
    "The accident involved a fall, scaffolding, machinery, electricity, a crane, or falling materials.",
    "A contractor, subcontractor, property owner, or equipment company may be responsible.",
    "The injury caused hospitalization, surgery, missed work, permanent limitations, or future care needs.",
    "A loved one died in a construction accident.",
  ],
  localContent: [
    "Construction accident claims in El Paso may involve residential, commercial, highway, industrial, and infrastructure projects throughout El Paso County.",
    "An El Paso attorney can help investigate responsibility, preserve evidence, identify insurance coverage, evaluate third-party claims, and document damages.",
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
  ],
};

export default function ConstructionAccident() {
  return <PracticeAreaTemplate page={constructionAccidentPage} />;
}