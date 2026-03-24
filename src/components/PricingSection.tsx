import React from "react";

const plans = [
  {
    name: "Category Exclusive",
    price: "$5,000",
    period: "/ mo",
    badge: "MOST EXCLUSIVE",
    badgeColor: "bg-red-100 text-red-700 border-red-300",
    borderColor: "border-red-300",
    button: "Apply for Exclusivity",
    buttonColor: "bg-red-600 hover:bg-red-700 text-white",
    features: [
      "1 firm per category (hard limit)",
      "Top placement in category",
      "Category Owner badge",
      "Full homepage exposure",
      "Competitor lockout",
      "Up to 20 attorney profiles",
      "Everything in Category Featured, plus:",
      "Show all 16 inherited features"
    ],
    note: "Only 5 total available in El Paso"
  },
  {
    name: "Category Featured",
    price: "$2,000",
    period: "/ mo",
    badge: "POPULAR",
    badgeColor: "bg-yellow-100 text-yellow-700 border-yellow-300",
    borderColor: "border-yellow-300",
    button: "Become Featured",
    buttonColor: "bg-yellow-400 hover:bg-yellow-500 text-white",
    features: [
      "Premium placement under Exclusive",
      "Rotating homepage exposure",
      "Max 2 firms per category",
      "Priority lead routing",
      "Up to 10 attorney profiles",
      "Everything in Expert, plus:",
      "Show all 11 inherited features"
    ],
    note: "Limited to 10 firms total"
  },
  {
    name: "Expert",
    price: "$299",
    period: "/ mo",
    badge: "BEST VALUE",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-300",
    borderColor: "border-blue-300",
    button: "Upgrade to Expert",
    buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
    features: [
      "Enhanced firm profile",
      "Lead capture form",
      "Analytics dashboard",
      "Up to 5 attorney profiles",
      "Everything in Pro, plus:",
      "Show all 7 inherited features"
    ],
    note: "+$10/mo per additional attorney"
  },
  {
    name: "Pro",
    price: "$99",
    period: "/ mo",
    badge: null,
    badgeColor: "",
    borderColor: "border-gray-300",
    button: "Get Started",
    buttonColor: "bg-gray-900 hover:bg-gray-800 text-white",
    features: [
      "Website link on profile",
      "Multiple practice areas",
      "Up to 2 attorney profiles",
      "Everything in Free, plus:",
      "Show all 4 inherited features"
    ],
    note: "+$15/mo per additional attorney"
  },
  {
    name: "Free",
    price: "Free",
    period: "",
    badge: null,
    badgeColor: "",
    borderColor: "border-gray-200",
    button: "Start Free",
    buttonColor: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50",
    features: [
      "Firm name listing",
      "Address display",
      "Phone number",
      "One practice area focus"
    ],
    note: "No credit card required"
  }
];

export default function PricingSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-2">El Paso Law Firm Pricing</h2>
        <p className="text-center text-gray-600 mb-10">Limited availability. Category exclusivity enforced.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`flex flex-col border ${plan.borderColor} rounded-2xl bg-white shadow-sm p-6 relative`}
            >
              {plan.badge && (
                <span className={`absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full border text-xs font-bold uppercase ${plan.badgeColor}`}>{plan.badge}</span>
              )}
              <h3 className="text-xl font-bold mb-2 text-center mt-4">{plan.name}</h3>
              <div className="text-center mb-2">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-lg text-gray-500">{plan.period}</span>
              </div>
              <ul className="mb-4 mt-2 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">&#10003;</span>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.button === "Start Free" || plan.button === "Get Started" ? (
                <a href="/signup">
                  <button className={`mt-auto w-full py-2 rounded-xl font-semibold ${plan.buttonColor}`}>{plan.button}</button>
                </a>
              ) : (
                (() => {
                  const mailto = `mailto:support@best-ep-lawyers.com?subject=Apply for: ${encodeURIComponent(plan.name)}`;
                  return (
                    <a href={mailto}>
                      <button className={`mt-auto w-full py-2 rounded-xl font-semibold ${plan.buttonColor}`}>{plan.button}</button>
                    </a>
                  );
                })()
              )}
              <p className="text-xs text-gray-500 text-center mt-3">{plan.note}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm mt-8">Plans renew monthly. Cancel anytime. Upgrades take effect immediately.</p>
      </div>
    </section>
  );
}
