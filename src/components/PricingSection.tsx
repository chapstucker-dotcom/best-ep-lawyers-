import React from "react";
import { plans } from "../data/plans";
import { calculateSubscriptionPrice } from "../utils/pricing";

export default function PricingSection() {
  // Default to 1 attorney for price display
  const defaultAttorneyCount = 1;
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-2">El Paso Law Firm Pricing</h2>
        <p className="text-center text-gray-600 mb-10">Limited availability. Category exclusivity enforced.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <div
              key={plan.id}
              className="flex flex-col border border-gray-300 rounded-2xl bg-white shadow-sm p-6 relative"
            >
              {plan.isFeatured && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full border text-xs font-bold uppercase bg-yellow-100 text-yellow-700 border-yellow-300">FEATURED</span>
              )}
              <h3 className="text-xl font-bold mb-2 text-center mt-4">{plan.name}</h3>
              <div className="text-center mb-2">
                <span className="text-4xl font-extrabold">${calculateSubscriptionPrice(plan, defaultAttorneyCount).toFixed(2)}</span>
                <span className="text-lg text-gray-500">/ mo</span>
              </div>
              <ul className="mb-4 mt-2 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">&#10003;</span>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="/signup">
                <button className="mt-auto w-full py-2 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white">Get Started</button>
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm mt-8">Plans renew monthly. Cancel anytime. Upgrades take effect immediately.</p>
      </div>
    </section>
  );
}


