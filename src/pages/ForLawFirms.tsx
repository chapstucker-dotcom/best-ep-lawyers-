import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  Scale,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import BusinessLeadForm from "@/components/BusinessLeadForm";
import WhyLawFirmsJoin from "@/components/WhyLawFirmsJoin";
import { useSeo } from "../hooks/use-seo";

export default function ForLawFirms() {
  useSeo({
    title: "For El Paso Law Firms | Advertising & Listings",
    description:
      "Learn about law firm listings, attorney profiles, premium category visibility, advertising opportunities, and business partnerships with El Paso's Best Lawyers.",
    path: "/for-law-firms",
  });

  const scrollToInquiry = () => {
    document
      .getElementById("business-inquiry")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-white/10 bg-[#06224A] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 font-bold"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4A62A] text-[#06224A]">
              <Scale className="h-5 w-5" />
            </span>

            <span>El Paso&apos;s Best Lawyers</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className="hidden rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white hover:text-[#06224A] sm:inline-flex"
            >
              View Pricing
            </Link>

            <Link
              to="/login"
              className="rounded-lg bg-[#D4A62A] px-4 py-2 text-sm font-bold text-[#06224A] transition hover:bg-[#E3B53A]"
            >
              Firm Login
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-[#06224A] px-4 pb-20 pt-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to directory
          </Link>

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4A62A]">
                For El Paso Law Firms
              </p>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Put your firm in front of people actively looking for legal help.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
                Build a stronger presence on El Paso&apos;s Best Lawyers
                with professional firm and attorney profiles, consultation
                opportunities, enhanced visibility, and limited premium
                category placement.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={scrollToInquiry}
                  className="inline-flex items-center justify-center rounded-xl bg-[#D4A62A] px-7 py-4 font-extrabold text-[#06224A] transition hover:bg-[#E3B53A]"
                >
                  Talk About Advertising
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>

                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 px-7 py-4 font-bold text-white transition hover:bg-white hover:text-[#06224A]"
                >
                  Compare Firm Plans
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard
                icon={<Search className="h-6 w-6" />}
                title="Local Search Visibility"
                description="Help consumers discover your firm while comparing lawyers by practice area."
              />

              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Attorney Profiles"
                description="Present your attorneys, experience, practice areas, and firm information professionally."
              />

              <FeatureCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="Engagement & Leads"
                description="Give prospective clients a direct path to learn more and request consultations."
              />

              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Limited Premium Placement"
                description="Compete for featured and exclusive category visibility where inventory is intentionally limited."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3C4] text-[#9A7000]">
            <Building2 className="h-7 w-7" />
          </div>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-[#B88900]">
            A Dedicated Law Firm Marketplace
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#06224A] sm:text-4xl">
            More than a basic directory listing.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            El Paso&apos;s Best Lawyers is designed to help consumers
            research local legal options while giving participating firms
            a professional place to present their practice.
          </p>
        </div>
      </section>

      <WhyLawFirmsJoin
        onListFirm={scrollToInquiry}
        onViewPricing={() => {
          window.location.href = "/pricing";
        }}
      />

      <section className="bg-[#F7F9FC] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white px-7 py-10 text-center shadow-sm sm:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B88900]">
            Simple Options
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-[#06224A] sm:text-4xl">
            Start free or choose more visibility.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Firms can begin with a complimentary listing and upgrade
            when they want enhanced profiles, lead tools, or premium
            category placement.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-xl bg-[#06224A] px-7 py-4 font-extrabold text-white transition hover:bg-[#0A315F]"
            >
              View Pricing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-7 py-4 font-bold text-[#06224A] transition hover:bg-slate-50"
            >
              Create Firm Account
            </Link>
          </div>
        </div>
      </section>

      <BusinessLeadForm />

      <section className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm leading-6 text-slate-500">
            El Paso&apos;s Best Lawyers is an independent legal directory
            and advertising platform. It is not a law firm and does not
            provide legal advice. Participation or paid placement does not
            constitute an endorsement or guarantee of legal services or results.
          </p>
        </div>
      </section>
    </main>
  );
}

type FeatureCardProps = {
 icon: ReactNode;
  title: string;
  description: string;
};

function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-[#D4A62A]">
        {icon}
      </div>

      <p className="mt-4 font-bold">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-white/65">
        {description}
      </p>
    </div>
  );
}