import { Link } from "react-router-dom";
import { ArrowRight, Crown, ShieldCheck, Zap } from "lucide-react";
import { plans } from "../data/plans";
import PricingCard from "./PricingCard";

export default function PricingSection() {
  const publicPlans = plans.filter(
    (plan) => plan.id !== "category-exclusive"
  );

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B88900]">
            Law Firm Memberships
          </p>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-[#06224A] sm:text-5xl">
            Choose the visibility your firm needs.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Start with a complimentary listing, build a stronger profile with
            Expert, or compete for premium category visibility with Category
            Featured.
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

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {publicPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl border border-[#D4A62A]/40 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="px-7 py-8 sm:px-9">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#06224A]">
                  <Crown className="h-5 w-5 text-[#D4A62A]" />
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B88900]">
                    Premium Opportunities
                  </p>
                  <h3 className="mt-1 text-2xl font-extrabold text-[#06224A]">
                    Looking for category exclusivity or custom advertising?
                  </h3>
                </div>
              </div>

              <p className="mt-5 max-w-3xl leading-7 text-slate-600">
                Exclusive category placement, sponsorships, and custom
                advertising opportunities are handled directly with our
                business team because availability and pricing depend on the
                category and campaign.
              </p>
            </div>

            <div className="border-t border-slate-100 px-7 py-7 lg:border-l lg:border-t-0 lg:px-9">
              <Link
                to="/for-law-firms"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#06224A] px-6 py-4 font-bold text-white transition hover:bg-[#0B3267] lg:w-auto"
              >
                Discuss Premium Options
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-center text-sm leading-6 text-slate-500">
          Premium category placement is limited and subject to availability.
          Advertising and sponsorship opportunities are reviewed separately
          from standard directory memberships.
        </p>
      </div>
    </section>
  );
}
