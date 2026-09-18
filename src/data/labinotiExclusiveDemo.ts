import type { AttorneyProfile } from "./attorneyTypes";

export const LABINOTI_DEMO_FIRM_ID = "labinoti-law-firm";

export const labinotiExclusiveFirm = {
  id: LABINOTI_DEMO_FIRM_ID,
  user_id: "",
  name: "Labinoti Law Firm",
  description:
    "Labinoti Law Firm is an El Paso personal injury law firm representing people injured in serious accidents and negligence matters. The firm's practice includes traumatic brain injuries, catastrophic injuries, spinal cord injuries, car and truck accidents, workplace and oilfield injuries, premises liability, medical malpractice, and wrongful death. The firm states that Daniela Labinoti founded the practice in 2010 and personally directs trial strategy. Labinoti Law Firm represents clients in Texas and New Mexico and offers free consultations.",
  phone: "(915) 201-0132",
  website: "https://www.labinotilaw.com/",
  address: "707 Myrtle Ave",
  city: "El Paso",
  state: "TX",
  zip_code: "79901",
  office_hours:
    "Contact the firm for current office hours and consultation availability",
  languages: ["English", "Spanish"],
  specialties: [
    "Traumatic Brain Injury",
    "Catastrophic Injury",
    "Personal Injury",
    "Spinal Cord Injury",
    "Car Accidents",
    "Truck Accidents",
    "Workplace Injuries",
    "Oilfield Injuries",
    "Premises Liability",
    "Medical Malpractice",
    "Wrongful Death",
  ],
  categories: ["Personal Injury"],
  category: "Personal Injury",
  plan: "category_exclusive",
  plan_key: "category_exclusive",
  is_featured: false,
  featured: false,
  exclusive: true,
  is_verified: false,
  verified: false,
  google_maps_url:
    "https://www.google.com/maps/search/?api=1&query=707+Myrtle+Ave%2C+El+Paso%2C+TX+79901",
  created_at: "2026-09-18T00:00:00.000Z",
  updated_at: "2026-09-18T00:00:00.000Z",
} as const;

export const labinotiExclusiveAttorneys: AttorneyProfile[] = [
  {
    id: "daniela-labinoti-attorney",
    firm_id: LABINOTI_DEMO_FIRM_ID,
    name: "Daniela Labinoti",
    title: "Founder | Traumatic Brain Injury & Catastrophic Injury Attorney",
    photo_url: "/attorneys/daniela-labinoti.webp",
    bio:
      "Daniela Labinoti is the founder of Labinoti Law Firm and a trial attorney representing injured clients in Texas and New Mexico. The firm states that she personally directs trial strategy and has extensive courtroom experience. Her practice includes traumatic brain injury, catastrophic injury, spinal cord injury, serious accident, workplace injury, medical malpractice, and wrongful death matters. She earned her bachelor's degree in Accounting from Lubbock Christian University in 2002 and her J.D. from Texas Tech University School of Law in 2005.",
    specialties: [
      "Traumatic Brain Injury",
      "Catastrophic Injury",
      "Personal Injury",
      "Spinal Cord Injury",
      "Serious Accidents",
      "Workplace Injuries",
      "Medical Malpractice",
      "Wrongful Death",
    ],
    education: [
      "J.D., Texas Tech University School of Law, 2005",
      "B.S., Accounting, Lubbock Christian University, 2002",
    ],
    bar_admissions: [
      "Texas",
      "New Mexico",
      "U.S. District Court, Western District of Texas",
      "U.S. District Court, District of New Mexico",
    ],
    languages: ["English", "Spanish"],
    consultation_url: "https://www.labinotilaw.com/contact-us/",
    phone: "(915) 201-0132",
    display_order: 1,
    is_active: true,
    created_at: "2026-09-18T00:00:00.000Z",
    updated_at: "2026-09-18T00:00:00.000Z",
  },
];
