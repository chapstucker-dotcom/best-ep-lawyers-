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

export const getMarketByKey = (
  key: string | null | undefined
): LegalMarket | undefined =>
  LEGAL_MARKETS.find((market) => market.key === key);

export const getMarketByName = (
  name: string | null | undefined
): LegalMarket | undefined =>
  LEGAL_MARKETS.find((market) => market.name === name);

export const getMarketForPracticeArea = (
  value: string | null | undefined
): LegalMarket | undefined => {
  if (!value) return undefined;

  const normalized = value.trim().toLowerCase();

  const practiceArea = categories.find(
    (item) =>
      item.slug.toLowerCase() === normalized ||
      item.title.toLowerCase() === normalized
  );

  if (!practiceArea) return undefined;

  return getMarketByName(practiceArea.category);
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
