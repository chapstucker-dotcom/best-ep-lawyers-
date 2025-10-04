export const CATEGORIES = [
  "Personal Injury",
  "Family Law",
  "Criminal Defense",
  "Immigration",
  "Real Estate",
  "Employment",
  "Business & Corporate",
  "Estate Planning & Probate",
  "Bankruptcy",
  "DUI / DWI",
  "Medical Malpractice",
  "Civil Rights",
] as const;

export type Category = typeof CATEGORIES[number];

export type Plan = "Free" | "Basic" | "Professional" | "Expert";

export const PLAN_COLORS: Record<Plan, string> = {
  Free: "bg-gray-100 text-gray-700 border-gray-200",
  Basic: "bg-blue-50 text-blue-800 border-blue-200",
  Professional: "bg-violet-50 text-violet-800 border-violet-200",
  Expert: "bg-amber-50 text-amber-900 border-amber-200",
};
