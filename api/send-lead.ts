import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

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
};

type RoutedFirm = {
  id: string;
  name: string;
  email: string;
  planKey: string;
  priority: number;
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
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_database_ANON_KEY;

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

const choosePriorityFirm = (
  firms: FirmRow[],
  practiceArea: string
): RoutedFirm | null => {
  const eligible = firms
    .filter((firm) => {
      const email =
        String(firm.email ?? "").trim();

      return (
        Boolean(email) &&
        planIncludesLeadRouting(firm) &&
        practiceMatches(
          firm,
          practiceArea
        ) &&
        firm.is_active !== false
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

  if (eligible.length === 0) {
    return null;
  }

  const bestPriority =
    eligible[0].priority;

  const highestTier =
    eligible.filter(
      (firm) =>
        firm.priority ===
        bestPriority
    );

  const randomIndex =
    Math.floor(
      Math.random() *
        highestTier.length
    );

  return (
    highestTier[randomIndex] ??
    null
  );
};

const lookupSpecificFirm = async (
  firmId: string
): Promise<RoutedFirm | null> => {
  const supabase =
    getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } =
    await supabase
      .from("firms")
      .select("*")
      .eq("id", firmId)
      .maybeSingle();

  if (error) {
    console.error(
      "Could not verify selected firm:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  const firm =
    data as FirmRow;

  const product =
    getCommercialProductForFirm(firm);

  const email =
    String(
      firm.email ?? ""
    ).trim();

  if (
    !email ||
    !planIncludesLeadRouting(firm) ||
    firm.is_active === false
  ) {
    return null;
  }

  return {
    id: String(firm.id),

    name:
      String(
        firm.name ?? ""
      ).trim() ||
      "Participating Law Firm",

    email,

    planKey:
      product.key,

    priority:
      product.placementPriority,
  };
};

const findPriorityFirm = async (
  practiceArea: string
): Promise<RoutedFirm | null> => {
  const supabase =
    getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } =
    await supabase
      .from("firms")
      .select("*");

  if (error) {
    console.error(
      "Could not load firms for priority routing:",
      error
    );

    return null;
  }

  return choosePriorityFirm(
    (data ?? []) as FirmRow[],
    practiceArea
  );
};

const sendFirmLead = async ({
  routedFirm,
  fullName,
  email,
  phone,
  legalIssue,
  practiceArea,
  sourceUrl,
}: {
  routedFirm: RoutedFirm;
  fullName: string;
  email: string;
  phone: string;
  legalIssue: string;
  practiceArea: string;
  sourceUrl?: string | null;
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,

    to: [
      routedFirm.email,
    ],

    replyTo: email,

    subject:
      `NEW CLIENT INQUIRY | ${practiceArea} | ${fullName}`,

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

          ${
            sourceUrl
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
                    sourceUrl
                  )}
                </p>
              `
              : ""
          }

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
          </div>
        </div>
      </div>
    `,
  });
};

export default async function handler(
  req: any,
  res: any
) {
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
      fullName,
      email,
      phone,
      legalIssue,
      firmId,
      firmName,
      practiceArea,
      sourceUrl,
    } = req.body ?? {};

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

    let routedFirm:
      RoutedFirm | null =
      null;

    /*
     * Firm-specific lead:
     * verify the selected firm
     * from Supabase.
     */
    if (firmId) {
      routedFirm =
        await lookupSpecificFirm(
          String(firmId)
        );
    }

    /*
     * General practice-area lead:
     * Market Exclusive -> Premier -> Featured -> Expert
     */
    if (
      !firmId &&
      !routedFirm
    ) {
      routedFirm =
        await findPriorityFirm(
          area
        );
    }

    let routedSuccessfully =
      false;

    if (routedFirm) {
      const {
        error:
          firmEmailError,
      } =
        await sendFirmLead({
          routedFirm,

          fullName:
            cleanFullName,

          email:
            cleanEmail,

          phone:
            cleanPhone,

          legalIssue:
            cleanLegalIssue,

          practiceArea:
            area,

          sourceUrl:
            cleanSourceUrl,
        });

      if (firmEmailError) {
        console.error(
          "Firm lead delivery failed:",
          firmEmailError
        );
      } else {
        routedSuccessfully =
          true;
      }
    }

    /*
     * ADMIN COPY
     * Always sent.
     */
    const {
      error:
        adminEmailError,
    } =
      await resend.emails.send({
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
                  routedFirm?.name ||
                    "Not routed"
                )}
              </p>

              <p>
                <strong>Routing Tier:</strong>
                ${escapeHtml(
                  routedFirm?.planKey ||
                    "N/A"
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
                    ? "Successfully delivered"
                    : "Admin capture only"
                }
              </p>

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
      });

    if (adminEmailError) {
      console.error(
        "Admin notification failed:",
        adminEmailError
      );
    }

    /*
     * CONSUMER ACKNOWLEDGEMENT
     */
    const {
      error:
        consumerEmailError,
    } =
      await resend.emails.send({
        from: FROM_EMAIL,

        to: [
          cleanEmail,
        ],

        subject:
          "We Received Your Consultation Request",

        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 650px;
              margin: 0 auto;
              color: #172033;
            "
          >
            <h2>
              We received your request
            </h2>

            <p>
              Hi ${escapeHtml(
                cleanFullName
              )},
            </p>

            <p>
              Your consultation request was submitted through
              <strong>
                El Paso's Best Lawyers
              </strong>.
            </p>

            <p>
              Your request relates to
              <strong>
                ${escapeHtml(area)}
              </strong>.
            </p>

            ${
              routedSuccessfully &&
              routedFirm
                ? `
                  <p>
                    Your request was delivered to
                    <strong>
                      ${escapeHtml(
                        routedFirm.name
                      )}
                    </strong>
                    for review.
                  </p>
                `
                : `
                  <p>
                    El Paso's Best Lawyers has received
                    your request and it is being processed.
                  </p>
                `
            }

            <p>
              Submission does not create an
              attorney-client relationship and does not
              guarantee representation.
            </p>

            <p>
              Please avoid sending additional
              confidential or highly sensitive
              information until you establish an
              attorney-client relationship with a lawyer.
            </p>

            <p>
              El Paso's Best Lawyers
            </p>
          </div>
        `,
      });

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

        routedToFirm:
          routedSuccessfully,

        routedFirmId:
          routedSuccessfully
            ? routedFirm?.id ??
              null
            : null,

        routedFirmName:
          routedSuccessfully
            ? routedFirm?.name ??
              null
            : null,

        routingPriority:
          routedSuccessfully
            ? routedFirm
                ?.priority ??
              null
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
