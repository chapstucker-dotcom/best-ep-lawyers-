import PracticeAreaTemplate from "../components/PracticeAreaTemplate";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const motorcyclePage: PracticeAreaPageData = {
  path: "/el-paso-motorcycle-accident-lawyers",
  shortTitle: "Motorcycle Accident",
  title: "Best Motorcycle Accident Lawyers in El Paso, Texas",
  description: "Compare El Paso motorcycle accident attorneys for catastrophic injuries, insurance disputes, road hazards, and wrongful death claims.",
  metaDescription: "Compare motorcycle accident lawyers in El Paso.",
  heroText: "Compare El Paso motorcycle accident attorneys for serious injury claims.",
  topics: ["Helmet Laws","Road Hazards","Brain Injuries","Spinal Cord Injuries","Wrongful Death"],
  overview: [
    "Motorcycle crashes often cause severe injuries because riders have less protection.",
    "Evidence may include crash reports, photos, witnesses, medical records, and video.",
    "Insurance companies may dispute fault or damages.",
    "Compensation depends on the facts and available evidence."
  ],
  whenToHire: [
    "Serious injuries.","Fault is disputed.","Insurance delays.","Uninsured driver.","Fatal collision."
  ],
  localContent: [
    "Serious crashes occur on I-10, Loop 375, US-54, Montana Avenue, Mesa Street, and Zaragoza Road."
  ],
  faqs: [
    {question:"Do I need a lawyer?",answer:"It depends on the injuries and insurance issues."},
    {question:"What damages may be available?",answer:"Medical expenses, lost income, and other damages allowed by law."}
  ],
  relatedPages: [
    {label:"Car Accident",path:"/el-paso-car-accident-lawyers"},
    {label:"Truck Accident",path:"/el-paso-truck-accident-lawyers"}
  ]
};

export default function MotorcycleAccident() {
  return <PracticeAreaTemplate page={motorcyclePage} />;
}