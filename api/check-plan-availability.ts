import { createClient } from "@supabase/supabase-js";

const SELF_SERVICE_PLAN_IDS = new Set(["free", "expert", "category-featured"]);

const isSelfServicePlanId = (value: unknown): boolean =>
  SELF_SERVICE_PLAN_IDS.has(String(value ?? "").trim().toLowerCase());

import {
  getCommercialProductByPlanId,
  type CommercialProductDefinition,
} from "../src/data/commercialModel";
import {
  getMarketByKey,
  getMarketByName,
  getMarketForPracticeArea,
  type LegalMarket,
} from "../src/data/platformModel";

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
