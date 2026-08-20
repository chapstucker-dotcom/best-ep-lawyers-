import PracticeAreaTemplate from "../components/PracticeAreaTemplate";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const drunkDrivingAccidentPage: PracticeAreaPageData = {
  path: "/el-paso-drunk-driving-accident-lawyers",
  shortTitle: "Drunk Driving Accident",
  title: "Best Drunk Driving Accident Lawyers in El Paso, Texas",
  description:
    "Compare El Paso drunk driving accident attorneys handling crashes caused by impaired drivers, serious injuries, insurance claims, wrongful death, and related liability issues.",
  metaDescription:
    "Compare drunk driving accident lawyers in El Paso for impaired-driver crashes, serious injuries, insurance claims, and wrongful death cases.",
  heroText:
    "Compare El Paso attorneys representing people injured or families affected by crashes involving drunk or impaired drivers.",

  topics: [
    "Drunk Driving Crashes",
    "DWI Accident Claims",
    "Impaired Drivers",
    "Serious Injuries",
    "Wrongful Death",
    "Insurance Claims",
    "Hit-and-Run Accidents",
    "Punitive Damages",
    "Passenger Injuries",
    "Accident Investigations",
  ],

  overview: [
    "A drunk driving accident lawyer represents people injured in crashes caused by drivers allegedly impaired by alcohol or drugs.",
    "These cases can involve both the ordinary damages associated with motor vehicle collisions and additional issues concerning the impaired driver's conduct.",
    "Important evidence may include police reports, DWI investigation records, blood or breath test results, photographs, video, witness statements, medical records, vehicle data, and insurance information.",
    "Depending on the circumstances, attorneys may also investigate whether additional parties could bear responsibility for the crash.",
  ],

  whenToHire: [
    "You were injured in a collision involving a suspected drunk or impaired driver.",
    "The crash resulted in hospitalization, surgery, permanent injury, or substantial medical treatment.",
    "The impaired driver was arrested or cited after the accident.",
    "There is a dispute concerning insurance coverage, fault, or the value of the claim.",
    "A family member died in a crash involving an allegedly impaired driver.",
  ],

  localContent: [
    "Drunk driving accidents in El Paso may occur on I-10, Loop 375, US-54, major city streets, and roadways throughout El Paso County.",
    "An El Paso attorney can help preserve evidence, investigate the impaired driver's conduct, identify available insurance coverage, document damages, and determine whether additional claims may exist.",
  ],

  faqs: [
    {
      question: "Can I sue a drunk driver who caused my accident?",
      answer:
        "An injured person may have a civil claim against an impaired driver when the driver's negligence caused the collision and resulting damages.",
    },
    {
      question: "Does a DWI arrest automatically prove my civil case?",
      answer:
        "Not necessarily. A criminal DWI case and a civil injury claim are separate proceedings, although evidence from the DWI investigation may be important.",
    },
    {
      question: "What evidence is important after a drunk driving accident?",
      answer:
        "Police reports, photographs, video, witness information, DWI investigation records, medical records, vehicle information, and insurance documents may all be important.",
    },
    {
      question: "Can punitive damages be available?",
      answer:
        "Depending on the facts and applicable Texas law, exemplary or punitive damages may be an issue in some cases involving particularly serious misconduct.",
    },
    {
      question: "What damages may I recover?",
      answer:
        "Depending on the case, damages may include medical expenses, lost income, reduced earning capacity, pain, impairment, property damage, and future losses.",
    },
    {
      question: "What if the drunk driver does not have enough insurance?",
      answer:
        "Other insurance coverage, including uninsured or underinsured motorist coverage, may potentially apply depending on the policies and circumstances.",
    },
    {
      question: "Can passengers bring claims?",
      answer:
        "Passengers injured because of another person's negligence may have claims depending on the circumstances of the crash.",
    },
    {
      question: "Can a family bring a wrongful death claim?",
      answer:
        "Eligible family members may have wrongful death and survival claims when an impaired-driving collision causes a death.",
    },
    {
      question: "How long do I have to file a claim?",
      answer:
        "Texas limitation periods and other deadlines may apply, making prompt investigation important.",
    },
    {
      question: "When should I contact a lawyer?",
      answer:
        "Prompt legal review can be useful after a serious impaired-driving collision because evidence and records should be preserved as early as possible.",
    },
  ],

  relatedPages: [
    { label: "Car Accident", path: "/el-paso-car-accident-lawyers" },
    { label: "Uninsured Motorist", path: "/el-paso-uninsured-motorist-lawyers" },
    { label: "Wrongful Death", path: "/el-paso-wrongful-death-lawyers" },
    { label: "Personal Injury", path: "/el-paso-personal-injury-lawyers" },
  ],
};

export default function DrunkDrivingAccident() {
  return <PracticeAreaTemplate page={drunkDrivingAccidentPage} />;
}