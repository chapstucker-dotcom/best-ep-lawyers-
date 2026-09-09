export const SELF_SERVICE_PLAN_IDS = [
  "free",
  "expert",
  "category-featured",
] as const;

export type SelfServicePlanId =
  (typeof SELF_SERVICE_PLAN_IDS)[number];

export const isSelfServicePlanId = (
  value: unknown
): value is SelfServicePlanId => {
  const normalized = String(
    value ?? ""
  )
    .trim()
    .toLowerCase();

  return SELF_SERVICE_PLAN_IDS.includes(
    normalized as SelfServicePlanId
  );
};

export const normalizeSelfServicePlanId = (
  value: unknown,
  fallback: SelfServicePlanId = "free"
): SelfServicePlanId => {
  const normalized = String(
    value ?? ""
  )
    .trim()
    .toLowerCase();

  return isSelfServicePlanId(
    normalized
  )
    ? normalized
    : fallback;
};