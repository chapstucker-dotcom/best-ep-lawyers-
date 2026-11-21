import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "node:crypto";

const COMMERCIAL_PRODUCTS = {
  free: {
    key: "free",
    displayName: "Free Listing",
    inventoryScope: "basic_listing",

    premium: false,
    selfServiceEligible: true,
    homepageEligible: false,

    marketPlacement: false,
    competitorLockout: false,

    placementPriority: 5,
    maxPerMarket: null,

    legacyPlanIds: ["free"],
  },

  expert: {
    key: "expert",
    displayName: "Expert",
    inventoryScope: "enhanced_profile",

    premium: false,
    selfServiceEligible: true,
    homepageEligible: false,

    marketPlacement: false,
    competitorLockout: false,

    placementPriority: 4,
    maxPerMarket: null,

    legacyPlanIds: ["expert"],
  },

  featured: {
    key: "featured",
    displayName: "Featured",
    inventoryScope: "market_featured",

    premium: true,
    selfServiceEligible: true,
    homepageEligible: true,

    marketPlacement: true,
    competitorLockout: false,

    placementPriority: 3,
    maxPerMarket: 2,

    legacyPlanIds: ["category-featured"],
  },

  premier: {
    key: "premier",
    displayName: "Premier",
    inventoryScope: "market_premier",

    premium: true,
    selfServiceEligible: false,
    homepageEligible: true,

    marketPlacement: true,
    competitorLockout: false,

    placementPriority: 2,
    maxPerMarket: 5,

    // Premier is reserved for the new scalable marketplace model.
    // No current legacy plan is silently converted into Premier.
    legacyPlanIds: [],
  },

  market_exclusive: {
    key: "market_exclusive",
    displayName: "Market Exclusive",
    inventoryScope: "market_exclusive",

    premium: true,
    selfServiceEligible: false,
    homepageEligible: true,

    marketPlacement: true,
    competitorLockout: true,

    placementPriority: 1,
    maxPerMarket: 1,

    // Preserve the current Category Exclusive meaning until pricing
    // and commercial terms are deliberately changed.
    legacyPlanIds: ["category-exclusive"],
  },
};

type CommercialProductKey = keyof typeof COMMERCIAL_PRODUCTS;
type CommercialProductDefinition =
  (typeof COMMERCIAL_PRODUCTS)[CommercialProductKey];

function normalizePlanId(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");
}

function getCommercialProductByPlanId(
  value: unknown
): CommercialProductDefinition {
  const normalized = normalizePlanId(value);

  const canonicalKey = normalized.replace(/-/g, "_") as CommercialProductKey;

  if (canonicalKey in COMMERCIAL_PRODUCTS) {
    return COMMERCIAL_PRODUCTS[canonicalKey];
  }

  if (normalized === "pro") {
    return COMMERCIAL_PRODUCTS.expert;
  }

  for (const product of Object.values(COMMERCIAL_PRODUCTS)) {
    if (
      product.legacyPlanIds.some(
        (planId) => normalizePlanId(planId) === normalized
      )
    ) {
      return product;
    }
  }

  return COMMERCIAL_PRODUCTS.free;
}

type LegalMarket = {
  key: string;
  name: string;
  slug: string;
  premiumInventory: boolean;
  homepagePriority: number;
};

const LEGAL_MARKETS: LegalMarket[] = [
  {
    key: "personal-injury",
    name: "Personal Injury",
    slug: "personal-injury",
    premiumInventory: true,
    homepagePriority: 1,
  },
  {
    key: "criminal-defense",
    name: "Criminal Defense",
    slug: "criminal-defense",
    premiumInventory: true,
    homepagePriority: 2,
  },
  {
    key: "family-law",
    name: "Family Law",
    slug: "family-law",
    premiumInventory: true,
    homepagePriority: 3,
  },
  {
    key: "immigration",
    name: "Immigration",
    slug: "immigration",
    premiumInventory: true,
    homepagePriority: 4,
  },
  {
    key: "employment",
    name: "Employment",
    slug: "employment",
    premiumInventory: true,
    homepagePriority: 5,
  },
  {
    key: "estate-planning-probate",
    name: "Estate Planning & Probate",
    slug: "estate-planning-probate",
    premiumInventory: true,
    homepagePriority: 6,
  },
  {
    key: "business-corporate",
    name: "Business & Corporate",
    slug: "business-corporate",
    premiumInventory: true,
    homepagePriority: 7,
  },
  {
    key: "real-estate-construction",
    name: "Real Estate & Construction",
    slug: "real-estate-construction",
    premiumInventory: true,
    homepagePriority: 8,
  },
  {
    key: "bankruptcy-finance",
    name: "Bankruptcy & Finance",
    slug: "bankruptcy-finance",
    premiumInventory: true,
    homepagePriority: 9,
  },
  {
    key: "civil-litigation",
    name: "Civil Litigation",
    slug: "civil-litigation",
    premiumInventory: true,
    homepagePriority: 10,
  },
  {
    key: "government-benefits",
    name: "Government Benefits",
    slug: "government-benefits",
    premiumInventory: false,
    homepagePriority: 11,
  },
  {
    key: "specialized-law",
    name: "Specialized Law",
    slug: "specialized-law",
    premiumInventory: false,
    homepagePriority: 12,
  },
];

type ServerSafePracticeArea = {
  slug: string;
  title: string;
  category: string;
};

const SERVER_SAFE_PRACTICE_AREAS: ServerSafePracticeArea[] = [
  {
    "slug": "personal-injury",
    "title": "Personal Injury",
    "category": "Personal Injury"
  },
  {
    "slug": "car-accidents",
    "title": "Car Accidents",
    "category": "Personal Injury"
  },
  {
    "slug": "truck-accidents",
    "title": "Truck Accidents",
    "category": "Personal Injury"
  },
  {
    "slug": "construction-accidents",
    "title": "Construction Accidents",
    "category": "Personal Injury"
  },
  {
    "slug": "motorcycle-accidents",
    "title": "Motorcycle Accidents",
    "category": "Personal Injury"
  },
  {
    "slug": "bicycle-accidents",
    "title": "Bicycle Accidents",
    "category": "Personal Injury"
  },
  {
    "slug": "pedestrian-accidents",
    "title": "Pedestrian Accidents",
    "category": "Personal Injury"
  },
  {
    "slug": "rideshare-accidents",
    "title": "Rideshare Accidents",
    "category": "Personal Injury"
  },
  {
    "slug": "slip-and-fall",
    "title": "Slip and Fall",
    "category": "Personal Injury"
  },
  {
    "slug": "premises-liability",
    "title": "Premises Liability",
    "category": "Personal Injury"
  },
  {
    "slug": "medical-malpractice",
    "title": "Medical Malpractice",
    "category": "Personal Injury"
  },
  {
    "slug": "nursing-home-abuse",
    "title": "Nursing Home Abuse",
    "category": "Personal Injury"
  },
  {
    "slug": "product-liability",
    "title": "Product Liability",
    "category": "Personal Injury"
  },
  {
    "slug": "wrongful-death",
    "title": "Wrongful Death",
    "category": "Personal Injury"
  },
  {
    "slug": "catastrophic-injury",
    "title": "Catastrophic Injury",
    "category": "Personal Injury"
  },
  {
    "slug": "brain-injury",
    "title": "Brain Injury",
    "category": "Personal Injury"
  },
  {
    "slug": "spinal-cord-injury",
    "title": "Spinal Cord Injury",
    "category": "Personal Injury"
  },
  {
    "slug": "dog-bites",
    "title": "Dog Bites",
    "category": "Personal Injury"
  },
  {
    "slug": "criminal-defense",
    "title": "Criminal Defense",
    "category": "Criminal Defense"
  },
  {
    "slug": "criminal-law",
    "title": "Criminal Law",
    "category": "Criminal Defense"
  },
  {
    "slug": "dwi-dui",
    "title": "DWI / DUI",
    "category": "Criminal Defense"
  },
  {
    "slug": "drug-crimes",
    "title": "Drug Crimes",
    "category": "Criminal Defense"
  },
  {
    "slug": "assault",
    "title": "Assault",
    "category": "Criminal Defense"
  },
  {
    "slug": "domestic-violence-defense",
    "title": "Domestic Violence Defense",
    "category": "Criminal Defense"
  },
  {
    "slug": "theft",
    "title": "Theft",
    "category": "Criminal Defense"
  },
  {
    "slug": "sex-crimes",
    "title": "Sex Crimes",
    "category": "Criminal Defense"
  },
  {
    "slug": "white-collar-crimes",
    "title": "White Collar Crimes",
    "category": "Criminal Defense"
  },
  {
    "slug": "juvenile-defense",
    "title": "Juvenile Defense",
    "category": "Criminal Defense"
  },
  {
    "slug": "federal-crimes",
    "title": "Federal Crimes",
    "category": "Criminal Defense"
  },
  {
    "slug": "expungement",
    "title": "Expungement and Record Sealing",
    "category": "Criminal Defense"
  },
  {
    "slug": "probation-violations",
    "title": "Probation Violations",
    "category": "Criminal Defense"
  },
  {
    "slug": "family-law",
    "title": "Family Law",
    "category": "Family Law"
  },
  {
    "slug": "divorce",
    "title": "Divorce",
    "category": "Family Law"
  },
  {
    "slug": "child-custody",
    "title": "Child Custody",
    "category": "Family Law"
  },
  {
    "slug": "child-support",
    "title": "Child Support",
    "category": "Family Law"
  },
  {
    "slug": "adoption",
    "title": "Adoption",
    "category": "Family Law"
  },
  {
    "slug": "prenuptial-agreements",
    "title": "Prenuptial Agreements",
    "category": "Family Law"
  },
  {
    "slug": "protective-orders",
    "title": "Protective Orders",
    "category": "Family Law"
  },
  {
    "slug": "fathers-rights",
    "title": "Fathers’ Rights",
    "category": "Family Law"
  },
  {
    "slug": "grandparents-rights",
    "title": "Grandparents’ Rights",
    "category": "Family Law"
  },
  {
    "slug": "legal-separation",
    "title": "Legal Separation",
    "category": "Family Law"
  },
  {
    "slug": "immigration",
    "title": "Immigration",
    "category": "Immigration"
  },
  {
    "slug": "family-immigration",
    "title": "Family Immigration",
    "category": "Immigration"
  },
  {
    "slug": "employment-visas",
    "title": "Employment Visas",
    "category": "Immigration"
  },
  {
    "slug": "citizenship",
    "title": "Citizenship and Naturalization",
    "category": "Immigration"
  },
  {
    "slug": "green-cards",
    "title": "Green Cards",
    "category": "Immigration"
  },
  {
    "slug": "deportation-defense",
    "title": "Deportation Defense",
    "category": "Immigration"
  },
  {
    "slug": "asylum",
    "title": "Asylum",
    "category": "Immigration"
  },
  {
    "slug": "daca",
    "title": "DACA",
    "category": "Immigration"
  },
  {
    "slug": "investor-visas",
    "title": "Investor Visas",
    "category": "Immigration"
  },
  {
    "slug": "business-law",
    "title": "Business Law",
    "category": "Business & Corporate"
  },
  {
    "slug": "business-formation",
    "title": "Business Formation",
    "category": "Business & Corporate"
  },
  {
    "slug": "corporate-law",
    "title": "Corporate Law",
    "category": "Business & Corporate"
  },
  {
    "slug": "contracts",
    "title": "Contracts",
    "category": "Business & Corporate"
  },
  {
    "slug": "commercial-transactions",
    "title": "Commercial Transactions",
    "category": "Business & Corporate"
  },
  {
    "slug": "commercial-litigation",
    "title": "Commercial Litigation",
    "category": "Business & Corporate"
  },
  {
    "slug": "mergers-and-acquisitions",
    "title": "Mergers and Acquisitions",
    "category": "Business & Corporate"
  },
  {
    "slug": "partnership-disputes",
    "title": "Partnership Disputes",
    "category": "Business & Corporate"
  },
  {
    "slug": "franchise-law",
    "title": "Franchise Law",
    "category": "Business & Corporate"
  },
  {
    "slug": "estate-planning",
    "title": "Estate Planning",
    "category": "Estate Planning & Probate"
  },
  {
    "slug": "probate",
    "title": "Probate",
    "category": "Estate Planning & Probate"
  },
  {
    "slug": "wills",
    "title": "Wills",
    "category": "Estate Planning & Probate"
  },
  {
    "slug": "trusts",
    "title": "Trusts",
    "category": "Estate Planning & Probate"
  },
  {
    "slug": "guardianship",
    "title": "Guardianship",
    "category": "Estate Planning & Probate"
  },
  {
    "slug": "elder-law",
    "title": "Elder Law",
    "category": "Estate Planning & Probate"
  },
  {
    "slug": "estate-litigation",
    "title": "Estate Litigation",
    "category": "Estate Planning & Probate"
  },
  {
    "slug": "asset-protection",
    "title": "Asset Protection",
    "category": "Estate Planning & Probate"
  },
  {
    "slug": "employment-law",
    "title": "Employment Law",
    "category": "Employment"
  },
  {
    "slug": "wrongful-termination",
    "title": "Wrongful Termination",
    "category": "Employment"
  },
  {
    "slug": "workplace-discrimination",
    "title": "Workplace Discrimination",
    "category": "Employment"
  },
  {
    "slug": "sexual-harassment",
    "title": "Sexual Harassment",
    "category": "Employment"
  },
  {
    "slug": "wage-and-hour",
    "title": "Wage and Hour",
    "category": "Employment"
  },
  {
    "slug": "employment-contracts",
    "title": "Employment Contracts",
    "category": "Employment"
  },
  {
    "slug": "noncompete-agreements",
    "title": "Noncompete Agreements",
    "category": "Employment"
  },
  {
    "slug": "employee-benefits",
    "title": "Employee Benefits",
    "category": "Employment"
  },
  {
    "slug": "real-estate",
    "title": "Real Estate",
    "category": "Real Estate & Construction"
  },
  {
    "slug": "commercial-real-estate",
    "title": "Commercial Real Estate",
    "category": "Real Estate & Construction"
  },
  {
    "slug": "residential-real-estate",
    "title": "Residential Real Estate",
    "category": "Real Estate & Construction"
  },
  {
    "slug": "landlord-tenant",
    "title": "Landlord and Tenant",
    "category": "Real Estate & Construction"
  },
  {
    "slug": "construction-law",
    "title": "Construction Law",
    "category": "Real Estate & Construction"
  },
  {
    "slug": "property-disputes",
    "title": "Property Disputes",
    "category": "Real Estate & Construction"
  },
  {
    "slug": "zoning-and-land-use",
    "title": "Zoning and Land Use",
    "category": "Real Estate & Construction"
  },
  {
    "slug": "foreclosure",
    "title": "Foreclosure",
    "category": "Real Estate & Construction"
  },
  {
    "slug": "bankruptcy",
    "title": "Bankruptcy",
    "category": "Bankruptcy & Finance"
  },
  {
    "slug": "chapter-7-bankruptcy",
    "title": "Chapter 7 Bankruptcy",
    "category": "Bankruptcy & Finance"
  },
  {
    "slug": "chapter-13-bankruptcy",
    "title": "Chapter 13 Bankruptcy",
    "category": "Bankruptcy & Finance"
  },
  {
    "slug": "business-bankruptcy",
    "title": "Business Bankruptcy",
    "category": "Bankruptcy & Finance"
  },
  {
    "slug": "debt-defense",
    "title": "Debt Defense",
    "category": "Bankruptcy & Finance"
  },
  {
    "slug": "tax-law",
    "title": "Tax Law",
    "category": "Bankruptcy & Finance"
  },
  {
    "slug": "tax-controversy",
    "title": "Tax Controversy",
    "category": "Bankruptcy & Finance"
  },
  {
    "slug": "civil-litigation",
    "title": "Civil Litigation",
    "category": "Civil Litigation"
  },
  {
    "slug": "appeals",
    "title": "Appeals",
    "category": "Civil Litigation"
  },
  {
    "slug": "insurance-disputes",
    "title": "Insurance Disputes",
    "category": "Civil Litigation"
  },
  {
    "slug": "consumer-protection",
    "title": "Consumer Protection",
    "category": "Civil Litigation"
  },
  {
    "slug": "class-actions",
    "title": "Class Actions",
    "category": "Civil Litigation"
  },
  {
    "slug": "contract-disputes",
    "title": "Contract Disputes",
    "category": "Civil Litigation"
  },
  {
    "slug": "defamation",
    "title": "Defamation",
    "category": "Civil Litigation"
  },
  {
    "slug": "constitutional-law",
    "title": "Constitutional Law",
    "category": "Civil Litigation"
  },
  {
    "slug": "social-security-disability",
    "title": "Social Security Disability",
    "category": "Government Benefits"
  },
  {
    "slug": "veterans-benefits",
    "title": "Veterans Benefits",
    "category": "Government Benefits"
  },
  {
    "slug": "workers-compensation",
    "title": "Workers’ Compensation",
    "category": "Government Benefits"
  },
  {
    "slug": "administrative-law",
    "title": "Administrative Law",
    "category": "Government Benefits"
  },
  {
    "slug": "education-law",
    "title": "Education Law",
    "category": "Government Benefits"
  },
  {
    "slug": "intellectual-property",
    "title": "Intellectual Property",
    "category": "Specialized Law"
  },
  {
    "slug": "trademark-law",
    "title": "Trademark Law",
    "category": "Specialized Law"
  },
  {
    "slug": "copyright-law",
    "title": "Copyright Law",
    "category": "Specialized Law"
  },
  {
    "slug": "patent-law",
    "title": "Patent Law",
    "category": "Specialized Law"
  },
  {
    "slug": "entertainment-law",
    "title": "Entertainment Law",
    "category": "Specialized Law"
  },
  {
    "slug": "health-care-law",
    "title": "Health Care Law",
    "category": "Specialized Law"
  },
  {
    "slug": "environmental-law",
    "title": "Environmental Law",
    "category": "Specialized Law"
  },
  {
    "slug": "energy-law",
    "title": "Energy Law",
    "category": "Specialized Law"
  },
  {
    "slug": "oil-and-gas",
    "title": "Oil and Gas",
    "category": "Specialized Law"
  },
  {
    "slug": "aviation-law",
    "title": "Aviation Law",
    "category": "Specialized Law"
  },
  {
    "slug": "maritime-law",
    "title": "Maritime Law",
    "category": "Specialized Law"
  },
  {
    "slug": "international-law",
    "title": "International Law",
    "category": "Specialized Law"
  },
  {
    "slug": "nonprofit-law",
    "title": "Nonprofit Law",
    "category": "Specialized Law"
  }
];

const normalizePracticeAreaValue = (
  value: string | null | undefined
): string =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const getMarketByKey = (
  key: string | null | undefined
): LegalMarket | undefined =>
  LEGAL_MARKETS.find((market) => market.key === key);

const getMarketByName = (
  name: string | null | undefined
): LegalMarket | undefined =>
  LEGAL_MARKETS.find((market) => market.name === name);

const getPracticeAreaByValue = (
  value: string | null | undefined
): ServerSafePracticeArea | undefined => {
  if (!value) return undefined;

  const normalized = normalizePracticeAreaValue(value);

  return SERVER_SAFE_PRACTICE_AREAS.find(
    (item) =>
      normalizePracticeAreaValue(item.slug) === normalized ||
      normalizePracticeAreaValue(item.title) === normalized
  );
};

const getMarketForPracticeArea = (
  value: string | null | undefined
): LegalMarket | undefined => {
  const practiceArea = getPracticeAreaByValue(value);

  if (!practiceArea) {
    return undefined;
  }

  return getMarketByName(practiceArea.category);
};

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "support@elpasosbestlawyers.com";

const FROM_EMAIL =
  "El Paso's Best Lawyers <support@elpasosbestlawyers.com>";

type FirmRow = {
  id: string | number;
  name?: string | null;
  email?: string | null;

  plan?: string | null;
  plan_key?: string | null;

  primary_category?: string | null;
  practice_areas?: string[] | null;

  // Legacy compatibility fields.
  category?: string | null;
  categories?: string[] | null;
  specialties?: string[] | null;

  is_active?: boolean | null;
  status?: string | null;
};

type RoutedFirm = {
  id: string;
  name: string;
  email: string;
  planKey: string;
  priority: number;
  freeConsultation?: boolean;
  profileDescription?: string;
  profileSpecialty?: string;
  logoUrl?: string;
  hasVideo?: boolean;
  recipientUserId?: string;
};

const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const normalize = (value: unknown): string =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const getCommercialProductForFirm = (firm: FirmRow) =>
  getCommercialProductByPlanId(
    firm.plan_key ??
      firm.plan ??
      "free"
  );

const planIncludesLeadRouting = (
  firm: FirmRow
): boolean =>
  getCommercialProductForFirm(firm).key !== "free";

const getSupabaseServerClient = () => {
  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.VITE_database_URL;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn(
      "Supabase server credentials are not configured."
    );

    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

const resolveMarketValue = (
  value: string | null | undefined
): LegalMarket | undefined => {
  if (!value) return undefined;

  return (
    getMarketByKey(value) ??
    getMarketByName(value) ??
    getMarketForPracticeArea(value)
  );
};

const getFirmPrimaryMarket = (
  firm: FirmRow
): LegalMarket | undefined => {
  return (
    resolveMarketValue(firm.primary_category) ??
    resolveMarketValue(firm.category)
  );
};

const getFirmPracticeValues = (
  firm: FirmRow
): string[] => {
  return [
    firm.primary_category,
    ...(firm.practice_areas ?? []),
    firm.category,
    ...(firm.categories ?? []),
    ...(firm.specialties ?? []),
  ].filter(
    (value): value is string =>
      Boolean(String(value ?? "").trim())
  );
};

const getFirmExplicitPracticeAreas = (
  firm: FirmRow
) => {
  return [
    ...(firm.practice_areas ?? []),
    ...(firm.specialties ?? []),
  ]
    .map((value) => getPracticeAreaByValue(value))
    .filter(
      (
        value
      ): value is NonNullable<
        ReturnType<typeof getPracticeAreaByValue>
      > => Boolean(value)
    );
};

const practiceMatches = (
  firm: FirmRow,
  practiceArea: string
): boolean => {
  const cleanTarget =
    String(practiceArea ?? "").trim();

  if (!cleanTarget) {
    return true;
  }

  const targetPracticeArea =
    getPracticeAreaByValue(cleanTarget);

  const targetMarket =
    getMarketByKey(cleanTarget) ??
    getMarketByName(cleanTarget) ??
    getMarketForPracticeArea(cleanTarget);

  const product =
    getCommercialProductForFirm(firm);

  /*
   * Market-placement products are sold against one primary
   * legal market. They may receive an inquiry only when the
   * purchased market matches the inquiry market.
   *
   * When a firm already has explicit specialty data, require
   * an exact specialty match for specialty-level inquiries.
   * Older records without specialty data retain the market
   * fallback until their profiles are fully normalized.
   */
  if (product.marketPlacement) {
    if (!targetMarket) {
      return false;
    }

    const firmMarket =
      getFirmPrimaryMarket(firm);

    if (
      !firmMarket ||
      firmMarket.key !== targetMarket.key
    ) {
      return false;
    }

    if (!targetPracticeArea) {
      return true;
    }

    const explicitPracticeAreas =
      getFirmExplicitPracticeAreas(firm);

    if (explicitPracticeAreas.length === 0) {
      return true;
    }

    return explicitPracticeAreas.some(
      (item) =>
        item.slug ===
        targetPracticeArea.slug
    );
  }

  /*
   * Expert routing can use the firm's broader practice-area
   * profile. Prefer exact canonical specialty matching, then
   * allow a canonical market match.
   */
  const firmValues =
    getFirmPracticeValues(firm);

  if (targetPracticeArea) {
    const exactPracticeMatch =
      firmValues.some((value) => {
        const resolved =
          getPracticeAreaByValue(value);

        return (
          resolved?.slug ===
          targetPracticeArea.slug
        );
      });

    if (exactPracticeMatch) {
      return true;
    }
  }

  if (targetMarket) {
    return firmValues.some((value) => {
      const resolvedMarket =
        resolveMarketValue(value);

      return (
        resolvedMarket?.key ===
        targetMarket.key
      );
    });
  }

  /*
   * Legacy fallback for a value that has not yet been mapped
   * into the canonical taxonomy. Require a direct normalized
   * text match rather than maintaining another alias table.
   */
  const target = normalize(cleanTarget);

  return firmValues.some(
    (value) =>
      normalize(value) === target
  );
};

const matchesConsumerInquiryMarket = (
  firm: FirmRow,
  practiceArea: string
): boolean => {
  const market = resolveMarketValue(practiceArea);

  if (!market) return false;

  return getFirmPracticeValues(firm).some(
    (value) => resolveMarketValue(value)?.key === market.key
  );
};

const getEligibleInquiryFirms = (
  firms: FirmRow[],
  practiceArea: string,
  matcher = practiceMatches
): RoutedFirm[] => {
  return firms
    .filter((firm) => {
      const email =
        String(firm.email ?? "").trim();

      return (
        Boolean(email) &&
        planIncludesLeadRouting(firm) &&
        matcher(
          firm,
          practiceArea
        ) &&
        firm.is_active !== false &&
        String(firm.status ?? "").trim().toLowerCase() === "active"
      );
    })
    .map((firm): RoutedFirm => {
      const product =
        getCommercialProductForFirm(firm);

      return {
        id: String(firm.id),

        name:
          String(firm.name ?? "").trim() ||
          "Participating Law Firm",

        email:
          String(firm.email ?? "").trim(),

        planKey:
          product.key,

        priority:
          product.placementPriority,
      };
    })
    .sort((a, b) => {
      if (
        a.priority !== b.priority
      ) {
        return (
          a.priority -
          b.priority
        );
      }

      return a.name.localeCompare(
        b.name
      );
    });

};

// The same server-side eligibility check is used for discovery and submission.
// Temporary QA path: no real client content or real firm addresses are accepted.
const QA_FIRMS = [
  { id: "dd590d81-9518-4629-972b-d3f692ff8cd0", name: "Tucker Law Firm and Associates", plan: "category-exclusive", alias: "goldtest" },
  { id: "c79f6a29-979a-4a3c-8859-86ef2afdfe47", name: "Bo Nixson Law", plan: "category-featured", alias: "silvertest" },
];
const qaInbox = (alias: string): string => {
  const base = process.env.EPBL_INQUIRY_QA_EMAIL || "";
  if (!/^[a-z0-9.]+@gmail\.com$/i.test(base)) throw new Error("QA inbox not configured");
  return base.replace("@", "+" + alias + "@");
};
const validQaToken = (token: unknown) => {
  const secret = process.env.EPBL_INQUIRY_QA_TOKEN;
  return typeof secret === "string" && /^[a-f0-9]{64}$/i.test(secret) &&
    typeof token === "string" && /^[a-f0-9]{64}$/i.test(token) &&
    timingSafeEqual(Buffer.from(token, "utf8"), Buffer.from(secret, "utf8"));
};

const loadVerifiedRecipients = async (area: string, firmId?: string, qa = false) => {
  const db = getSupabaseServerClient();
  if (!db) throw new Error("Firm selection unavailable");
  let query = db.from("firms")
    .select("id,name,user_id,inquiry_email,inquiry_enabled,inquiry_verified_at,plan,plan_key,primary_category,category,practice_areas,specialties,is_active,status,consultation_free,description,logo_url,video_url")
    .eq("is_active", true);
  if (qa) query = query.in("id", QA_FIRMS.map(firm => firm.id)).eq("status", "pending");
  else query = query.eq("status", "active");
  if (firmId) query = query.eq("id", firmId);
  const { data, error } = await query;
  if (error) throw error;
  const rows = qa ? (data ?? []).flatMap(firm => {
    const fixture = QA_FIRMS.find(item => item.id === String(firm.id));
    if (!fixture || firm.name !== fixture.name || firm.plan_key !== fixture.plan ||
        firm.inquiry_enabled !== false || !firm.user_id) return [];
    return [{ ...firm, status: "active", email: qaInbox(fixture.alias) }];
  }) : (data ?? []).filter((firm) =>
    firm.inquiry_enabled === true &&
    typeof firm.user_id === "string" && Boolean(firm.user_id.trim()) &&
    Boolean(firm.inquiry_verified_at) &&
    typeof firm.inquiry_email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(firm.inquiry_email.trim())
  ).map((firm) => ({ ...firm, email: firm.inquiry_email.trim().toLowerCase() }));
  const consultations = new Map(rows.map(firm => [String(firm.id), firm.consultation_free === true]));
  const profiles = new Map(rows.map(firm => [String(firm.id), firm] as const));
  return getEligibleInquiryFirms(rows, area, firmId ? () => true : matchesConsumerInquiryMarket)
    .filter(firm => ["market_exclusive", "featured", "expert"].includes(firm.planKey))
    .map(firm => {
      const profile = profiles.get(firm.id);
      return {
        ...firm,
        freeConsultation: consultations.get(firm.id) === true,
        profileDescription: String(profile?.description ?? "").trim().slice(0, 280),
        profileSpecialty: String(profile?.primary_category ?? profile?.category ?? "").trim().slice(0, 120),
        logoUrl: String(profile?.logo_url ?? "").trim(),
        hasVideo: Boolean(String(profile?.video_url ?? "").trim()),
        recipientUserId: String(profile?.user_id ?? ""),
      };
    });
};

const PUBLIC_SITE = "https://www.elpasosbestlawyers.com";

// Do not embed arbitrary third-party tracking images in consumer email.
const safeEmailLogo = (value?: string): string => {
  if (!value) return "";
  try {
    const url = new URL(value, PUBLIC_SITE);
    const storageHost = new URL(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || PUBLIC_SITE).hostname;
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return "";
    if (url.hostname === "www.elpasosbestlawyers.com" || url.hostname === "elpasosbestlawyers.com") return url.href;
    if (url.hostname === storageHost && url.pathname.startsWith("/storage/v1/object/public/")) return url.href;
  } catch { /* Invalid or unapproved URL: display the firm name instead. */ }
  return "";
};

const renderConsumerConfirmation = ({
  name, area, legalIssue, accepted, selected, spanish,
}: {
  name: string; area: string; legalIssue: string; accepted: RoutedFirm[]; selected: RoutedFirm[]; spanish: boolean;
}): string => {
  const tr = (en: string, es: string) => spanish ? es : en;
  const practice = getPracticeAreaByValue(area)?.slug;
  const market = resolveMarketValue(area)?.key;
  const issue = legalIssue.toLowerCase();
  const resources: { path: string; title: string }[] = [];
  if (practice === "truck-accidents" || (market === "personal-injury" && /\b(truck|18[- ]?wheeler|semi[- ]?truck)\b/.test(issue))) {
    resources.push({ path: "/guides/truck-accident-evidence-texas", title: tr("Evidence after a truck accident", "Pruebas después de un accidente de camión") });
  } else if (practice === "car-accidents" || (market === "personal-injury" && /\b(car accident|car crash|auto accident|vehicle collision)\b/.test(issue))) {
    resources.push({ path: "/guides/what-to-do-after-car-accident-el-paso", title: tr("What to do after a car accident", "Qué hacer después de un accidente de automóvil") });
    resources.push({ path: "/guides/how-to-get-texas-crash-report-el-paso", title: tr("How to obtain a crash report", "Cómo obtener un informe del accidente") });
  } else if (practice === "child-custody" || (market === "family-law" && /\b(child custody|conservatorship|parenting time)\b/.test(issue))) {
    resources.push({ path: "/guides/texas-child-custody-conservatorship-basics", title: tr("Texas child custody basics", "Fundamentos de custodia de menores en Texas") });
  } else if (practice === "dwi-dui" || (market === "criminal-defense" && /\b(dwi|dui)\b/.test(issue))) {
    resources.push({ path: "/guides/texas-dwi-basics-el-paso", title: tr("Texas DWI basics", "Fundamentos de DWI en Texas") });
  }
  const guideLinks = [
    { path: "/guides#consultation-preparation", title: tr("Prepare for your consultation", "Prepararse para su consulta") },
    { path: "/guides#questions-to-ask", title: tr("Questions to ask an attorney", "Preguntas para un abogado") },
    { path: "/guides#choosing-an-attorney", title: tr("How to choose an attorney", "Cómo elegir un abogado") },
    ...resources,
    { path: "/guides", title: tr("Browse all Texas law guides", "Explorar todas las guías legales de Texas") },
    { path: "/community-legal-resources", title: tr("Explore El Paso community legal resources", "Explore recursos legales de la comunidad de El Paso") },
  ].map(link => `<li style="margin:5px 0;"><a style="color:#0f2a43;" href="${PUBLIC_SITE}${link.path}">${escapeHtml(link.title)}</a></li>`).join("");
  const groups = [
    { key: "market_exclusive", label: "Gold", color: "#b18424", background: "#fffaf0" },
    { key: "featured", label: "Silver", color: "#74869b", background: "#f5f7fa" },
    { key: "expert", label: "Expert", color: "#1fa8a1", background: "#ffffff" },
  ];
  const acceptedIds = new Set(accepted.map(firm => firm.id));
  const pending = selected.filter(firm => !acceptedIds.has(firm.id));
  const firmCards = groups.map(group => {
    const firms = accepted.filter(firm => firm.planKey === group.key);
    if (!firms.length) return "";
    return `<h3 style="margin:24px 0 10px;color:#0f2a43;font-size:15px;">${group.label} · ${tr("Advertising placement", "Publicidad")}</h3>` +
      firms.map(firm => {
        const gold = group.key === "market_exclusive";
        const expert = group.key === "expert";
        const logo = expert ? "" : safeEmailLogo(firm.logoUrl);
        const profileUrl = PUBLIC_SITE + "/firm/" + encodeURIComponent(firm.id);
        return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${group.color};background:${group.background};border-radius:8px;margin-bottom:12px;"><tr><td style="padding:${gold ? "20" : expert ? "12" : "16"}px;">
          ${logo ? `<img src="${escapeHtml(logo)}" alt="" width="${gold ? 112 : 72}" style="display:block;max-width:100%;height:auto;margin-bottom:12px;">` : ""}
          <strong style="font-size:${gold ? "20" : "16"}px;color:#0f2a43;">${escapeHtml(firm.name)}</strong>
          ${!expert && firm.profileSpecialty ? `<p style="margin:6px 0;color:#475569;font-size:13px;">${escapeHtml(firm.profileSpecialty)}</p>` : ""}
          ${gold && firm.profileDescription ? `<p style="line-height:1.55;margin:8px 0;">${escapeHtml(firm.profileDescription)}</p>` : ""}
          ${firm.freeConsultation ? `<p style="color:#166534;font-size:13px;">${tr("Free initial consultation", "Consulta inicial gratuita")}</p>` : ""}
          <a href="${escapeHtml(profileUrl)}" style="display:inline-block;margin-top:8px;color:#0f2a43;font-weight:bold;text-decoration:underline;">${gold && firm.hasVideo ? tr("View profile and firm video", "Ver perfil y video") : tr("View firm profile", "Ver perfil del despacho")}</a>
        </td></tr></table>`;
      }).join("");
  }).join("");
  return `<div style="font-family:Arial,sans-serif;color:#172033;max-width:650px;margin:0 auto;line-height:1.6;">
    <div style="background:#071d2f;color:#fff;padding:24px;border-top:5px solid #d4a62a;">
      <div style="font-size:12px;letter-spacing:2px;color:#f5cd65;">EL PASO'S BEST LAWYERS</div>
      <h1 style="font-size:25px;margin:8px 0 0;">${tr("Your consultation request is received", "Recibimos su solicitud de consulta")}</h1>
    </div>
    <div style="padding:24px;border:1px solid #d9e0e8;">
      <p>${tr("Hello", "Hola")} ${escapeHtml(name)},</p>
      <p>${tr("We received your request for legal help related to", "Recibimos su solicitud de ayuda legal relacionada con")} <strong>${escapeHtml(area)}</strong>.</p>
      ${accepted.length ? `<h2 style="font-size:20px;color:#0f2a43;">${tr("Firms notified", "Despachos notificados")}</h2>
        <p>${tr("Our email provider accepted notifications for the following firms you authorized. Inbox delivery and a response are not guaranteed.", "Nuestro proveedor de correo aceptó las notificaciones para los despachos que autorizó. No se garantiza la entrega ni una respuesta.")}</p>
        ${firmCards}<p style="font-size:12px;color:#475569;">${tr("Gold, Silver and Expert are advertising placements, not ratings or recommendations.", "Gold, Silver y Expert son espacios publicitarios, no calificaciones ni recomendaciones.")}</p>` :
        `<p>${selected.length ? tr("No firm notification has been confirmed as accepted. EPBL has recorded your request.", "No se ha confirmado la aceptación de ninguna notificación a un despacho. EPBL ha registrado su solicitud.") : tr("Your request has been received by El Paso's Best Lawyers. It has not been forwarded to a law firm.", "El Paso's Best Lawyers ha recibido su solicitud. No se ha enviado a ningún despacho.")}</p>`}
      ${pending.length ? `<p><strong>${tr("Notification acceptance not confirmed:", "Aceptación de notificaciones no confirmada:")}</strong> ${pending.map(firm => escapeHtml(firm.name)).join(", ")}.</p>` : ""}
      <div style="background:#f1f5f9;padding:16px;margin:24px 0;border-radius:8px;">
        <strong>${tr("What happens next?", "¿Qué sucede después?")}</strong>
        <p style="margin:8px 0;">${selected.length ? tr("Firms that receive your request may contact you directly to discuss next steps. You choose whether to proceed.", "Los despachos que reciban su solicitud pueden contactarle directamente. Usted decide si desea continuar.") : tr("You can browse legal information and prepare for a conversation with a lawyer while exploring your options.", "Puede consultar información legal y prepararse para hablar con un abogado mientras explora sus opciones.")}</p>
        <p style="margin:8px 0;"><strong>${tr("Helpful resources for your next step", "Recursos útiles para su próximo paso")}</strong></p>
        ${spanish ? '<p style="font-size:12px;">Las siguientes guías están disponibles en inglés.</p>' : ""}
        <ul style="padding-left:20px;margin:8px 0;">${guideLinks}</ul>
      </div>
      <p style="font-size:12px;color:#475569;">${tr("Submission does not create an attorney-client relationship or guarantee representation. Avoid sending additional confidential or highly sensitive information until you establish an attorney-client relationship.", "El envío no establece una relación abogado-cliente ni garantiza representación. Evite enviar información confidencial o muy sensible hasta establecer una relación abogado-cliente.")}</p>
      <p style="font-size:13px;"><a href="${PUBLIC_SITE}" style="color:#0f2a43;">El Paso's Best Lawyers</a> · <a href="${PUBLIC_SITE}/privacy" style="color:#0f2a43;">${tr("Privacy Policy", "Política de privacidad")}</a></p>
    </div></div>`;
};

const sendFirmLead = async ({
  routedFirm,
  fullName,
  email,
  phone,
  legalIssue,
  practiceArea,
  matterLocation,
  matterTiming,
}: {
  routedFirm: RoutedFirm;
  fullName: string;
  email: string;
  phone: string;
  legalIssue: string;
  practiceArea: string;
  matterLocation?: string | null;
  matterTiming?: string | null;
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,

    to: [
      routedFirm.email,
    ],

    replyTo: email,

    subject:
      "New consultation inquiry | El Paso's Best Lawyers",

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 720px;
          margin: 0 auto;
          color: #172033;
        "
      >
        <div
          style="
            background: #071b36;
            color: #ffffff;
            padding: 24px;
            border-radius: 10px 10px 0 0;
          "
        >
          <h1
            style="
              margin: 0;
              font-size: 24px;
            "
          >
            New Client Inquiry
          </h1>

          <p
            style="
              margin: 8px 0 0;
              color: #d6e2f0;
            "
          >
            Delivered through El Paso's Best Lawyers.
          </p>
        </div>

        <div
          style="
            border: 1px solid #d9e0e8;
            border-top: 0;
            padding: 24px;
            border-radius: 0 0 10px 10px;
          "
        >
          <p>
            <strong>Firm:</strong>
            ${escapeHtml(
              routedFirm.name
            )}
          </p>

          <p>
            <strong>Practice Area:</strong>
            ${escapeHtml(
              practiceArea
            )}
          </p>

          <p style="font-size:13px;color:#166534;">
            The consumer selected your firm and authorized sharing the inquiry and contact information with you.
          </p>

          <hr
            style="
              border: 0;
              border-top: 1px solid #e5e7eb;
              margin: 22px 0;
            "
          />

          <p>
            <strong>Name:</strong>
            ${escapeHtml(fullName)}
          </p>

          <p>
            <strong>Email:</strong>
            ${escapeHtml(email)}
          </p>

          <p>
            <strong>Phone:</strong>
            ${escapeHtml(phone)}
          </p>

          ${
            matterLocation
              ? `<p><strong>Where:</strong> ${escapeHtml(
                  matterLocation
                )}</p>`
              : ""
          }
          ${
            matterTiming
              ? `<p><strong>When:</strong> ${escapeHtml(
                  matterTiming
                )}</p>`
              : ""
          }

          <h3>
            Legal Matter
          </h3>

          <div
            style="
              background: #f5f7fa;
              padding: 16px;
              border-radius: 8px;
              white-space: pre-wrap;
            "
          >${escapeHtml(
            legalIssue
          )}</div>

          <div
            style="
              margin-top: 24px;
              padding: 14px;
              background: #fff8df;
              border: 1px solid #ead58a;
              border-radius: 8px;
              font-size: 13px;
            "
          >
            This inquiry was submitted through
            El Paso's Best Lawyers.
            Receiving this inquiry does not
            establish an attorney-client relationship.
            Please handle these details confidentially and contact the consumer only about this request.
          </div>
        </div>
      </div>
    `,
  });
};

// Each notification is claimed once before contacting Resend. Accepted messages
// are never automatically resent: provider acceptance is not inbox delivery.
const sendTracked = async (
  leadId: string,
  recipientType: "admin" | "firm" | "consumer",
  recipientEmail: string,
  send: () => Promise<{ data: { id: string } | null; error: unknown }>,
  recipientFirmId?: string
) => {
  const db = getSupabaseServerClient();
  if (!db || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Notification tracking requires server credentials");
  }
  const key = { lead_id: leadId, recipient_type: recipientType, recipient_email: recipientEmail };
  const { error: createError } = await db.from("lead_notifications")
    .upsert({ ...key, firm_id: recipientFirmId ?? null, status: "pending" }, { onConflict: "lead_id,recipient_type,recipient_email", ignoreDuplicates: true });
  if (createError) throw createError;
  let claim = db.from("lead_notifications")
    .update({ status: "sending", updated_at: new Date().toISOString(), last_attempt_at: new Date().toISOString() })
    .eq("lead_id", leadId).eq("recipient_type", recipientType).eq("recipient_email", recipientEmail)
    .eq("status", "pending");
  if (recipientFirmId) claim = claim.eq("firm_id", recipientFirmId);
  const { data: claimed, error: claimError } = await claim.select("id,attempt_count").maybeSingle();
  if (claimError) throw claimError;
  if (!claimed) return { data: null, error: null, skipped: true };
  let result: { data: { id: string } | null; error: unknown };
  try { result = await send(); }
  catch (error) { result = { data: null, error }; }
  const errorMessage = result.error
    ? String((result.error as Error)?.message || result.error).slice(0, 2000)
    : result.data?.id ? null : "Email provider did not return a message ID";
  const { error: recordError } = await db.from("lead_notifications").update({
    status: errorMessage ? "failed" : "accepted",
    provider_message_id: result.data?.id || null,
    last_error: errorMessage,
    attempt_count: (claimed.attempt_count || 0) + 1,
    updated_at: new Date().toISOString(),
  }).eq("id", claimed.id);
  if (recordError) console.error("Notification audit update failed", recordError);
  return { ...result, skipped: false };
};

export default async function handler(
  req: any,
  res: any
) {
  const qaHeader = req.headers?.["x-epbl-qa-token"];
  const qa = qaHeader !== undefined;
  if (qa && !validQaToken(qaHeader)) {
    return res.status(403).json({ success: false, error: "QA authorization failed" });
  }
  if (req.method === "GET" && req.query?.action === "eligible-firms") {
    res.setHeader("Cache-Control", "no-store");

    const area = req.query?.practiceArea;

    if (typeof area !== "string" || !area.trim() || area.length > 180) {
      return res.status(400).json({
        success: false,
        error: "A valid practice area is required",
      });
    }

    try {
      const direct = req.query?.firmId;
      if (direct !== undefined && (typeof direct !== "string" || !direct || direct.length > 250)) {
        return res.status(400).json({ success: false, error: "Invalid firm ID" });
      }
      const firms = (await loadVerifiedRecipients(area.trim(), direct, qa)).map(firm => ({
        id: firm.id, name: firm.name,
        tier: firm.planKey === "market_exclusive" ? "gold" : firm.planKey === "featured" ? "silver" : "expert",
        priority: firm.priority, freeConsultation: firm.freeConsultation,
      }));

      return res.status(200).json({
        success: true,
        firms,
      });
    } catch {
      return res.status(503).json({
        success: false,
        error: "Unable to retrieve participating firms",
      });
    }
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({
        success: false,
        error:
          "Method not allowed",
      });
  }

  try {
    const {
      leadId,
      turnstileToken,
      fullName,
      email,
      phone,
      legalIssue,
      firmId,
      firmName,
      practiceArea,
      sourceUrl,
      landingPage,
      referrer,
      source,
      medium,
      campaign,
      matterLocation,
      matterTiming,
      recipientIds,
      sharingConsent,
      consentVersion,
    } = qa ? {
      leadId: req.body?.leadId,
      turnstileToken: null,
      fullName: "EPBL QA TEST — NOT A REAL CLIENT",
      email: qaInbox("leadtest"),
      phone: "",
      legalIssue: "SYNTHETIC QA ONLY — Criminal Defense consultation workflow test. No real legal matter.",
      firmId: null, firmName: null,
      practiceArea: "Criminal Defense",
      sourceUrl: null, landingPage: null, referrer: null,
      source: "epbl-controlled-qa", medium: "qa", campaign: "multi-firm-qa",
      matterLocation: "El Paso (test)", matterTiming: "Test only",
      recipientIds: req.body?.recipientIds,
      sharingConsent: req.body?.sharingConsent,
      consentVersion: req.body?.consentVersion,
    } : req.body ?? {};

    if (
      !fullName ||
      !email ||
      !legalIssue
    ) {
      return res
        .status(400)
        .json({
          success: false,
          error:
            "Missing required lead information",
        });
    }

    if (
      !process.env
        .RESEND_API_KEY
    ) {
      console.error(
        "RESEND_API_KEY is not configured."
      );

      return res
        .status(500)
        .json({
          success: false,
          error:
            "Email service is not configured",
        });
    }

    const cleanFullName =
      String(
        fullName
      ).trim();

    const cleanEmail =
      String(
        email
      ).trim();

    const cleanPhone =
      String(
        phone
      ).trim();

    const cleanLegalIssue =
      String(
        legalIssue
      ).trim();

    const area =
      String(
        practiceArea ?? ""
      ).trim() ||
      "General Legal Inquiry";

    const cleanSourceUrl =
      sourceUrl
        ? String(
            sourceUrl
          )
        : null;

    const cleanMatterLocation =
      matterLocation
        ? String(
            matterLocation
          ).trim()
        : null;

    const cleanMatterTiming =
      matterTiming
        ? String(
            matterTiming
          ).trim()
        : null;

    // Turnstile tokens are short-lived and single-use. Validate them before
    // any notification lookup, routing or email attempt.
    if (!qa) {
    if (!process.env.TURNSTILE_SECRET_KEY) {
      return res.status(503).json({ success: false, error: "Bot verification unavailable" });
    }
    if (typeof turnstileToken !== "string" || turnstileToken.length < 10 || turnstileToken.length > 2048) {
      return res.status(403).json({ success: false, error: "Security verification required" });
    }
    const verification = new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
    });
    const remoteIp = String(req.headers?.["x-forwarded-for"] || "").split(",")[0].trim();
    if (remoteIp) verification.set("remoteip", remoteIp);
    let challenge: { success?: boolean; hostname?: string };
    try {
      const challengeResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: verification.toString(),
        signal: AbortSignal.timeout(8000),
      });
      if (!challengeResponse.ok) throw new Error("Turnstile verification unavailable");
      challenge = await challengeResponse.json();
    } catch (error) {
      console.error("Turnstile verification failed", error);
      return res.status(503).json({ success: false, error: "Security verification temporarily unavailable" });
    }
    const allowedHosts = new Set(["www.elpasosbestlawyers.com", "elpasosbestlawyers.com"]);
    if (!challenge.success || !challenge.hostname || !allowedHosts.has(challenge.hostname)) {
      return res.status(403).json({ success: false, error: "Security verification failed" });
    }
    }

    // Persist only after successful server-side bot verification. The client
    // cannot write to leads directly once the accompanying RLS change is applied.
    if (typeof leadId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(leadId)) {
      return res.status(400).json({ success: false, error: "Invalid submission ID" });
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(503).json({ success: false, error: "Lead storage unavailable" });
    }
    const db = getSupabaseServerClient();
    if (!db) return res.status(503).json({ success: false, error: "Database unavailable" });
    if (cleanFullName.length > 160 || cleanEmail.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
        cleanLegalIssue.length < 10 || cleanLegalIssue.length > 10000 ||
        cleanPhone.length > 60 || area.length > 180) {
      return res.status(400).json({ success: false, error: "Invalid lead information" });
    }
    const safeText = (value: unknown, limit: number) =>
      typeof value === "string" ? value.slice(0, limit) : null;
    const requestedIds: string[] = Array.isArray(recipientIds)
      ? [...new Set<string>(recipientIds.filter((id: unknown) => typeof id === "string" && id.length > 0 && id.length <= 250))]
      : [];
    if (recipientIds !== undefined && (!Array.isArray(recipientIds) || requestedIds.length !== recipientIds.length)) {
      return res.status(400).json({ success: false, error: "Invalid recipient selection" });
    }
    if (requestedIds.length && (sharingConsent !== true || consentVersion !== "epbl-inquiry-v1")) {
      return res.status(400).json({ success: false, error: "Sharing consent required" });
    }
    if (firmId && (typeof firmId !== "string" || firmId.length > 250 ||
        requestedIds.some(id => id !== firmId))) {
      return res.status(400).json({ success: false, error: "Invalid direct recipient" });
    }
    const eligible = requestedIds.length ? await loadVerifiedRecipients(area, firmId || undefined, qa) : [];
    const selected = eligible.filter(firm => requestedIds.includes(firm.id));
    if (selected.length !== requestedIds.length) {
      return res.status(422).json({ success: false, error: "Recipient availability changed; please review your selection" });
    }
    const leadRecord = {
      id: leadId,
      full_name: cleanFullName,
      email: cleanEmail,
      phone: cleanPhone,
      legal_issue: cleanLegalIssue,
      firm_id: firmId || null,
      firm_name: safeText(firmName, 250),
      practice_area: area,
      status: "new",
      source_url: safeText(cleanSourceUrl, 2000),
      landing_page: safeText(landingPage, 2000),
      referrer: safeText(referrer, 2000),
      source: safeText(source, 200),
      medium: safeText(medium, 200),
      campaign: safeText(campaign, 200),
      matter_location: safeText(cleanMatterLocation, 500),
      matter_timing: safeText(cleanMatterTiming, 500),
    };
    const { error: saveError } = await db.from("leads").insert(leadRecord);
    if (saveError) {
      // Never send a second set of notifications for an already-used ID.
      if (saveError.code === "23505") {
        return res.status(409).json({ success: false, error: "Submission already processed" });
      }
      console.error("Lead persistence failed", saveError);
      return res.status(503).json({ success: false, error: "Unable to save inquiry" });
    }

    // Never forward legacy or unconsented requests. Capture them for EPBL only.
    const accepted: RoutedFirm[] = [];
    let assigned: RoutedFirm[] = [];
    if (selected.length) {
      const now = new Date().toISOString();
      const { error: assignmentError } = await db.from("lead_assignments").insert(
        selected.map(firm => ({
          lead_id: leadId, firm_id: firm.id, firm_name: firm.name,
          firm_tier: firm.planKey, assignment_source: "consumer_selected",
          recipient_user_id: firm.recipientUserId,
          consent_at: now, consent_version: "epbl-inquiry-v1", assigned_at: now,
        }))
      );
      if (assignmentError) {
        console.error("Lead assignment failed; admin capture only", assignmentError);
      } else {
        assigned = selected;
      }
    }
    const routedFirm = assigned[0] ?? null;
    if (routedFirm) {
      const { error } = await db.from("leads").update({
        assigned_firm_id: routedFirm.id, assigned_firm_name: routedFirm.name,
        assigned_firm_tier: routedFirm.planKey, assigned_at: new Date().toISOString(),
      }).eq("id", leadId);
      if (error) console.error("Legacy assignment summary failed", error);
    }
    const canonicalPractice = SERVER_SAFE_PRACTICE_AREAS.find(practice =>
      normalize(practice.title) === normalize(area) || normalize(practice.slug) === normalize(area));
    const market = resolveMarketValue(area);
    // Keep existing notification idempotency by inbox; shared inboxes are not
    // sent repeated copies or claimed as independent successful notifications.
    for (const recipient of assigned) {
      try {
        const { error: conversionError } = await db.from("attribution_events").insert({
          lead_id: leadId, firm_id: recipient.id, action: "consultation_submit",
          market: market?.key ?? null, specialty: canonicalPractice?.slug ?? null,
          page: safeText(landingPage, 2000), source: safeText(source, 200),
          medium: safeText(medium, 200), campaign: safeText(campaign, 200),
          referrer: safeText(referrer, 2000),
        });
        if (conversionError && conversionError.code !== "23505") console.error("Attribution failed", conversionError);
        const result = await sendTracked(leadId, "firm", recipient.email, () => sendFirmLead({
          routedFirm: recipient, fullName: cleanFullName, email: cleanEmail,
          phone: cleanPhone, legalIssue: cleanLegalIssue, practiceArea: area,
          matterLocation: cleanMatterLocation, matterTiming: cleanMatterTiming,
        }), recipient.id);
        if (!result.error && !result.skipped && result.data?.id) accepted.push(recipient);
      } catch (error) {
        console.error("Recipient processing failed", error);
      }
    }
    const routedSuccessfully = accepted.length > 0;

    /*
     * ADMIN COPY
     * Always sent.
     */
    const {
      error:
        adminEmailError,
    } =
      await sendTracked(leadId, "admin", ADMIN_EMAIL, () => resend.emails.send({
        from: FROM_EMAIL,

        to: [
          ADMIN_EMAIL,
        ],

        replyTo:
          cleanEmail,

        subject:
          `NEW LEAD | ${area} | ${cleanFullName}`,

        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 720px;
              margin: 0 auto;
              color: #172033;
            "
          >
            <div
              style="
                background: #071b36;
                color: #ffffff;
                padding: 24px;
                border-radius: 10px 10px 0 0;
              "
            >
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                "
              >
                New El Paso's Best Lawyers Lead
              </h1>
            </div>

            <div
              style="
                border: 1px solid #d9e0e8;
                border-top: 0;
                padding: 24px;
                border-radius: 0 0 10px 10px;
              "
            >
              <p>
                <strong>Name:</strong>
                ${escapeHtml(
                  cleanFullName
                )}
              </p>

              <p>
                <strong>Email:</strong>
                ${escapeHtml(
                  cleanEmail
                )}
              </p>

              <p>
                <strong>Phone:</strong>
                ${escapeHtml(
                  cleanPhone
                )}
              </p>

              <p>
                <strong>Practice Area:</strong>
                ${escapeHtml(
                  area
                )}
              </p>

              <p>
                <strong>Firm Viewed:</strong>
                ${escapeHtml(
                  firmName ||
                    "No specific firm selected"
                )}
              </p>

              <p>
                <strong>Firm ID:</strong>
                ${escapeHtml(
                  firmId ||
                    "N/A"
                )}
              </p>

              <p>
                <strong>Routed Firm:</strong>
                ${escapeHtml(
                  assigned.map(firm => firm.name).join(", ") || "Not routed"
                )}
              </p>

              <p>
                <strong>Routing Tier:</strong>
                ${escapeHtml(
                  assigned.map(firm => firm.planKey).join(", ") || "N/A"
                )}
              </p>

              <p>
                <strong>Routing Priority:</strong>
                ${escapeHtml(
                  routedFirm
                    ?.priority ??
                    "N/A"
                )}
              </p>

              <p>
                <strong>Delivery:</strong>
                ${
                  routedSuccessfully
                    ? accepted.map(firm => escapeHtml(firm.name)).join(", ") + " — accepted by email provider (delivery not confirmed)"
                    : "Admin capture only"
                }
              </p>

              ${
                cleanMatterLocation
                  ? `<p><strong>Where:</strong> ${escapeHtml(
                      cleanMatterLocation
                    )}</p>`
                  : ""
              }
              ${
                cleanMatterTiming
                  ? `<p><strong>When:</strong> ${escapeHtml(
                      cleanMatterTiming
                    )}</p>`
                  : ""
              }

              <h3>
                Legal Matter
              </h3>

              <div
                style="
                  background: #f5f7fa;
                  padding: 16px;
                  border-radius: 8px;
                  white-space: pre-wrap;
                "
              >${escapeHtml(
                cleanLegalIssue
              )}</div>

              ${
                cleanSourceUrl
                  ? `
                    <p
                      style="
                        margin-top: 20px;
                        font-size: 12px;
                        color: #667085;
                      "
                    >
                      Source:
                      ${escapeHtml(
                        cleanSourceUrl
                      )}
                    </p>
                  `
                  : ""
              }
            </div>
          </div>
        `,
      }));

    if (adminEmailError) {
      console.error(
        "Admin notification failed:",
        adminEmailError
      );
    }

    const spanishAcknowledgement = /^\/es(?:\/|$)/.test(String(landingPage || "").replace(/^https?:\/\/[^/]+/i, ""));

    /*
     * CONSUMER ACKNOWLEDGEMENT
     */
    const { error: consumerEmailError } = await sendTracked(leadId, "consumer", cleanEmail, () => resend.emails.send({
      from: FROM_EMAIL,
      to: [cleanEmail],
      subject: spanishAcknowledgement ? "Recibimos su solicitud de consulta" : "We Received Your Consultation Request",
      html: renderConsumerConfirmation({ name: cleanFullName, area, legalIssue: cleanLegalIssue, accepted, selected, spanish: spanishAcknowledgement }),
      }));

    if (
      consumerEmailError
    ) {
      console.warn(
        "Consumer acknowledgement failed:",
        consumerEmailError
      );
    }

    return res
      .status(200)
      .json({
        success: true,

        capturedBy:
          "El Paso's Best Lawyers",

        notifiedFirms: accepted.map(firm => ({ id: firm.id, name: firm.name })),
        routedToFirm:
          routedSuccessfully,

        routedFirmId:
          routedSuccessfully
            ? accepted[0]?.id ?? null
            : null,

        routedFirmName:
          routedSuccessfully
            ? accepted[0]?.name ?? null
            : null,

        routingPriority:
          routedSuccessfully
            ? accepted[0]?.priority ?? null
            : null,
      });
  } catch (err: any) {
    console.error(
      "Lead endpoint error:",
      err
    );

    return res
      .status(500)
      .json({
        success: false,

        error:
          err?.message ||
          "Unable to process lead",
      });
  }
}
