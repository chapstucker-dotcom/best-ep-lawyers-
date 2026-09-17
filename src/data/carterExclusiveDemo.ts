import type { AttorneyProfile } from "./attorneyTypes";

export const CARTER_DEMO_FIRM_ID = "carter-law-firm";

export const carterExclusiveFirm = {
  id: CARTER_DEMO_FIRM_ID,
  user_id: "",
  name: "The Carter Law Firm, P.C.",
  description:
    "The Carter Law Firm, P.C. is an El Paso personal injury practice representing people injured in matters including truck and 18-wheeler accidents, car accidents, bicycle accidents, pedestrian accidents, wrongful death, slip-and-fall cases, and medical malpractice. The firm states that Thomas Carter has more than 16 years of trial experience, personally reviews new case inquiries, offers free consultations, and is available 24/7 for emergency consultations. The firm also states that Spanish-language assistance is available.",
  phone: "(915) 621-1818",
  email: "office@carterlawwins.com",
  website: "https://www.carterlawwins.com/",
  address: "124 W. Castellano Drive, Unit 103",
  city: "El Paso",
  state: "TX",
  zip_code: "79912",
  office_hours: "Available 24/7 for emergency consultations",
  languages: ["English", "Spanish"],
  specialties: [
    "Personal Injury",
    "Truck Accidents",
    "Car Accidents",
    "Bicycle Accidents",
    "Pedestrian Accidents",
    "Wrongful Death",
    "Slip and Fall",
    "Medical Malpractice",
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
  years_experience: 16,
  google_maps_url:
    "https://www.google.com/maps/search/?api=1&query=124+W.+Castellano+Drive%2C+Unit+103%2C+El+Paso%2C+TX+79912",
  created_at: "2026-09-17T00:00:00.000Z",
  updated_at: "2026-09-17T00:00:00.000Z",
} as const;

export const carterExclusiveAttorneys: AttorneyProfile[] = [
  {
    id: "thomas-carter-attorney",
    firm_id: CARTER_DEMO_FIRM_ID,
    name: "Thomas Carter",
    title: "Attorney | Personal Injury Trial Lawyer",
    bio:
      "Thomas Carter represents injured clients in El Paso and handles personal injury matters including truck and 18-wheeler accidents, car accidents, bicycle accidents, pedestrian accidents, wrongful death, slip-and-fall cases, and medical malpractice. The firm states that he has more than 16 years of trial experience and personally reviews every new case inquiry.",
    specialties: [
      "Personal Injury",
      "Truck Accidents",
      "Car Accidents",
      "Bicycle Accidents",
      "Pedestrian Accidents",
      "Wrongful Death",
      "Slip and Fall",
      "Medical Malpractice",
    ],
    bar_number: "24066917",
    years_experience: 16,
    languages: ["English", "Spanish"],
    email: "office@carterlawwins.com",
    phone: "(915) 621-1818",
    display_order: 1,
    is_active: true,
    created_at: "2026-09-17T00:00:00.000Z",
    updated_at: "2026-09-17T00:00:00.000Z",
  },
];
