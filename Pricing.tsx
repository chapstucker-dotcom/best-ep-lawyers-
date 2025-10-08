import React from "react";

export function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      cta: "List my firm (Free)",
      features: [
        "1 photo",
        "Firm name & contact info",
        "1 practice area",
        "Appears in search",
      ],
    },
    {
      name: "Basic",
      price: "$9.99",
      period: "/month",
      cta: "Upgrade to Basic",
      features: [
        "Up to 3 photos",
        "About section",
        "Up to 3 practice areas",
        "Lead form (email)",
      ],
    },
    {
      name: "Professional",
      price: "$39.99",
      period: "/month",
      cta: "Get Professional",
      features: [
        "Photo gallery + logo",
        "Unlimited practice areas",
        "Reviews & FAQs",
        "Priority ranking (featured)",
      ],
    },
    {
      name: "Expert",
      price: "$99.99",
      period: "/month",
      cta: "Go Expert",
      features: [
        "Top-of-page placement",
        "Video showcase",
        "Case highlights",
        "Dedicated success manager",
      ],
    },
  ] as co
Fix Pricing.tsx - remove bad line and finalize code
  
