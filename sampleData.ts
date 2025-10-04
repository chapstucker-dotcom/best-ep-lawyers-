import type { Category, Plan } from "./constants";

export type Firm = {
  id: string;
  slug: string;
  name: string;
  plan: Plan;
  categories: Category[];
  phone: string;
  email: string;
  website: string;
  photo: string;
  address: string;
  blurb: string;
  about?: string;
};

export const SAMPLE_FIRMS: Firm[] = [
  {
    id: "sun-city-legal-group",
    slug: "sun-city-legal-group",
    name: "Sun City Legal Group",
    plan: "Professional",
    categories: ["Personal Injury", "Medical Malpractice"],
    phone: "(915) 555-0142",
    email: "contact@suncitylegal.com",
    website: "https://example.com/suncity",
    photo: "https://images.unsplash.com/photo-1555375771-14b2a63968fe?q=80&w=1200&auto=format&fit=crop",
    address: "201 N Kansas St, El Paso, TX 79901",
    blurb: "Aggressive representation for accident and injury victims across El Paso County.",
    about: "Decades of experience in catastrophic injury and malpractice litigation.",
  },
  {
    id: "rio-grande-family-law",
    slug: "rio-grande-family-law",
    name: "Rio Grande Family Law",
    plan: "Basic",
    categories: ["Family Law"],
    phone: "(915) 555-0177",
    email: "info@riograndefamilylaw.com",
    website: "https://example.com/rgfl",
    photo: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?q=80&w=1200&auto=format&fit=crop",
    address: "123 East Mills Ave, El Paso, TX 79901",
    blurb: "Compassionate counsel for divorce, custody, adoption, and CPS matters.",
  },
  {
    id: "franklin-peak-defense",
    slug: "franklin-peak-defense",
    name: "Franklin Peak Defense",
    plan: "Expert",
    categories: ["Criminal Defense", "DUI / DWI"],
    phone: "(915) 555-0109",
    email: "help@franklinpeakdefense.com",
    website: "https://example.com/fpd",
    photo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    address: "500 W Overland Ave, El Paso, TX 79901",
    blurb: "Trial-tested defense attorneys focused on felonies, misdemeanors, and DWI.",
  },
  {
    id: "borderland-immigration",
    slug: "borderland-immigration",
    name: "Borderland Immigration Center",
    plan: "Free",
    categories: ["Immigration"],
    phone: "(915) 555-0114",
    email: "support@borderlandimmigration.org",
    website: "https://example.com/bic",
    photo: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1200&auto=format&fit=crop",
    address: "910 E San Antonio Ave, El Paso, TX 79901",
    blurb: "Family-based petitions, removal defense, and citizenship guidance.",
  },
  {
    id: "mesa-hills-business-law",
    slug: "mesa-hills-business-law",
    name: "Mesa Hills Business Law",
    plan: "Professional",
    categories: ["Business & Corporate", "Real Estate"],
    phone: "(915) 555-0160",
    email: "team@mesahillsbusinesslaw.com",
    website: "https://example.com/mhbl",
    photo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
    address: "7500 Viscount Blvd, El Paso, TX 79925",
    blurb: "General counsel services for startups, contracts, M&A, and property transactions.",
  },
  {
    id: "mission-trails-estates",
    slug: "mission-trails-estates",
    name: "Mission Trails Estate Lawyers",
    plan: "Basic",
    categories: ["Estate Planning & Probate"],
    phone: "(915) 555-0135",
    email: "hello@missiontrailsestates.com",
    website: "https://example.com/mte",
    photo: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
    address: "101 W Main Dr, El Paso, TX 79901",
    blurb: "Wills, trusts, special needs planning, and probate administration.",
  },
];
