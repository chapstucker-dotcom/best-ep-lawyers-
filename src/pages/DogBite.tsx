import PracticeAreaTemplate from "../components/PracticeAreaTemplate";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

const dogBitePage: PracticeAreaPageData = {
  path: "/el-paso-dog-bite-lawyers",
  shortTitle: "Dog Bite",
  title: "Best Dog Bite Lawyers in El Paso, Texas",
  description:
    "Compare El Paso dog bite attorneys handling serious injuries, facial scarring, nerve damage, infections, child injuries, dangerous-dog claims, and wrongful death cases.",
  metaDescription:
    "Compare dog bite lawyers in El Paso for serious injuries, facial scarring, infections, child injuries, dangerous-dog claims, and wrongful death.",
  heroText:
    "Compare El Paso dog bite attorneys for serious injuries, facial scarring, infections, child injuries, and dangerous-dog claims.",
  topics: [
    "Child Dog Bite Injuries",
    "Facial Scarring",
    "Nerve Damage",
    "Infections",
    "Dangerous Dogs",
    "Apartment Complex Attacks",
    "Neighborhood Attacks",
    "Owner Negligence",
    "Serious Injuries",
    "Wrongful Death",
  ],
  overview: [
    "A dog bite lawyer represents people injured by dogs when an owner, keeper, property manager, landlord, or another responsible party may be legally liable.",
    "Dog attacks can cause puncture wounds, torn tissue, infections, nerve damage, broken bones, facial injuries, permanent scarring, psychological trauma, and death.",
    "Important evidence may include photographs, medical records, animal-control reports, vaccination records, witness statements, prior complaints, lease documents, property records, and communications with the owner or insurer.",
    "The outcome of a claim depends on the facts, including the dog's history, the owner's knowledge, control of the property, warnings, local ordinances, and the circumstances of the attack.",
  ],
  whenToHire: [
    "The bite caused emergency treatment, surgery, infection, scarring, nerve damage, or permanent impairment.",
    "A child was injured by a dog.",
    "The dog had previously shown aggression or attacked someone.",
    "The owner, landlord, property manager, or insurer disputes responsibility.",
    "The attack occurred at an apartment complex, rental property, business, or public location.",
    "A loved one died because of a dog attack.",
  ],
  localContent: [
    "Dog bite claims in El Paso may involve neighborhood attacks, apartment complexes, rental properties, parks, businesses, and other locations throughout El Paso County.",
    "An El Paso dog bite attorney can help identify responsible parties, obtain animal-control records, preserve photographs and witness information, evaluate insurance coverage, and document medical and emotional harm.",
  ],
  faqs: [
    {
      question: "Who may be responsible for a dog bite?",
      answer:
        "Depending on the facts, responsibility may involve the dog owner, keeper, landlord, property manager, business, or another person who controlled the animal or property.",
    },
    {
      question: "What evidence should I preserve?",
      answer:
        "Preserve photographs of the injuries and location, medical records, witness information, animal-control reports, communications, damaged clothing, and insurance information.",
    },
    {
      question: "What if the dog never bit anyone before?",
      answer:
        "A prior bite is not always required. Responsibility may depend on the dog's behavior, the owner's knowledge, negligence, control, and other facts.",
    },
    {
      question: "Can a child bring a dog bite claim?",
      answer:
        "Yes. A parent or legal representative may pursue a claim for an injured child.",
    },
    {
      question: "What damages may be available?",
      answer:
        "Depending on the facts, damages may include medical expenses, future treatment, lost income, pain, impairment, scarring, disfigurement, and emotional harm.",
    },
    {
      question: "What if the attack happened at an apartment complex?",
      answer:
        "The dog owner, landlord, or property manager may be involved depending on notice, control, lease terms, and the circumstances.",
    },
    {
      question: "Should I report the attack?",
      answer:
        "Reporting the incident to appropriate local authorities may help document the attack and address vaccination or public-safety concerns.",
    },
    {
      question: "How long do I have to file?",
      answer:
        "Texas limitation periods and special rules may apply, so prompt legal review is important.",
    },
    {
      question: "How long does a dog bite case take?",
      answer:
        "Timing varies based on medical treatment, insurance coverage, liability disputes, settlement negotiations, and litigation.",
    },
    {
      question: "When should I contact a lawyer?",
      answer:
        "As soon as practical after a serious attack, especially when injuries are significant or responsibility is disputed.",
    },
  ],
  relatedPages: [
    { label: "Personal Injury", path: "/el-paso-personal-injury-lawyers" },
    { label: "Slip and Fall", path: "/el-paso-slip-and-fall-lawyers" },
    { label: "Wrongful Death", path: "/el-paso-wrongful-death-lawyers" },
    { label: "Brain Injury", path: "/el-paso-brain-injury-lawyers" },
  ],
};

export default function DogBite() {
  return <PracticeAreaTemplate page={dogBitePage} />;
}