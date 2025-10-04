import React from "react";
import { PLAN_COLORS, Plan } from "@/lib/constants";

export function Badge({ plan }: { plan: Plan }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        PLAN_COLORS[plan] || PLAN_COLORS.Free,
      ].join(" ")}
    >
      {plan}
    </span>
  );
}
