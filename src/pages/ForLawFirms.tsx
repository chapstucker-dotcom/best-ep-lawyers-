import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  FileText,
  Globe2,
  Megaphone,
  MousePointerClick,
  Scale,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import BusinessLeadForm from "@/components/BusinessLeadForm";
import WhyLawFirmsJoin from "@/components/WhyLawFirmsJoin";
import { useSeo } from "../hooks/use-seo";

const firmTypes = [
  "Solo Attorneys",
  "Small & Mid-Sized Firms",
  "Boutique & Specialty Practices",
  "Established Law Firms",
];

const visibilityBenefits = [
  "Local El Paso legal directory exposure",
  "Practice-area visibility",
  "Enhanced firm and attorney profiles",
  "Direct consultation opportunities on eligible plans",
  "Website and contact links",
  "Engagement analytics on eligible plans",
  "Limited Featured and Exclusive placement opportunities",
  "Visibility alongside relevant consumer legal content",
];

const productionFeatures = [
  {
    icon: Building2,
    title: "Premium Directory Presence",
    description:
      "Present your firm professionally across the directory and compete for stronger placement in relevant practice areas when premium inventory is available.",
  },
  {
    icon: UserRound,
    title: "Attorney Profiles",
    description:
      "Showcase attorneys with biographies, photos, credentials, experience, practice areas, and contact information available with your plan.",
  },
  {
    icon: MousePointerClick,
    title: "Lead & Contact Paths",
    description:
      "Give prospective clients clear ways to visit your website, contact your firm, and submit consultation inquiries when those tools are included with your plan.",
  },
  {
    icon: FileText,
    title: "Relevant Legal Content Visibility",
    description:
      "Build additional visibility across practice-area pages and relevant consumer legal resources throughout the directory.",
  },
  {
    icon: BarChart3,
    title: "Engagement Analytics",
    description:
      "Eligible plans can track profile engagement such as views, website activity, phone clicks, and other directory interactions.",
  },
  {
    icon: Megaphone,
    title: "Advertising Opportunities",
    description:
      "Discuss premium category placement, sponsorships, and other advertising opportunities with our business team.",
  },
];

export default function ForLawFirms() {
  const location = useLocation();
  useSeo({
    title: "For El Paso Law Firms | Advertising & Listings",
    description:
      "Build your law firm's presence on El Paso's Best Lawyers with firm listings, attorney profiles, lead tools, premium category visibility, advertising, and local search exposure.",
    path: "/for-law-firms",
  });

  useEffect(() => {
    if (location.hash !== "#business-inquiry") return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById("business-inquiry")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash]);

  const scrollToInquiry = () => {
    document.getElementById("business-inquiry")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-white/10 bg-[#06224A] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 font-bold">
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
                More visibility. More opportunities to connect.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
                El Paso&apos;s Best Lawyers connects people researching legal
                help with local attorneys and firms. Build a stronger presence
                with professional profiles, lead tools, advertising, and
                limited premium category visibility.
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

              <p className="mt-4 text-sm text-white/60">
                Complimentary firm listings are available.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard
                icon={<Search className="h-6 w-6" />}
                title="Findable by Practice Area"
                description="Help consumers discover your firm while researching El Paso lawyers by legal need."
              />

              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Professional Profiles"
                description="Present your firm and attorneys with clear, useful information for prospective clients."
              />

              <FeatureCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="Engagement & Leads"
                description="Eligible plans add consultation tools and engagement analytics."
              />

              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Premium Placement"
                description="Featured and Exclusive visibility is intentionally limited by category."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3C4] text-[#9A7000]">
              <Building2 className="h-7 w-7" />
            </div>

            <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-[#B88900]">
              A Local Legal Marketplace
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#06224A] sm:text-4xl">
              Built for El Paso. Built to help people compare local legal
              options.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              The platform is designed to make it easier for consumers to find
              law firms, compare attorneys, understand practice areas, read
              helpful legal information, and connect with firms that may fit
              their needs.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ConsumerValueCard
              number="01"
              title="Find the Right Law Firm"
              description="Consumers can explore El Paso firms by practice area and legal need."
            />

            <ConsumerValueCard
              number="02"
              title="Compare Local Lawyers"
              description="Profiles help people review attorneys, firms, experience, and areas of practice."
            />

            <ConsumerValueCard
              number="03"
              title="Read Helpful Legal Guides"
              description="Consumer-focused resources explain common legal issues and next steps."
            />

            <ConsumerValueCard
              number="04"
              title="Connect with Confidence"
              description="Clear contact paths help consumers move from research to contacting a firm."
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B88900]">
                Stand Out Where People Are Looking
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#06224A] sm:text-4xl">
                Build a stronger presence for your firm.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Your listing can do more than display a firm name and phone
                number. Enhanced options help present your attorneys, practice
                areas, contact information, and firm story throughout the
                directory.
              </p>

              <div className="mt-7 space-y-3">
                {visibilityBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3 text-slate-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#B88900]" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {productionFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#06224A] text-[#D4A62A]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-[#06224A]">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F9FC] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#06224A] text-[#D4A62A]">
              <Globe2 className="h-6 w-6" />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#B88900]">
              Search & Content Visibility
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#06224A] sm:text-4xl">
              Build a presence across search, directory pages, and emerging
              discovery tools.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              El Paso&apos;s Best Lawyers uses structured practice-area,
              attorney, firm, and consumer content to help search engines and
              AI-powered discovery systems understand how directory information
              is organized and what each page covers.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Search visibility depends on many factors outside our control, so
              placement or rankings on any search engine or AI service cannot be
              guaranteed.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-extrabold text-[#06224A]">
              Designed for local discovery
            </h3>

            <div className="mt-6 space-y-5">
              <SearchBenefit
                title="Practice-Area Pages"
                description="Dedicated local pages organize firms around the legal services consumers are researching."
              />

              <SearchBenefit
                title="Firm & Attorney Information"
                description="Structured profiles give search systems clearer context about participating firms and attorneys."
              />

              <SearchBenefit
                title="Consumer Legal Resources"
                description="Helpful legal content supports the research journey before a prospective client contacts a firm."
              />

              <SearchBenefit
                title="Structured Directory Architecture"
                description="Consistent page organization helps search engines and other discovery systems understand the directory."
              />
            </div>
          </div>
        </div>
      </section>

      <WhyLawFirmsJoin
        onListFirm={scrollToInquiry}
        onViewPricing={() => {
          window.location.href = "/pricing";
        }}
      />

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B88900]">
              Who It&apos;s For
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#06224A] sm:text-4xl">
              Built for firms that want stronger visibility in El Paso.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Whether you are building a new local presence or strengthening an
              established practice, the directory gives firms multiple ways to
              participate.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {firmTypes.map((firmType) => (
              <div
                key={firmType}
                className="rounded-2xl border border-slate-200 bg-[#F7F9FC] p-6 text-center"
              >
                <Building2 className="mx-auto h-7 w-7 text-[#B88900]" />
                <p className="mt-4 font-bold text-[#06224A]">{firmType}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#06224A] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4A62A]">
              Simple Process
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Build your presence in three steps.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <ProcessCard
              number="1"
              title="Claim Your Profile"
              description="Start with a complimentary firm listing and establish your directory presence."
            />

            <ProcessCard
              number="2"
              title="Showcase Your Firm"
              description="Add the firm and attorney information available with your selected plan."
            />

            <ProcessCard
              number="3"
              title="Expand Your Visibility"
              description="Use eligible lead tools, analytics, advertising, and premium placement as your firm grows."
            />
          </div>
        </div>
      </section>

      <section className="bg-[#F7F9FC] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white px-7 py-10 text-center shadow-sm sm:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B88900]">
            Complimentary Listing Available
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-[#06224A] sm:text-4xl">
            Start free. Add more visibility when it makes sense for your firm.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Begin with a complimentary listing or compare paid plans for
            enhanced profiles, consultation tools, analytics, and premium
            category visibility.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-[#D4A62A] px-7 py-4 font-extrabold text-[#06224A] transition hover:bg-[#E3B53A]"
            >
              Claim Your Complimentary Listing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-7 py-4 font-bold text-[#06224A] transition hover:bg-slate-50"
            >
              Compare Firm Plans
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#06224A] to-[#123D55]">
          <div className="grid gap-8 px-7 py-10 sm:px-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D4A62A]">
                Premium Opportunities
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-white">
                Featured, Exclusive, and custom advertising opportunities.
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-white/75">
                Premium inventory is intentionally limited. Availability and
                pricing can vary by practice area, placement, and campaign.
                Contact our business team to discuss current opportunities.
              </p>
            </div>

            <button
              type="button"
              onClick={scrollToInquiry}
              className="inline-flex items-center justify-center rounded-xl bg-[#D4A62A] px-7 py-4 font-extrabold text-[#06224A] transition hover:bg-[#E3B53A]"
            >
              Ask About Premium Placement
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <BusinessLeadForm />

      <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-bold uppercase tracking-[0.16em] text-[#06224A]">
            Built in El Paso. Built for El Paso. Dedicated to our community.
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-slate-500">
            Our mission is to make it easier for people to research local legal
            options while giving El Paso law firms a professional platform to
            present their practices and connect with prospective clients.
          </p>

          <p className="mx-auto mt-5 max-w-4xl text-xs leading-5 text-slate-400">
            El Paso&apos;s Best Lawyers is an independent legal directory and
            advertising platform. It is not a law firm and does not provide
            legal advice. Participation or paid placement does not constitute
            an endorsement, ranking of legal ability, or guarantee of clients,
            leads, search rankings, legal services, or case results.
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

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-[#D4A62A]">{icon}</div>

      <p className="mt-4 font-bold">{title}</p>

      <p className="mt-2 text-sm leading-6 text-white/65">{description}</p>
    </div>
  );
}

type ConsumerValueCardProps = {
  number: string;
  title: string;
  description: string;
};

function ConsumerValueCard({
  number,
  title,
  description,
}: ConsumerValueCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <span className="text-sm font-extrabold text-[#B88900]">{number}</span>

      <h3 className="mt-3 text-lg font-bold text-[#06224A]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

type SearchBenefitProps = {
  title: string;
  description: string;
};

function SearchBenefit({ title, description }: SearchBenefitProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF3C4] text-[#9A7000]">
        <CheckCircle2 className="h-5 w-5" />
      </div>

      <div>
        <h3 className="font-bold text-[#06224A]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </div>
  );
}

type ProcessCardProps = {
  number: string;
  title: string;
  description: string;
};

function ProcessCard({ number, title, description }: ProcessCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-7">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D4A62A] text-lg font-extrabold text-[#06224A]">
        {number}
      </span>

      <h3 className="mt-5 text-xl font-bold">{title}</h3>

      <p className="mt-3 leading-7 text-white/70">{description}</p>
    </article>
  );
}