import { ShieldCheck, Zap } from "lucide-react";
import { plans } from "../data/plans";
import PricingCard from "./PricingCard";

export default function PricingSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B88900]">
            Law Firm Memberships
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-[#06224A] sm:text-5xl">
            Choose the visibility your firm wants.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Start with a complimentary listing or upgrade for richer profiles,
            lead capture, analytics, and premium category placement.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3 text-sm font-semibold text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              No long-term contract
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
              <Zap className="h-4 w-4 text-[#B88900]" />
              Upgrade when you are ready
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-[#D4A62A]/40 bg-[#FFF9E8] px-6 py-5 text-center">
          <p className="font-bold text-[#06224A]">
            Premium category inventory is intentionally limited.
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Category Featured allows no more than two firms per category. Category
            Exclusive allows one firm per category and includes competitor lockout.
          </p>
        </div>
      </div>
    </section>
  );
}
