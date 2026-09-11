import type { AttorneyProfile } from "./attorneyTypes";

export const HICKS_DEMO_FIRM_ID = "bill-d-hicks";

export const hicksExclusiveFirm = {
  id: HICKS_DEMO_FIRM_ID,
  user_id: "",
  name: "The Law Offices of Bill D. Hicks P.C.",
  description:
    "The Law Offices of Bill D. Hicks P.C. is an El Paso practice focused on civil litigation and injury cases. Bill D. Hicks is a former Judge of the 243rd State District Court and former District Attorney of the 34th Judicial District. His firm states that he has more than 27 years in the legal field and more than 125 jury trials of experience. The practice handles injury matters including auto accidents, premises liability, product liability, slip-and-fall matters, and construction and industrial accidents. The firm states that consultations are free on injury cases.",
  phone: "(915) 990-2440",
  website: "https://billhickslaw.com/",
  logo_url: "/attorneys/bill-hicks-logo.png",
  linkedin_url: "https://www.linkedin.com/in/bill-hicks-67058541/",
  facebook_url: "https://www.facebook.com/BillHicksLaw",
  instagram_url: "https://www.instagram.com/bill_d_hicks_attorney/",
  google_maps_url: "https://www.google.com/maps/search/?api=1&query=1731+Montana+Ave%2C+El+Paso%2C+TX+79902",
  address: "1731 Montana Ave.",
  city: "El Paso",
  state: "TX",
  zip_code: "79902",
  office_hours: "Monday-Friday: 9:00 AM-5:30 PM\nSaturday-Sunday: Closed",
  languages: ["English", "Spanish"],
  gallery_urls: [
    "/attorneys/bill-hicks-office.jpg",
    "/attorneys/bill-hicks-2023.jpg",
    "/attorneys/bill-hicks-press-conference.jpg",
  ],
  specialties: [
    "Personal Injury",
    "Civil Litigation",
    "Auto Accidents",
    "Premises Liability",
    "Product Liability",
    "Slip and Fall",
    "Construction & Industrial Accidents",
  ],
  categories: ["Personal Injury", "Civil Litigation"],
  category: "Personal Injury",
  plan: "category_exclusive",
  plan_key: "category_exclusive",
  is_featured: false,
  featured: false,
  exclusive: true,
  is_verified: false,
  verified: false,
  video_url: "https://vimeo.com/475455474",
  years_experience: 27,
  awards: [
    "National Association of Distinguished Counsel — Top One Percent of Attorneys (as listed by the firm)",
    "AVVO — Superb 10 Rated (as listed by the firm)",
    "National Trial Lawyers — Top 100 Trial Lawyers, 2018–present (as listed by the firm)",
    "Expertise — Best Personal Injury Attorneys in El Paso (as listed by the firm)",
    "Rotary Club of El Paso — Presidential Citation Award and Paul Harris Fellow (as listed by the firm)",
    "Downtown Lions Club of El Paso — Melvin Jones Fellowship (as listed by the firm)",
  ],
  created_at: "2026-09-11T00:00:00.000Z",
  updated_at: "2026-09-11T00:00:00.000Z",
} as const;

export const hicksExclusiveAttorneys: AttorneyProfile[] = [
  {
    id: "bill-d-hicks-attorney",
    firm_id: HICKS_DEMO_FIRM_ID,
    name: "Bill D. Hicks",
    title:
      "Attorney | Former State District Judge | Former District Attorney",
    photo_url: "/attorneys/bill-hicks-headshot.jpg",
    linkedin_url: "https://www.linkedin.com/in/bill-hicks-67058541/",
    bio:
      "Bill D. Hicks has practiced law in Texas since 1997. His background includes more than twelve years as an Assistant District Attorney, service as a Special Assistant United States Attorney, appointment as Judge of the 243rd State District Court, and service as District Attorney of the 34th Judicial District. He returned to private practice in 2025 with a focus on civil litigation and injury cases.",
    specialties: [
      "Personal Injury",
      "Civil Litigation",
      "Auto Accidents",
      "Premises Liability",
      "Product Liability",
      "Construction & Industrial Accidents",
    ],
    education: [
      "J.D., Texas Tech School of Law, 1997",
      "B.S., Texas A&M University, 1994",
    ],
    bar_admissions: [
      "Texas, 1997",
      "U.S. District Court, Western District of Texas, 2001",
    ],
    bar_number: "24002277",
    years_experience: 27,
    awards: [
      "National Association of Distinguished Counsel — Top One Percent of Attorneys (as listed by the firm)",
      "AVVO — Superb 10 Rated (as listed by the firm)",
      "National Trial Lawyers — Top 100 Trial Lawyers, 2018–present (as listed by the firm)",
    ],
    phone: "(915) 990-2440",
    display_order: 1,
    is_active: true,
    created_at: "2026-09-11T00:00:00.000Z",
    updated_at: "2026-09-11T00:00:00.000Z",
  },
];
