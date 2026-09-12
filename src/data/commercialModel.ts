export type CommercialProductKey =
  | "free"
  | "expert"
  | "featured"
  | "premier"
  | "market_exclusive";

export type CommercialInventoryScope =
  | "basic_listing"
  | "enhanced_profile"
  | "market_featured"
  | "market_premier"
  | "market_exclusive";

export type LegacyPlanId =
  | "free"
  | "expert"
  | "category-featured"
  | "category-exclusive";

export interface CommercialProductDefinition {
  key: CommercialProductKey;
  displayName: string;
  inventoryScope: CommercialInventoryScope;

  premium: boolean;
  selfServiceEligible: boolean;
  homepageEligible: boolean;

  marketPlacement: boolean;
  competitorLockout: boolean;

  placementPriority: number;
  maxPerMarket: number | null;

  legacyPlanIds: readonly LegacyPlanId[];
}

export const COMMERCIAL_PRODUCTS: Record<
  CommercialProductKey,
  CommercialProductDefinition
> = {
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

export function getCommercialProduct(
  key: CommercialProductKey
): CommercialProductDefinition {
  return COMMERCIAL_PRODUCTS[key];
}

export function getCommercialProductByPlanId(
  value: unknown
): CommercialProductDefinition {
  const normalized = normalizePlanId(value);

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

export function isPremiumCommercialProduct(
  value: unknown
): boolean {
  return getCommercialProductByPlanId(value).premium;
}

export function isMarketPlacementProduct(
  value: unknown
): boolean {
  return getCommercialProductByPlanId(value).marketPlacement;
}
