import { createClient } from "@supabase/supabase-js";

type PaidPlan =
  | "Category Featured"
  | "Category Exclusive";

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

const normalizePlan = (
  value: unknown
): string =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const normalizeCategory = (
  value: unknown
): string =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const firmMatchesCategory = (
  firm: any,
  category: string
): boolean => {
  const target =
    normalizeCategory(category);

  const values: string[] = [];

  if (firm.category) {
    values.push(
      String(firm.category)
    );
  }

  if (
    Array.isArray(
      firm.categories
    )
  ) {
    values.push(
      ...firm.categories.map(
        String
      )
    );
  }

  if (
    Array.isArray(
      firm.specialties
    )
  ) {
    values.push(
      ...firm.specialties.map(
        String
      )
    );
  }

  return values.some(
    (value) =>
      normalizeCategory(
        value
      ) === target
  );
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
      plan,
      category,
    } = req.body ?? {};

    if (
      !plan ||
      !category
    ) {
      return res
        .status(400)
        .json({
          success: false,
          available: false,
          error:
            "Plan and category are required.",
        });
    }

    const paidPlan =
      String(plan) as PaidPlan;

    if (
      paidPlan !==
        "Category Featured" &&
      paidPlan !==
        "Category Exclusive"
    ) {
      return res
        .status(200)
        .json({
          success: true,
          available: true,
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

    const featured =
      firms.filter(
        (firm: any) =>
          normalizePlan(
            firm.plan_key ??
              firm.plan
          ).includes(
            "featured"
          )
      );

    const exclusive =
      firms.filter(
        (firm: any) =>
          normalizePlan(
            firm.plan_key ??
              firm.plan
          ).includes(
            "exclusive"
          )
      );

    const featuredInCategory =
      featured.filter(
        (firm: any) =>
          firmMatchesCategory(
            firm,
            category
          )
      );

    const exclusiveInCategory =
      exclusive.filter(
        (firm: any) =>
          firmMatchesCategory(
            firm,
            category
          )
      );

    if (
      paidPlan ===
      "Category Featured"
    ) {
      if (
        exclusiveInCategory.length >
        0
      ) {
        return res
          .status(200)
          .json({
            success: true,
            available: false,
            reason:
              "This category is owned by a Category Exclusive firm.",
          });
      }

      if (
        featuredInCategory.length >=
        2
      ) {
        return res
          .status(200)
          .json({
            success: true,
            available: false,
            reason:
              "Category Featured is sold out in this practice area.",
          });
      }

      if (
        featured.length >= 10
      ) {
        return res
          .status(200)
          .json({
            success: true,
            available: false,
            reason:
              "All Category Featured positions are currently sold out.",
          });
      }
    }

    if (
      paidPlan ===
      "Category Exclusive"
    ) {
      if (
        exclusiveInCategory.length >=
        1
      ) {
        return res
          .status(200)
          .json({
            success: true,
            available: false,
            reason:
              "Category Exclusive is already sold in this practice area.",
          });
      }

      if (
        exclusive.length >= 5
      ) {
        return res
          .status(200)
          .json({
            success: true,
            available: false,
            reason:
              "All Category Exclusive positions are currently sold out.",
          });
      }
    }

    return res
      .status(200)
      .json({
        success: true,
        available: true,
        counts: {
          featuredTotal:
            featured.length,
          featuredInCategory:
            featuredInCategory.length,
          exclusiveTotal:
            exclusive.length,
          exclusiveInCategory:
            exclusiveInCategory.length,
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