import React from "react";

export function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      cta: "List my firm (Free)",
      features: ["1 photo", "Firm name & contact info", "1 practice area", "Appears in search"],
    },
    {
      name: "Basic",
      price: "$9.99",
      period: "/month",
      cta: "Upgrade to Basic",
      features: ["Up to 3 photos", "About section", "Up to 3 practice areas", "Lead form (email)"],
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$39.99",
      period: "/month",
      cta: "Get Professional",
      features: ["Photo gallery + logo", "Unlimited practice areas", "Reviews & FAQs", "Priority ranking (featured)"],
      highlighted: true,
    },
    {
      name: "Expert",
      price: "$99.99",
      period: "/month",
      cta: "Go Expert",
      features: ["Top-of-page placement", "Video showcase", "Case highlights", "Dedicated success manager"],
    },
  ] as const;

  return (
    <section id="pricing" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold tracking-tight">Plans for Law Firms</h2>
        <p className="mt-2 text-gray-600">Start free. Upgrade any time for more exposure and features.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={["rounded-2xl border bg-white p-6 shadow-sm", t.highlighted ? "ring-2 ring-amber-400" : ""].join(" ")}
            >
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-semibold">{t.name}</h3>
              </div>
              <p className="mt-4 text-3xl font-bold">
                {t.price}
                <span className="text-base font-medium text-gray-500">{t.period}</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="/admin" className="mt-6 block w-full rounded-xl bg-black px-4 py-2 text-center text-white transition hover:opacity-90">
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
