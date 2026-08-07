import { useNavigate } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import type { Plan } from "../data/types";

interface PricingCardProps {
  plan: Plan;
}

function getSignupPlan(name: string) {
  const normalized = name.toLowerCase();

  if (normalized.includes("exclusive")) return "exclusive";
  if (normalized.includes("featured")) return "featured";
  if (normalized.includes("expert")) return "expert";
  if (normalized.includes("pro")) return "pro";

  return "free";
}

export default function PricingCard({ plan }: PricingCardProps) {
  const navigate = useNavigate();

  const signupPlan = getSignupPlan(plan.name);

  const handleSelectPlan = () => {
    navigate(`/signup?plan=${signupPlan}`);
  };

  return (
    <Card
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        plan.isFeatured
          ? "border-amber-400 shadow-lg ring-1 ring-amber-400"
          : "border-slate-200 shadow-sm"
      }`}
    >
      {plan.isFeatured && (
        <div className="bg-amber-400 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-950">
          Most Popular
        </div>
      )}

      <div className="flex h-full flex-col p-7">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-950">
            {plan.name}
          </h3>

          <div className="mt-4 flex items-end gap-1">
            <span className="text-4xl font-extrabold tracking-tight text-slate-950">
              ${plan.priceMonth}
            </span>

            <span className="pb-1 text-sm font-medium text-slate-500">
              /month
            </span>
          </div>

          {plan.attorneyProfileLimit > 0 && (
            <p className="mt-2 text-sm text-slate-500">
              Includes up to {plan.attorneyProfileLimit} attorney{" "}
              {plan.attorneyProfileLimit === 1 ? "profile" : "profiles"}
            </p>
          )}
        </div>

        <div className="mb-7 h-px bg-slate-200" />

        <ul className="mb-8 flex-1 space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <Check className="h-3.5 w-3.5 text-amber-700" />
              </div>

              <span className="text-sm leading-6 text-slate-700">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <Button
          type="button"
          size="lg"
          onClick={handleSelectPlan}
          className={
            plan.isFeatured
              ? "w-full bg-amber-400 font-bold text-slate-950 hover:bg-amber-300"
              : "w-full bg-slate-950 font-bold text-white hover:bg-slate-800"
          }
        >
          Choose {plan.name}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <p className="mt-3 text-center text-xs leading-5 text-slate-500">
          Create your account and complete your firm profile.
        </p>
      </div>
    </Card>
  );
}