import { createClient } from "@supabase/supabase-js";

type CommercialProductKey =
  | "free"
  | "expert"
  | "featured"
  | "premier"
  | "market_exclusive";

interface CommercialProductDefinition {
  key: CommercialProductKey;
  displayName: string;
  marketPlacement: boolean;
  competitorLockout: boolean;
  maxPerMarket: number | null;
}

interface LegalMarket {
  key: string;
  name: string;
  slug: string;
  premiumInventory: boolean;
}

const SELF_SERVICE_PLAN_IDS = new Set(["free", "expert", "category-featured"]);

const isSelfServicePlanId = (value: unknown): boolean =>
  SELF_SERVICE_PLAN_IDS.has(String(value ?? "").trim().toLowerCase());

const COMMERCIAL_PRODUCTS: Record<CommercialProductKey, CommercialProductDefinition> = {
  free: {
    key: "free",
    displayName: "Free Listing",
    marketPlacement: false,
    competitorLockout: false,
    maxPerMarket: null,
  },
  expert: {
    key: "expert",
    displayName: "Expert",
    marketPlacement: false,
    competitorLockout: false,
    maxPerMarket: null,
  },
  featured: {
    key: "featured",
    displayName: "Featured",
    marketPlacement: true,
    competitorLockout: false,
    maxPerMarket: 2,
  },
  premier: {
    key: "premier",
    displayName: "Premier",
    marketPlacement: true,
    competitorLockout: false,
    maxPerMarket: 5,
  },
  market_exclusive: {
    key: "market_exclusive",
    displayName: "Market Exclusive",
    marketPlacement: true,
    competitorLockout: true,
    maxPerMarket: 1,
  },
};

const normalizePlanId = (value: unknown): string =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");

const getCommercialProductByPlanId = (
  value: unknown
): CommercialProductDefinition => {
  const normalized = normalizePlanId(value);
  const canonicalKey = normalized.replace(/-/g, "_") as CommercialProductKey;

  if (canonicalKey in COMMERCIAL_PRODUCTS) {
    return COMMERCIAL_PRODUCTS[canonicalKey];
  }

  if (normalized === "pro") return COMMERCIAL_PRODUCTS.expert;
  if (normalized === "category-featured") return COMMERCIAL_PRODUCTS.featured;
  if (normalized === "category-exclusive") return COMMERCIAL_PRODUCTS.market_exclusive;

  return COMMERCIAL_PRODUCTS.free;
};

const LEGAL_MARKETS: LegalMarket[] = [
  { key: "personal-injury", name: "Personal Injury", slug: "personal-injury", premiumInventory: true },
  { key: "criminal-defense", name: "Criminal Defense", slug: "criminal-defense", premiumInventory: true },
  { key: "family-law", name: "Family Law", slug: "family-law", premiumInventory: true },
  { key: "immigration", name: "Immigration", slug: "immigration", premiumInventory: true },
  { key: "employment", name: "Employment", slug: "employment", premiumInventory: true },
  { key: "estate-planning-probate", name: "Estate Planning & Probate", slug: "estate-planning-probate", premiumInventory: true },
  { key: "business-corporate", name: "Business & Corporate", slug: "business-corporate", premiumInventory: true },
  { key: "real-estate-construction", name: "Real Estate & Construction", slug: "real-estate-construction", premiumInventory: true },
  { key: "bankruptcy-finance", name: "Bankruptcy & Finance", slug: "bankruptcy-finance", premiumInventory: true },
  { key: "civil-litigation", name: "Civil Litigation", slug: "civil-litigation", premiumInventory: true },
  { key: "government-benefits", name: "Government Benefits", slug: "government-benefits", premiumInventory: false },
  { key: "specialized-law", name: "Specialized Law", slug: "specialized-law", premiumInventory: false },
];

const PRACTICE_AREA_MARKETS: Record<string, string> = {
  "personal-injury": "personal-injury",
  "car-accidents": "personal-injury",
  "truck-accidents": "personal-injury",
  "motorcycle-accidents": "personal-injury",
  "bicycle-accidents": "personal-injury",
  "pedestrian-accidents": "personal-injury",
  "rideshare-accidents": "personal-injury",
  "slip-and-fall": "personal-injury",
  "premises-liability": "personal-injury",
  "medical-malpractice": "personal-injury",
  "nursing-home-abuse": "personal-injury",
  "product-liability": "personal-injury",
  "wrongful-death": "personal-injury",
  "catastrophic-injury": "personal-injury",
  "brain-injury": "personal-injury",
  "spinal-cord-injury": "personal-injury",
  "dog-bites": "personal-injury",
  "criminal-law": "criminal-defense",
  "dwi-dui": "criminal-defense",
  "drug-crimes": "criminal-defense",
  "assault": "criminal-defense",
  "domestic-violence-defense": "criminal-defense",
  "theft": "criminal-defense",
  "sex-crimes": "criminal-defense",
  "white-collar-crimes": "criminal-defense",
  "juvenile-defense": "criminal-defense",
  "federal-crimes": "criminal-defense",
  "expungement": "criminal-defense",
  "probation-violations": "criminal-defense",
  "divorce": "family-law",
  "child-custody": "family-law",
  "child-support": "family-law",
  "adoption": "family-law",
  "prenuptial-agreements": "family-law",
  "protective-orders": "family-law",
  "fathers-rights": "family-law",
  "grandparents-rights": "family-law",
  "legal-separation": "family-law",
  "family-immigration": "immigration",
  "employment-visas": "immigration",
  "citizenship": "immigration",
  "green-cards": "immigration",
  "deportation-defense": "immigration",
  "asylum": "immigration",
  "daca": "immigration",
  "investor-visas": "immigration",
  "business-law": "business-corporate",
  "business-formation": "business-corporate",
  "corporate-law": "business-corporate",
  "contracts": "business-corporate",
  "commercial-transactions": "business-corporate",
  "commercial-litigation": "business-corporate",
  "mergers-and-acquisitions": "business-corporate",
  "partnership-disputes": "business-corporate",
  "franchise-law": "business-corporate",
  "estate-planning": "estate-planning-probate",
  "probate": "estate-planning-probate",
  "wills": "estate-planning-probate",
  "trusts": "estate-planning-probate",
  "guardianship": "estate-planning-probate",
  "elder-law": "estate-planning-probate",
  "estate-litigation": "estate-planning-probate",
  "asset-protection": "estate-planning-probate",
  "employment-law": "employment",
  "wrongful-termination": "employment",
  "workplace-discrimination": "employment",
  "sexual-harassment": "employment",
  "wage-and-hour": "employment",
  "employment-contracts": "employment",
  "noncompete-agreements": "employment",
  "employee-benefits": "employment",
  "real-estate": "real-estate-construction",
  "commercial-real-estate": "real-estate-construction",
  "residential-real-estate": "real-estate-construction",
  "landlord-tenant": "real-estate-construction",
  "construction-law": "real-estate-construction",
  "property-disputes": "real-estate-construction",
  "zoning-and-land-use": "real-estate-construction",
  "foreclosure": "real-estate-construction",
  "bankruptcy": "bankruptcy-finance",
  "chapter-7-bankruptcy": "bankruptcy-finance",
  "chapter-13-bankruptcy": "bankruptcy-finance",
  "business-bankruptcy": "bankruptcy-finance",
  "debt-defense": "bankruptcy-finance",
  "tax-law": "bankruptcy-finance",
  "tax-controversy": "bankruptcy-finance",
  "appeals": "civil-litigation",
  "insurance-disputes": "civil-litigation",
  "consumer-protection": "civil-litigation",
  "class-actions": "civil-litigation",
  "contract-disputes": "civil-litigation",
  "defamation": "civil-litigation",
  "constitutional-law": "civil-litigation",
  "social-security-disability": "government-benefits",
  "veterans-benefits": "government-benefits",
  "workers-compensation": "government-benefits",
  "administrative-law": "government-benefits",
  "education-law": "government-benefits",
  "intellectual-property": "specialized-law",
  "trademark-law": "specialized-law",
  "copyright-law": "specialized-law",
  "patent-law": "specialized-law",
  "entertainment-law": "specialized-law",
  "health-care-law": "specialized-law",
  "environmental-law": "specialized-law",
  "energy-law": "specialized-law",
  "oil-and-gas": "specialized-law",
  "aviation-law": "specialized-law",
  "maritime-law": "specialized-law",
  "international-law": "specialized-law",
  "nonprofit-law": "specialized-law",
};

const normalizeMarketValue = (value: unknown): string =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getMarketByKey = (value: unknown): LegalMarket | undefined => {
  const normalized = normalizeMarketValue(value);
  return LEGAL_MARKETS.find((market) => market.key === normalized);
};

const getMarketByName = (value: unknown): LegalMarket | undefined => {
  const normalized = normalizeMarketValue(value);
  return LEGAL_MARKETS.find(
    (market) =>
      normalizeMarketValue(market.name) === normalized ||
      normalizeMarketValue(market.slug) === normalized
  );
};

const getMarketForPracticeArea = (value: unknown): LegalMarket | undefined => {
  const normalized = normalizeMarketValue(value);
  const marketKey = PRACTICE_AREA_MARKETS[normalized];
  return marketKey ? getMarketByKey(marketKey) : undefined;
};
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
    throw new Error(
      "Supabase server credentials are not configured."
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

const resolveMarket = (
  value: unknown
): LegalMarket | undefined => {
  const input = String(value ?? "").trim();

  if (!input) return undefined;

  return (
    getMarketByKey(input) ||
    getMarketByName(input) ||
    getMarketForPracticeArea(input)
  );
};

const getFirmCommercialProduct = (
  firm: any
): CommercialProductDefinition =>
  getCommercialProductByPlanId(
    firm.plan_key ??
      firm.plan ??
      "free"
  );

const getFirmMarkets = (
  firm: any
): LegalMarket[] => {
  const values: unknown[] = [
    firm.category,
    ...(Array.isArray(firm.categories)
      ? firm.categories
      : []),
    ...(Array.isArray(firm.specialties)
      ? firm.specialties
      : []),
  ];

  const markets = values
    .map(resolveMarket)
    .filter(
      (
        market
      ): market is LegalMarket =>
        Boolean(market)
    );

  return Array.from(
    new Map(
      markets.map((market) => [
        market.key,
        market,
      ])
    ).values()
  );
};

const firmMatchesMarket = (
  firm: any,
  market: LegalMarket
): boolean =>
  getFirmMarkets(firm).some(
    (firmMarket) =>
      firmMarket.key === market.key
  );

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
      plan,
      market: requestedMarket,
      category,
    } = req.body ?? {};

    if (!plan) {
      return res
        .status(400)
        .json({
          success: false,
          available: false,
          error:
            "Plan is required.",
        });
    }

    if (!isSelfServicePlanId(plan)) {
      return res
        .status(400)
        .json({
          success: false,
          available: false,
          error:
            "This plan is not available for self-service purchase.",
        });
    }

    const product =
      getCommercialProductByPlanId(
        plan
      );

    if (!product.marketPlacement) {
      return res
        .status(200)
        .json({
          success: true,
          available: true,
          product: product.key,
        });
    }

    const market = resolveMarket(
      requestedMarket ?? category
    );

    if (!market) {
      return res
        .status(400)
        .json({
          success: false,
          available: false,
          error:
            "A valid legal market is required for premium placement.",
        });
    }

    if (!market.premiumInventory) {
      return res
        .status(200)
        .json({
          success: true,
          available: false,
          product: product.key,
          market: market.key,
          reason:
            "Premium placement is not currently offered in this legal market.",
        });
    }

    const supabase =
      getSupabaseServerClient();

    const {
      data,
      error,
    } =
      await supabase
        .from("firms")
        .select("*");

    if (error) {
      console.error(
        "Could not check plan availability:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          available: false,
          error:
            "Could not verify plan availability.",
        });
    }

    const firms =
      (data ?? []).filter(
        (firm: any) =>
          firm.is_active !== false
      );

    const placementsInMarket =
      firms.filter(
        (firm: any) => {
          const firmProduct =
            getFirmCommercialProduct(
              firm
            );

          return (
            firmProduct.marketPlacement &&
            firmMatchesMarket(
              firm,
              market
            )
          );
        }
      );

    const exclusiveInMarket =
      placementsInMarket.filter(
        (firm: any) =>
          getFirmCommercialProduct(
            firm
          ).competitorLockout
      );

    if (
      !product.competitorLockout &&
      exclusiveInMarket.length > 0
    ) {
      return res
        .status(200)
        .json({
          success: true,
          available: false,
          product: product.key,
          market: market.key,
          reason:
            "This legal market is currently reserved by a Market Exclusive firm.",
        });
    }

    if (
      product.competitorLockout &&
      placementsInMarket.length > 0
    ) {
      return res
        .status(200)
        .json({
          success: true,
          available: false,
          product: product.key,
          market: market.key,
          reason:
            "Market Exclusive is unavailable while another premium placement is active in this legal market.",
        });
    }

    const sameProductInMarket =
      placementsInMarket.filter(
        (firm: any) =>
          getFirmCommercialProduct(
            firm
          ).key === product.key
      );

    if (
      product.maxPerMarket !== null &&
      sameProductInMarket.length >=
        product.maxPerMarket
    ) {
      return res
        .status(200)
        .json({
          success: true,
          available: false,
          product: product.key,
          market: market.key,
          reason:
            `${product.displayName} is currently sold out in ${market.name}.`,
        });
    }

    return res
      .status(200)
      .json({
        success: true,
        available: true,
        product: product.key,
        market: market.key,
        counts: {
          sameProductInMarket:
            sameProductInMarket.length,
          premiumPlacementsInMarket:
            placementsInMarket.length,
          exclusiveInMarket:
            exclusiveInMarket.length,
          maxPerMarket:
            product.maxPerMarket,
        },
      });
  } catch (err: any) {
    console.error(
      "Plan availability error:",
      err
    );

    return res
      .status(500)
      .json({
        success: false,
        available: false,
        error:
          err?.message ||
          "Unable to check plan availability.",
      });
  }
}
