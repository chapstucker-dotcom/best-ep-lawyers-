import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import PricingCard from "./PricingCard";
import { plans } from "../data/plans";

export default function PricingSection() {
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
            <Sparkles className="h-4 w-4" />
            Built for El Paso law firms
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Choose how prominently your firm appears
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Start with the plan that fits your firm today, then upgrade as you
            want more visibility, attorney profiles, lead tools, and premium
            placement.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-950">
                  Premium category inventory is intentionally limited
                </h3>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                  Featured and exclusive placements are designed to protect
                  visibility within each practice area rather than overcrowd
                  every category with paid listings.
                </p>
              </div>
            </div>

            <Link
              to="/pricing"
              className="inline-flex items-center justify-center font-semibold text-slate-950 hover:text-amber-700"
            >
              Compare all plan details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-slate-500">
          Plans renew monthly unless otherwise stated. Directory participation
          does not guarantee leads, clients, search rankings, or case outcomes.
        </p>
      </div>
    </section>
  );
}