import { useNavigate } from "react-router-dom";
import { Check, Crown, Sparkles } from "lucide-react";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import type { Plan } from "../data/types";

interface PricingCardProps {
  plan: Plan;
}

export default function PricingCard({ plan }: PricingCardProps) {
  const navigate = useNavigate();
  const isPopular = plan.id === "category-featured";
  const isExclusive = plan.id === "category-exclusive";
  const isFree = plan.id === "free";

  const handleSelectPlan = () => {
    navigate(`/signup?plan=${encodeURIComponent(plan.id)}`);
  };

  return (
    <Card
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl ${
        isPopular
          ? "border-2 border-[#D4A62A] shadow-lg"
          : isExclusive
            ? "border-[#0F2A43]/20"
            : "border-slate-200"
      }`}
    >
      {isPopular && (
        <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-[#D4A62A] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#06224A]">
          <Sparkles className="h-3.5 w-3.5" />
          Most Popular
        </div>
      )}

      {isExclusive && (
        <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-[#06224A] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
          <Crown className="h-3.5 w-3.5 text-[#D4A62A]" />
          Limited
        </div>
      )}

      <div className="mb-6 pr-24">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B88900]">
          {isFree ? "Get listed" : "Grow your visibility"}
        </p>
        <h3 className="mt-2 text-2xl font-extrabold text-[#06224A]">
          {plan.name}
        </h3>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-extrabold tracking-tight text-[#06224A]">
            ${plan.priceMonth.toLocaleString()}
          </span>
          <span className="pb-1 text-sm font-semibold text-slate-500">
            /month
          </span>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {isFree
            ? "A professional starting point for your firm."
            : plan.id === "expert"
              ? "For firms ready to capture leads and measure engagement."
              : plan.id === "category-featured"
                ? "For firms competing for prominent placement in high-value categories."
                : "For firms that want category ownership and maximum visibility."}
        </p>
      </div>

      <div className="mb-7 h-px bg-slate-100" />

      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm leading-6 text-slate-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        onClick={handleSelectPlan}
        className={`h-12 w-full rounded-xl font-bold ${
          isPopular || isExclusive
            ? "bg-[#06224A] text-white hover:bg-[#0B3267]"
            : "bg-[#D4A62A] text-[#06224A] hover:bg-[#E3B53A]"
        }`}
      >
        {isFree ? "Create Free Listing" : `Choose ${plan.name}`}
      </Button>

      <p className="mt-3 text-center text-xs text-slate-400">
        Create your account and complete your profile online.
      </p>
    </Card>
  );
}
