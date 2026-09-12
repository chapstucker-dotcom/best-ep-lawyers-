import {
  categories,
  getPracticeAreasByGroup,
  type PracticeArea,
  type PracticeAreaGroup,
} from "@/data/categories";

export type MarketKey =
  | "personal-injury"
  | "criminal-defense"
  | "family-law"
  | "immigration"
  | "business-corporate"
  | "estate-planning-probate"
  | "employment"
  | "real-estate-construction"
  | "bankruptcy-finance"
  | "civil-litigation"
  | "government-benefits"
  | "specialized-law";

export interface LegalMarket {
  key: MarketKey;
  name: PracticeAreaGroup;
  slug: string;
  premiumInventory: boolean;
  homepagePriority: number;
}

export interface PracticeAreaPageResolution {
  practiceArea?: PracticeArea;
  market?: LegalMarket;
}

export const LEGAL_MARKETS: LegalMarket[] = [
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

export const PREMIUM_MARKETS = LEGAL_MARKETS.filter(
  (market) => market.premiumInventory
);

const normalize = (value: string | null | undefined): string =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const PAGE_PATH_TO_PRACTICE_AREA_SLUG: Record<string, string> = {
  "/el-paso-pedestrian-accident-lawyers": "pedestrian-accidents",
  "/el-paso-bicycle-accident-lawyers": "bicycle-accidents",
  "/el-paso-uber-lyft-accident-lawyers": "rideshare-accidents",
  "/el-paso-citizenship-lawyers": "citizenship",
  "/el-paso-green-card-lawyers": "green-cards",
  "/el-paso-domestic-violence-lawyers": "domestic-violence-defense",
  "/el-paso-expunction-lawyers": "expungement",
  "/el-paso-federal-criminal-defense-lawyers": "federal-crimes",
  "/el-paso-white-collar-crime-lawyers": "white-collar-crimes",
  "/el-paso-probation-violation-lawyers": "probation-violations",
  "/el-paso-dog-bite-lawyers": "dog-bites",
  "/el-paso-traumatic-brain-injury-lawyers": "brain-injury",
  "/el-paso-18-wheeler-accident-lawyer": "truck-accidents",
  "/el-paso-truck-accident-lawyers": "truck-accidents",
  "/el-paso-semi-truck-accident-lawyer": "truck-accidents",
  "/el-paso-uncontested-divorce-lawyers": "divorce",
  "/el-paso-family-violence-lawyers": "domestic-violence-defense",
  "/el-paso-employment-contract-lawyers": "employment-contracts",
  "/el-paso-severance-agreement-lawyers": "employment-contracts",
  "/el-paso-tax-irs-lawyers": "tax-law",
  "/el-paso-landlord-tenant-lawyers": "landlord-tenant",
  "/el-paso-civil-rights-lawyers": "constitutional-law",
};

const PAGE_PATH_TO_MARKET_KEY: Record<string, MarketKey> = {
  "/el-paso-traffic-ticket-lawyers": "criminal-defense",
  "/el-paso-weapons-charges-lawyers": "criminal-defense",
  "/el-paso-construction-accident-lawyers": "personal-injury",
  "/el-paso-spousal-support-lawyers": "family-law",
  "/el-paso-visa-lawyers": "immigration",
  "/el-paso-felony-lawyers": "criminal-defense",
  "/el-paso-business-immigration-lawyers": "immigration",
  "/el-paso-retaliation-lawyers": "employment",
  "/el-paso-military-law-lawyers": "specialized-law",
};

export const getMarketByKey = (
  key: string | null | undefined
): LegalMarket | undefined =>
  LEGAL_MARKETS.find((market) => market.key === key);

export const getMarketByName = (
  name: string | null | undefined): LegalMarket | undefined =>
  LEGAL_MARKETS.find((market) => market.name === name);

export const getPracticeAreaByValue = (
  value: string | null | undefined
): PracticeArea | undefined => {
  if (!value) return undefined;

  const normalized = normalize(value);

  return categories.find(
    (item) =>
      normalize(item.slug) === normalized ||
      normalize(item.title) === normalized
  );
};

export const getMarketForPracticeArea = (
  value: string | null | undefined
): LegalMarket | undefined => {
  const practiceArea = getPracticeAreaByValue(value);

  if (!practiceArea) return undefined;

  return getMarketByName(practiceArea.category);
};

export const resolvePracticeAreaPage = (
  path: string | null | undefined,
  shortTitle: string | null | undefined): PracticeAreaPageResolution => {
  const normalizedPath = String(path ?? "").trim().toLowerCase();

  const mappedPracticeAreaSlug =
    PAGE_PATH_TO_PRACTICE_AREA_SLUG[normalizedPath];

  const practiceArea =
    getPracticeAreaByValue(mappedPracticeAreaSlug) ??
    getPracticeAreaByValue(shortTitle);

  if (practiceArea) {
    return {
      practiceArea,
      market: getMarketByName(practiceArea.category),
    };
  }

  const mappedMarketKey = PAGE_PATH_TO_MARKET_KEY[normalizedPath];

  if (mappedMarketKey) {
    return {
      market: getMarketByKey(mappedMarketKey),
    };
  }

  const normalizedTitle = normalize(shortTitle);

  const market = LEGAL_MARKETS.find(
    (item) =>
      normalize(item.name) === normalizedTitle ||
      normalize(item.slug) === normalizedTitle
  );

  return { market };
};

export const getMarketPracticeAreas = (
  market: LegalMarket | MarketKey
): PracticeArea[] => {
  const resolved =
    typeof market === "string"
      ? getMarketByKey(market)
      : market;

  if (!resolved) return [];

  return getPracticeAreasByGroup(resolved.name);
};

export const isPremiumMarket = (
  value: string | null | undefined
): boolean => {
  const byKey = value ? getMarketByKey(value) : undefined;
  const byName = value ? getMarketByName(value) : undefined;

  return Boolean(
    (byKey ?? byName)?.premiumInventory
  );
};
