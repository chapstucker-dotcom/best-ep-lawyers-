export type PlanKey =
  | "free"
  | "expert"
  | "category_featured"
  | "category_exclusive";

export interface PlanRules {
  id: PlanKey;
  displayName: string;

  practiceAreas: number;
  attorneyLimit: number;

  video: boolean;
  analytics: boolean;
  leadForm: boolean;

  featuredPlacement: boolean;
  homepageRotation: boolean;

  categoryOwner: boolean;
  competitorLockout: boolean;

  priorityLeadRouting: number;
}

export const PLAN_RULES: Record<PlanKey, PlanRules> = {
  free: {
    id: "free",
    displayName: "Free",

    practiceAreas: 1,
    attorneyLimit: 0,

    video: false,
    analytics: false,
    leadForm: false,

    featuredPlacement: false,
    homepageRotation: false,

    categoryOwner: false,
    competitorLockout: false,

    priorityLeadRouting: 4,
  },

  expert: {
    id: "expert",
    displayName: "Expert",

    practiceAreas: 5,
    attorneyLimit: 5,

    video: false,
    analytics: true,
    leadForm: true,

    featuredPlacement: false,
    homepageRotation: false,

    categoryOwner: false,
    competitorLockout: false,

    priorityLeadRouting: 3,
  },

  category_featured: {
    id: "category_featured",
    displayName: "Category Featured",

    practiceAreas: 10,
    attorneyLimit: 10,

    video: true,
    analytics: true,
    leadForm: true,

    featuredPlacement: true,
    homepageRotation: true,

    categoryOwner: false,
    competitorLockout: false,

    priorityLeadRouting: 2,
  },

  category_exclusive: {
    id: "category_exclusive",
    displayName: "Category Exclusive",

    practiceAreas: 20,
    attorneyLimit: 20,

    video: true,
    analytics: true,
    leadForm: true,

    featuredPlacement: true,
    homepageRotation: false,

    categoryOwner: true,
    competitorLockout: true,

    priorityLeadRouting: 1,
  },
};

export function getPlanRules(
  plan?: string | null
): PlanRules {
  const normalized = String(plan ?? "free")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (normalized === "pro") {
    return PLAN_RULES.expert;
  }

  return (
    PLAN_RULES[
      normalized as PlanKey
    ] ?? PLAN_RULES.free
  );
}