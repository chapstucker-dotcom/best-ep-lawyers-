import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Crown,
  ShieldCheck,
  Zap,
} from "lucide-react";

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
            Expert, compete for premium category visibility with Category
            Featured, or inquire about Category Exclusive placement.
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

        <div className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-3xl border-2 border-[#D4A62A] bg-white shadow-lg">
          <div className="grid gap-0 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="p-7 sm:p-9 lg:p-10">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#06224A]">
                    <Crown className="h-7 w-7 text-[#D4A62A]" />
                  </span>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#B88900]">
                      Highest Visibility Tier
                    </p>

                    <h3 className="mt-2 text-3xl font-extrabold text-[#06224A]">
                      Category Exclusive
                    </h3>

                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                      Secure the highest-visibility placement available in a
                      practice-area category. Category Exclusive opportunities
                      are limited and handled directly by our business team
                      based on category availability.
                    </p>
                  </div>
                </div>

                <span className="inline-flex rounded-full bg-[#FFF6D8] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#8A6500]">
                  1 Exclusive Firm Per Category
                </span>
              </div>

              <div className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {[
                  "Everything in Category Featured",
                  "Up to 20 practice areas",
                  "Premium top category placement",
                  "Full homepage exposure",
                  "Up to 20 attorney profiles",
                  "Priority lead routing",
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      <Check className="h-4 w-4" />
                    </span>

                    <span className="text-sm font-medium leading-6 text-slate-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center border-t border-[#D4A62A]/30 bg-[#06224A] p-7 text-white sm:p-9 lg:border-l lg:border-t-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#D4A62A]">
                Limited Availability
              </p>

              <h4 className="mt-3 text-2xl font-extrabold">
                Interested in Category Exclusive?
              </h4>

              <p className="mt-4 text-sm leading-6 text-white/75">
                Availability is reviewed by practice area. Pricing and
                placement details are provided directly by our business team.
              </p>

              <Link
                to="/for-law-firms"
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#D4A62A] px-6 py-4 font-extrabold text-[#06224A] transition hover:bg-[#E3B53A]"
              >
                Check Exclusive Availability
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-center text-sm leading-6 text-slate-500">
          Category Featured and Category Exclusive placement are limited and
          subject to availability. Category Exclusive inquiries are reviewed
          directly by our business team.
        </p>
      </div>
    </section>
  );
}
