export type PracticeAreaGroup =
  | "Personal Injury"
  | "Criminal Defense"
  | "Family Law"
  | "Immigration"
  | "Business & Corporate"
  | "Estate Planning & Probate"
  | "Employment"
  | "Real Estate & Construction"
  | "Bankruptcy & Finance"
  | "Civil Litigation"
  | "Government Benefits"
  | "Specialized Law";

export interface PracticeArea {
  id: string;
  slug: string;
  title: string;
  category: PracticeAreaGroup;
  description?: string;
  featured?: boolean;
}

/**
 * Master practice-area list.
 *
 * Use the slug as the stored database value.
 * Use the title whenever the value is displayed publicly.
 */
export const categories: PracticeArea[] = [
  /*
   * Personal Injury
   */
  {
    id: "personal-injury",
    slug: "personal-injury",
    title: "Personal Injury",
    category: "Personal Injury",
    featured: true,
  },
  {
    id: "car-accidents",
    slug: "car-accidents",
    title: "Car Accidents",
    category: "Personal Injury",
    featured: true,
  },
  {
    id: "truck-accidents",
    slug: "truck-accidents",
    title: "Truck Accidents",
    category: "Personal Injury",
    featured: true,
  },
  {
    id: "motorcycle-accidents",
    slug: "motorcycle-accidents",
    title: "Motorcycle Accidents",
    category: "Personal Injury",
  },
  {
    id: "bicycle-accidents",
    slug: "bicycle-accidents",
    title: "Bicycle Accidents",
    category: "Personal Injury",
  },
  {
    id: "pedestrian-accidents",
    slug: "pedestrian-accidents",
    title: "Pedestrian Accidents",
    category: "Personal Injury",
  },
  {
    id: "rideshare-accidents",
    slug: "rideshare-accidents",
    title: "Rideshare Accidents",
    category: "Personal Injury",
  },
  {
    id: "slip-and-fall",
    slug: "slip-and-fall",
    title: "Slip and Fall",
    category: "Personal Injury",
  },
  {
    id: "premises-liability",
    slug: "premises-liability",
    title: "Premises Liability",
    category: "Personal Injury",
  },
  {
    id: "medical-malpractice",
    slug: "medical-malpractice",
    title: "Medical Malpractice",
    category: "Personal Injury",
  },
  {
    id: "nursing-home-abuse",
    slug: "nursing-home-abuse",
    title: "Nursing Home Abuse",
    category: "Personal Injury",
  },
  {
    id: "product-liability",
    slug: "product-liability",
    title: "Product Liability",
    category: "Personal Injury",
  },
  {
    id: "wrongful-death",
    slug: "wrongful-death",
    title: "Wrongful Death",
    category: "Personal Injury",
    featured: true,
  },
  {
    id: "catastrophic-injury",
    slug: "catastrophic-injury",
    title: "Catastrophic Injury",
    category: "Personal Injury",
  },
  {
    id: "brain-injury",
    slug: "brain-injury",
    title: "Brain Injury",
    category: "Personal Injury",
  },
  {
    id: "spinal-cord-injury",
    slug: "spinal-cord-injury",
    title: "Spinal Cord Injury",
    category: "Personal Injury",
  },
  {
    id: "dog-bites",
    slug: "dog-bites",
    title: "Dog Bites",
    category: "Personal Injury",
  },

  /*
   * Criminal Defense
   */
  {
    id: "criminal-defense",
    slug: "criminal-defense",
    title: "Criminal Defense",
    category: "Criminal Defense",
    featured: true,
  },
  {
    id: "criminal-law",
    slug: "criminal-law",
    title: "Criminal Law",
    category: "Criminal Defense",
  },
  {
    id: "dwi-dui",
    slug: "dwi-dui",
    title: "DWI / DUI",
    category: "Criminal Defense",
    featured: true,
  },
  {
    id: "drug-crimes",
    slug: "drug-crimes",
    title: "Drug Crimes",
    category: "Criminal Defense",
  },
  {
    id: "assault",
    slug: "assault",
    title: "Assault",
    category: "Criminal Defense",
  },
  {
    id: "domestic-violence-defense",
    slug: "domestic-violence-defense",
    title: "Domestic Violence Defense",
    category: "Criminal Defense",
  },
  {
    id: "theft",
    slug: "theft",
    title: "Theft",
    category: "Criminal Defense",
  },
  {
    id: "sex-crimes",
    slug: "sex-crimes",
    title: "Sex Crimes",
    category: "Criminal Defense",
  },
  {
    id: "white-collar-crimes",
    slug: "white-collar-crimes",
    title: "White Collar Crimes",
    category: "Criminal Defense",
  },
  {
    id: "juvenile-defense",
    slug: "juvenile-defense",
    title: "Juvenile Defense",
    category: "Criminal Defense",
  },
  {
    id: "federal-crimes",
    slug: "federal-crimes",
    title: "Federal Crimes",
    category: "Criminal Defense",
  },
  {
    id: "expungement",
    slug: "expungement",
    title: "Expungement and Record Sealing",
    category: "Criminal Defense",
  },
  {
    id: "probation-violations",
    slug: "probation-violations",
    title: "Probation Violations",
    category: "Criminal Defense",
  },

  /*
   * Family Law
   */
  {
    id: "family-law",
    slug: "family-law",
    title: "Family Law",
    category: "Family Law",
    featured: true,
  },
  {
    id: "divorce",
    slug: "divorce",
    title: "Divorce",
    category: "Family Law",
    featured: true,
  },
  {
    id: "child-custody",
    slug: "child-custody",
    title: "Child Custody",
    category: "Family Law",
  },
  {
    id: "child-support",
    slug: "child-support",
    title: "Child Support",
    category: "Family Law",
  },
  {
    id: "adoption",
    slug: "adoption",
    title: "Adoption",
    category: "Family Law",
  },
  {
    id: "prenuptial-agreements",
    slug: "prenuptial-agreements",
    title: "Prenuptial Agreements",
    category: "Family Law",
  },
  {
    id: "protective-orders",
    slug: "protective-orders",
    title: "Protective Orders",
    category: "Family Law",
  },
  {
    id: "fathers-rights",
    slug: "fathers-rights",
    title: "Fathers’ Rights",
    category: "Family Law",
  },
  {
    id: "grandparents-rights",
    slug: "grandparents-rights",
    title: "Grandparents’ Rights",
    category: "Family Law",
  },
  {
    id: "legal-separation",
    slug: "legal-separation",
    title: "Legal Separation",
    category: "Family Law",
  },

  /*
   * Immigration
   */
  {
    id: "immigration",
    slug: "immigration",
    title: "Immigration",
    category: "Immigration",
    featured: true,
  },
  {
    id: "family-immigration",
    slug: "family-immigration",
    title: "Family Immigration",
    category: "Immigration",
  },
  {
    id: "employment-visas",
    slug: "employment-visas",
    title: "Employment Visas",
    category: "Immigration",
  },
  {
    id: "citizenship",
    slug: "citizenship",
    title: "Citizenship and Naturalization",
    category: "Immigration",
  },
  {
    id: "green-cards",
    slug: "green-cards",
    title: "Green Cards",
    category: "Immigration",
  },
  {
    id: "deportation-defense",
    slug: "deportation-defense",
    title: "Deportation Defense",
    category: "Immigration",
  },
  {
    id: "asylum",
    slug: "asylum",
    title: "Asylum",
    category: "Immigration",
  },
  {
    id: "daca",
    slug: "daca",
    title: "DACA",
    category: "Immigration",
  },
  {
    id: "investor-visas",
    slug: "investor-visas",
    title: "Investor Visas",
    category: "Immigration",
  },

  /*
   * Business and Corporate
   */
  {
    id: "business-law",
    slug: "business-law",
    title: "Business Law",
    category: "Business & Corporate",
    featured: true,
  },
  {
    id: "business-formation",
    slug: "business-formation",
    title: "Business Formation",
    category: "Business & Corporate",
  },
  {
    id: "corporate-law",
    slug: "corporate-law",
    title: "Corporate Law",
    category: "Business & Corporate",
  },
  {
    id: "contracts",
    slug: "contracts",
    title: "Contracts",
    category: "Business & Corporate",
  },
  {
    id: "commercial-transactions",
    slug: "commercial-transactions",
    title: "Commercial Transactions",
    category: "Business & Corporate",
  },
  {
    id: "commercial-litigation",
    slug: "commercial-litigation",
    title: "Commercial Litigation",
    category: "Business & Corporate",
  },
  {
    id: "mergers-and-acquisitions",
    slug: "mergers-and-acquisitions",
    title: "Mergers and Acquisitions",
    category: "Business & Corporate",
  },
  {
    id: "partnership-disputes",
    slug: "partnership-disputes",
    title: "Partnership Disputes",
    category: "Business & Corporate",
  },
  {
    id: "franchise-law",
    slug: "franchise-law",
    title: "Franchise Law",
    category: "Business & Corporate",
  },

  /*
   * Estate Planning and Probate
   */
  {
    id: "estate-planning",
    slug: "estate-planning",
    title: "Estate Planning",
    category: "Estate Planning & Probate",
    featured: true,
  },
  {
    id: "probate",
    slug: "probate",
    title: "Probate",
    category: "Estate Planning & Probate",
    featured: true,
  },
  {
    id: "wills",
    slug: "wills",
    title: "Wills",
    category: "Estate Planning & Probate",
  },
  {
    id: "trusts",
    slug: "trusts",
    title: "Trusts",
    category: "Estate Planning & Probate",
  },
  {
    id: "guardianship",
    slug: "guardianship",
    title: "Guardianship",
    category: "Estate Planning & Probate",
  },
  {
    id: "elder-law",
    slug: "elder-law",
    title: "Elder Law",
    category: "Estate Planning & Probate",
  },
  {
    id: "estate-litigation",
    slug: "estate-litigation",
    title: "Estate Litigation",
    category: "Estate Planning & Probate",
  },
  {
    id: "asset-protection",
    slug: "asset-protection",
    title: "Asset Protection",
    category: "Estate Planning & Probate",
  },

  /*
   * Employment
   */
  {
    id: "employment-law",
    slug: "employment-law",
    title: "Employment Law",
    category: "Employment",
    featured: true,
  },
  {
    id: "wrongful-termination",
    slug: "wrongful-termination",
    title: "Wrongful Termination",
    category: "Employment",
  },
  {
    id: "workplace-discrimination",
    slug: "workplace-discrimination",
    title: "Workplace Discrimination",
    category: "Employment",
  },
  {
    id: "sexual-harassment",
    slug: "sexual-harassment",
    title: "Sexual Harassment",
    category: "Employment",
  },
  {
    id: "wage-and-hour",
    slug: "wage-and-hour",
    title: "Wage and Hour",
    category: "Employment",
  },
  {
    id: "employment-contracts",
    slug: "employment-contracts",
    title: "Employment Contracts",
    category: "Employment",
  },
  {
    id: "noncompete-agreements",
    slug: "noncompete-agreements",
    title: "Noncompete Agreements",
    category: "Employment",
  },
  {
    id: "employee-benefits",
    slug: "employee-benefits",
    title: "Employee Benefits",
    category: "Employment",
  },

  /*
   * Real Estate and Construction
   */
  {
    id: "real-estate",
    slug: "real-estate",
    title: "Real Estate",
    category: "Real Estate & Construction",
    featured: true,
  },
  {
    id: "commercial-real-estate",
    slug: "commercial-real-estate",
    title: "Commercial Real Estate",
    category: "Real Estate & Construction",
  },
  {
    id: "residential-real-estate",
    slug: "residential-real-estate",
    title: "Residential Real Estate",
    category: "Real Estate & Construction",
  },
  {
    id: "landlord-tenant",
    slug: "landlord-tenant",
    title: "Landlord and Tenant",
    category: "Real Estate & Construction",
  },
  {
    id: "construction-law",
    slug: "construction-law",
    title: "Construction Law",
    category: "Real Estate & Construction",
  },
  {
    id: "property-disputes",
    slug: "property-disputes",
    title: "Property Disputes",
    category: "Real Estate & Construction",
  },
  {
    id: "zoning-and-land-use",
    slug: "zoning-and-land-use",
    title: "Zoning and Land Use",
    category: "Real Estate & Construction",
  },
  {
    id: "foreclosure",
    slug: "foreclosure",
    title: "Foreclosure",
    category: "Real Estate & Construction",
  },

  /*
   * Bankruptcy and Finance
   */
  {
    id: "bankruptcy",
    slug: "bankruptcy",
    title: "Bankruptcy",
    category: "Bankruptcy & Finance",
    featured: true,
  },
  {
    id: "chapter-7-bankruptcy",
    slug: "chapter-7-bankruptcy",
    title: "Chapter 7 Bankruptcy",
    category: "Bankruptcy & Finance",
  },
  {
    id: "chapter-13-bankruptcy",
    slug: "chapter-13-bankruptcy",
    title: "Chapter 13 Bankruptcy",
    category: "Bankruptcy & Finance",
  },
  {
    id: "business-bankruptcy",
    slug: "business-bankruptcy",
    title: "Business Bankruptcy",
    category: "Bankruptcy & Finance",
  },
  {
    id: "debt-defense",
    slug: "debt-defense",
    title: "Debt Defense",
    category: "Bankruptcy & Finance",
  },
  {
    id: "tax-law",
    slug: "tax-law",
    title: "Tax Law",
    category: "Bankruptcy & Finance",
  },
  {
    id: "tax-controversy",
    slug: "tax-controversy",
    title: "Tax Controversy",
    category: "Bankruptcy & Finance",
  },

  /*
   * Civil Litigation
   */
  {
    id: "civil-litigation",
    slug: "civil-litigation",
    title: "Civil Litigation",
    category: "Civil Litigation",
    featured: true,
  },
  {
    id: "appeals",
    slug: "appeals",
    title: "Appeals",
    category: "Civil Litigation",
  },
  {
    id: "insurance-disputes",
    slug: "insurance-disputes",
    title: "Insurance Disputes",
    category: "Civil Litigation",
  },
  {
    id: "consumer-protection",
    slug: "consumer-protection",
    title: "Consumer Protection",
    category: "Civil Litigation",
  },
  {
    id: "class-actions",
    slug: "class-actions",
    title: "Class Actions",
    category: "Civil Litigation",
  },
  {
    id: "contract-disputes",
    slug: "contract-disputes",
    title: "Contract Disputes",
    category: "Civil Litigation",
  },
  {
    id: "defamation",
    slug: "defamation",
    title: "Defamation",
    category: "Civil Litigation",
  },
  {
    id: "constitutional-law",
    slug: "constitutional-law",
    title: "Constitutional Law",
    category: "Civil Litigation",
  },

  /*
   * Government Benefits
   */
  {
    id: "social-security-disability",
    slug: "social-security-disability",
    title: "Social Security Disability",
    category: "Government Benefits",
  },
  {
    id: "veterans-benefits",
    slug: "veterans-benefits",
    title: "Veterans Benefits",
    category: "Government Benefits",
  },
  {
    id: "workers-compensation",
    slug: "workers-compensation",
    title: "Workers’ Compensation",
    category: "Government Benefits",
  },
  {
    id: "administrative-law",
    slug: "administrative-law",
    title: "Administrative Law",
    category: "Government Benefits",
  },
  {
    id: "education-law",
    slug: "education-law",
    title: "Education Law",
    category: "Government Benefits",
  },

  /*
   * Specialized Law
   */
  {
    id: "intellectual-property",
    slug: "intellectual-property",
    title: "Intellectual Property",
    category: "Specialized Law",
  },
  {
    id: "trademark-law",
    slug: "trademark-law",
    title: "Trademark Law",
    category: "Specialized Law",
  },
  {
    id: "copyright-law",
    slug: "copyright-law",
    title: "Copyright Law",
    category: "Specialized Law",
  },
  {
    id: "patent-law",
    slug: "patent-law",
    title: "Patent Law",
    category: "Specialized Law",
  },
  {
    id: "entertainment-law",
    slug: "entertainment-law",
    title: "Entertainment Law",
    category: "Specialized Law",
  },
  {
    id: "health-care-law",
    slug: "health-care-law",
    title: "Health Care Law",
    category: "Specialized Law",
  },
  {
    id: "environmental-law",
    slug: "environmental-law",
    title: "Environmental Law",
    category: "Specialized Law",
  },
  {
    id: "energy-law",
    slug: "energy-law",
    title: "Energy Law",
    category: "Specialized Law",
  },
  {
    id: "oil-and-gas",
    slug: "oil-and-gas",
    title: "Oil and Gas",
    category: "Specialized Law",
  },
  {
    id: "aviation-law",
    slug: "aviation-law",
    title: "Aviation Law",
    category: "Specialized Law",
  },
  {
    id: "maritime-law",
    slug: "maritime-law",
    title: "Maritime Law",
    category: "Specialized Law",
  },
  {
    id: "international-law",
    slug: "international-law",
    title: "International Law",
    category: "Specialized Law",
  },
  {
    id: "nonprofit-law",
    slug: "nonprofit-law",
    title: "Nonprofit Law",
    category: "Specialized Law",
  },
];

/**
 * Main category groups used for organizing the editor,
 * navigation, filters, and premium category ownership.
 */
export const practiceAreaGroups: PracticeAreaGroup[] = [
  "Personal Injury",
  "Criminal Defense",
  "Family Law",
  "Immigration",
  "Business & Corporate",
  "Estate Planning & Probate",
  "Employment",
  "Real Estate & Construction",
  "Bankruptcy & Finance",
  "Civil Litigation",
  "Government Benefits",
  "Specialized Law",
];

/**
 * Converts a saved slug or legacy title into the public display title.
 *
 * Examples:
 * criminal-law -> Criminal Law
 * family-law -> Family Law
 */
export const getPracticeAreaTitle = (value: string): string => {
  const normalizedValue = value.trim().toLowerCase();

  const category = categories.find(
    (item) =>
      item.slug.toLowerCase() === normalizedValue ||
      item.title.toLowerCase() === normalizedValue
  );

  if (category) return category.title;

  return value
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

/**
 * Finds a practice-area record from a slug or public title.
 */
export const getPracticeArea = (
  value: string
): PracticeArea | undefined => {
  const normalizedValue = value.trim().toLowerCase();

  return categories.find(
    (item) =>
      item.slug.toLowerCase() === normalizedValue ||
      item.title.toLowerCase() === normalizedValue
  );
};

/**
 * Returns all practice areas belonging to one main category.
 */
export const getPracticeAreasByGroup = (
  group: PracticeAreaGroup
): PracticeArea[] =>
  categories.filter((item) => item.category === group);

/**
 * Categories most useful on the homepage and primary navigation.
 */
export const featuredCategories = categories.filter(
  (item) => item.featured
);

/**
 * Legacy compatibility for components that expect a default export.
 */
export default categories;