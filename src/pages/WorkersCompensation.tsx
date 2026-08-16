import PracticeAreaTemplate from "../components/PracticeAreaTemplate";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const workersCompensationPage: PracticeAreaPageData = {
  path: "/el-paso-workers-compensation-lawyers",
  shortTitle: "Workers' Compensation",
  title: "Best Workers' Compensation Lawyers in El Paso, Texas",
  description:
    "Compare El Paso workers' compensation attorneys handling workplace injuries, denied benefits, wage-loss disputes, medical treatment issues, occupational injuries, and related work injury claims.",
  metaDescription:
    "Compare workers' compensation lawyers in El Paso for workplace injuries, denied benefits, wage-loss disputes, medical treatment issues, and work injury claims.",
  heroText:
    "Compare El Paso workers' compensation attorneys helping injured employees understand benefits, treatment issues, wage-loss disputes, denied claims, and related workplace injury matters.",
  topics: [
    "Workplace Injuries",
    "Workers' Compensation Benefits",
    "Denied Claims",
    "Medical Treatment Disputes",
    "Temporary Income Benefits",
    "Impairment Benefits",
    "Lost Wages",
    "Occupational Injuries",
    "Workplace Accidents",
    "Third-Party Injury Claims",
  ],
  overview: [
    "A workers' compensation lawyer can help injured employees evaluate available benefits, understand the claims process, address disputes involving medical treatment or wage replacement, and determine whether additional claims may exist against responsible third parties.",
    "Work-related injuries may involve falls, machinery, lifting injuries, repetitive trauma, vehicle accidents, construction accidents, exposure injuries, or other incidents that occur in the course and scope of employment.",
    "Workers' compensation disputes may involve whether an injury is covered, whether medical treatment is authorized, the amount or duration of wage-loss benefits, impairment ratings, return-to-work issues, or whether a claim has been denied.",
    "Some workplace injuries may also involve third-party liability when someone other than the employer or a co-worker contributed to the accident, such as a contractor, property owner, equipment manufacturer, or negligent driver.",
  ],
  whenToHire: [
    "Your workers' compensation claim was denied or delayed.",
    "You are having difficulty obtaining authorized medical treatment.",
    "Your wage-loss or income benefits are disputed.",
    "You suffered a serious or permanent workplace injury.",
    "A third party may have contributed to your work-related injury.",
  ],
  localContent: [
    "Workers in El Paso may be injured in construction, transportation, warehousing, manufacturing, retail, healthcare, government, hospitality, and other industries throughout El Paso County.",
    "An El Paso workers' compensation attorney can help review coverage, medical records, wage information, benefit disputes, deadlines, and whether a separate third-party injury claim should be evaluated.",
  ],
  faqs: [
    {
      question: "What does workers' compensation cover?",
      answer:
        "Coverage may include authorized medical treatment and certain income or disability benefits depending on the facts, the employer's coverage, and the nature of the injury.",
    },
    {
      question: "What if my workers' compensation claim is denied?",
      answer:
        "A denial may be challenged through the applicable dispute process, and deadlines may apply. Prompt legal review can help identify the reason for denial and available options.",
    },
    {
      question: "Can I choose my own doctor?",
      answer:
        "Medical-provider rules can depend on the employer's workers' compensation network and the circumstances of the claim.",
    },
    {
      question: "Can I receive benefits if I cannot work?",
      answer:
        "Income benefits may be available in qualifying cases when a work injury causes lost wages or limits the employee's ability to work.",
    },
    {
      question: "What if a third party caused my workplace injury?",
      answer:
        "You may have a separate claim against a responsible third party depending on the facts, even when workers' compensation benefits are also involved.",
    },
    {
      question: "What evidence should I preserve?",
      answer:
        "Keep incident reports, photographs, medical records, work restrictions, wage records, employer communications, witness information, and insurance documents.",
    },
    {
      question: "What if I have a repetitive-use or occupational injury?",
      answer:
        "Some work-related injuries develop over time rather than from one accident. Coverage and proof issues may depend on the medical evidence and work history.",
    },
    {
      question: "What if my employer does not carry workers' compensation insurance?",
      answer:
        "Texas employers do not all participate in the workers' compensation system. Different legal options may apply when an employer is a nonsubscriber.",
    },
    {
      question: "How long do I have to act?",
      answer:
        "Notice and filing deadlines may apply, so it is important to address a work injury promptly.",
    },
    {
      question: "When should I contact a workers' compensation lawyer?",
      answer:
        "Consider legal advice when benefits are denied or delayed, medical treatment is disputed, injuries are serious, or there may be a separate third-party claim.",
    },
  ],
  relatedPages: [
    { label: "Construction Accident", path: "/el-paso-construction-accident-lawyers" },
    { label: "Personal Injury", path: "/el-paso-personal-injury-lawyers" },
    { label: "Employment Law", path: "/el-paso-employment-lawyers" },
    { label: "Wrongful Death", path: "/el-paso-wrongful-death-lawyers" },
  ],
};

export default function WorkersCompensation() {
  return <PracticeAreaTemplate page={workersCompensationPage} />;
}