import PracticeAreaTemplate from "../components/PracticeAreaTemplate";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const rideshareAccidentPage: PracticeAreaPageData = {
  path: "/el-paso-rideshare-accident-lawyers",
  shortTitle: "Rideshare Accident",
  title: "Best Rideshare Accident Lawyers in El Paso, Texas",

  description:
    "Compare El Paso rideshare accident lawyers handling Uber, Lyft, passenger injuries, driver accidents, pedestrian crashes, insurance disputes, serious injuries, and wrongful death claims.",

  metaDescription:
    "Compare rideshare accident lawyers in El Paso for Uber and Lyft crashes, passenger injuries, insurance disputes, serious injuries, and wrongful death claims.",

  heroText:
    "Compare El Paso attorneys handling Uber, Lyft, and other rideshare accident claims involving injured passengers, drivers, pedestrians, and other motorists.",

  topics: [
    "Uber Accidents",
    "Lyft Accidents",
    "Passenger Injuries",
    "Rideshare Driver Accidents",
    "Pedestrian Accidents",
    "Rideshare Insurance Claims",
    "Uninsured and Underinsured Drivers",
    "Serious Injuries",
    "Brain Injuries",
    "Wrongful Death",
  ],

  overview: [
    "Rideshare accident claims can involve additional insurance and liability questions because drivers may be using platforms such as Uber or Lyft when a collision occurs.",

    "The insurance coverage potentially available may depend on what the rideshare driver was doing at the time of the accident, including whether the driver was logged into the app, waiting for a ride request, traveling to pick up a passenger, or transporting a passenger.",

    "Potentially important evidence may include police reports, photographs, video, witness statements, rideshare app records, trip information, insurance policies, medical records, vehicle damage, and electronic communications.",

    "An attorney can investigate the collision, identify potentially responsible parties and insurance coverage, document damages, and communicate with insurers regarding the claim.",
  ],

  whenToHire: [
    "You were injured while riding as an Uber or Lyft passenger.",
    "A rideshare driver caused or contributed to your accident.",
    "You were a pedestrian or cyclist struck by a rideshare vehicle.",
    "There is a dispute about which insurance policy applies.",
    "The accident resulted in hospitalization, surgery, significant lost income, permanent impairment, or future medical needs.",
    "A family member died in a rideshare-related collision.",
  ],

  localContent: [
    "Rideshare vehicles operate throughout El Paso, including Downtown, the airport area, UTEP, entertainment districts, shopping areas, major highways, and residential neighborhoods.",

    "An El Paso rideshare accident lawyer can investigate the crash, obtain available trip and insurance information, evaluate liability, preserve evidence, and pursue compensation from responsible parties and insurers.",
  ],

  faqs: [
    {
      question: "Who pays if an Uber or Lyft driver causes an accident?",
      answer:
        "Potential coverage depends on the circumstances of the accident, the driver's status on the rideshare platform, applicable insurance policies, and who was responsible for the collision.",
    },
    {
      question: "What if I was injured while riding as a passenger?",
      answer:
        "An injured rideshare passenger may have claims involving the rideshare driver, another driver, and potentially applicable insurance coverage depending on the facts.",
    },
    {
      question: "Does Uber or Lyft provide insurance coverage?",
      answer:
        "Rideshare companies may provide insurance coverage in certain circumstances, but the amount and type of coverage can depend on the driver's activity within the app when the accident occurred.",
    },
    {
      question: "What if another driver caused the accident?",
      answer:
        "Claims may be pursued against the responsible driver and applicable insurance policies. Other coverage may also become relevant depending on the circumstances.",
    },
    {
      question: "What evidence should I preserve?",
      answer:
        "Preserve photographs, video, witness information, police reports, rideshare receipts or trip records, screenshots, insurance information, medical records, and communications related to the accident.",
    },
    {
      question: "What damages may be available?",
      answer:
        "Depending on the facts, damages may include medical expenses, lost income, reduced earning capacity, pain, impairment, property damage, and future care.",
    },
    {
      question: "What if the rideshare driver was not carrying a passenger?",
      answer:
        "Insurance coverage may depend on whether the driver was logged into the rideshare app and whether the driver was waiting for, traveling to, or completing a ride.",
    },
    {
      question: "Can pedestrians bring rideshare accident claims?",
      answer:
        "Yes. A pedestrian injured by a rideshare vehicle may have a claim against responsible parties and applicable insurers.",
    },
    {
      question: "Can a family bring a wrongful death claim?",
      answer:
        "Eligible family members may have wrongful death and survival claims depending on the circumstances.",
    },
    {
      question: "When should I contact a lawyer?",
      answer:
        "Prompt legal review can be important after a serious rideshare accident because electronic records, trip information, video, witness evidence, and other information may need to be preserved.",
    },
  ],

  relatedPages: [
    {
      label: "Car Accident",
      path: "/el-paso-car-accident-lawyers",
    },
    {
      label: "Pedestrian Accident",
      path: "/el-paso-pedestrian-accident-lawyers",
    },
    {
      label: "Brain Injury",
      path: "/el-paso-brain-injury-lawyers",
    },
    {
      label: "Wrongful Death",
      path: "/el-paso-wrongful-death-lawyers",
    },
  ],
};

export default function RideshareAccident() {
  return <PracticeAreaTemplate page={rideshareAccidentPage} />;
}