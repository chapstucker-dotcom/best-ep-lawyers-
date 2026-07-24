import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Crown,
  PhoneCall,
  Star,
  UserRound,
} from "lucide-react";

interface WhyLawFirmsJoinProps {
  onViewPricing: () => void;
  onListFirm: () => void;
}

const features = [
  {
    title: "Professional Firm Profile",
    description:
      "Present your firm with a polished public profile featuring your logo, description, attorneys, practice areas, and contact information.",
    icon: Building2,
  },
  {
    title: "Attorney Profiles",
    description:
      "Showcase individual attorneys with professional photos, biographies, education, credentials, and areas of practice.",
    icon: UserRound,
  },
  {
    title: "Consultation Requests",
    description:
      "Receive inquiries from people actively searching for legal assistance in El Paso and surrounding communities.",
    icon: PhoneCall,
  },
  {
    title: "Analytics Dashboard",
    description:
      "Track profile views, phone clicks, email activity, website visits, and visitor engagement from one dashboard.",
    icon: BarChart3,
  },
  {
    title: "Premium Visibility",
    description:
      "Gain stronger placement in search results, featured sections, and high-value practice-area categories.",
    icon: Star,
  },
  {
    title: "Category Exclusive",
    description:
      "Own your practice area with top placement, a Category Owner badge, competitor lockout, and maximum exposure.",
    icon: Crown,
  },
];

const benefits = [
  "Free listings available",
  "Professional attorney profiles",
  "Local El Paso search visibility",
  "Direct consultation requests",
  "Profile engagement analytics",
  "Limited premium placements",
];

export default function WhyLawFirmsJoin({
  onViewPricing,
  onListFirm,
}: WhyLawFirmsJoinProps) {
  return (
    <section
      id="for-law-firms"
      className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B88900]">
            Built for Local Law Firms
          </p>

          <h2 className="mt-4 text-3xl font-bold text-[#06224A] sm:text-4xl lg:text-5xl">
            Why El Paso Law Firms Join
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Build your local presence, showcase your attorneys, connect with
            potential clients, and compete for premium visibility in the
            practice areas that matter most.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#D4A62A]/60 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#06224A] text-[#D4A62A] transition group-hover:bg-[#D4A62A] group-hover:text-[#06224A]">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#06224A]">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl bg-[#06224A]">
          <div className="grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center lg:px-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D4A62A]">
                Local by Design
              </p>

              <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Built specifically for El Paso law firms.
              </h3>

              <p className="mt-4 max-w-3xl leading-7 text-white/75">
                El Paso&apos;s Best Lawyers is not a national directory trying
                to serve every city. The platform is designed around local
                searches, local practice areas, and the needs of El Paso firms.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 text-sm text-white/85"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#D4A62A]" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={onListFirm}
                className="inline-flex items-center justify-center rounded-xl bg-[#D4A62A] px-6 py-4 font-bold text-[#06224A] transition hover:bg-[#E4B638]"
              >
                Start Your Listing
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={onViewPricing}
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-4 font-bold text-white transition hover:bg-white hover:text-[#06224A]"
              >
                Compare Firm Plans
              </button>

              <p className="text-center text-xs leading-5 text-white/55">
                Start with a free listing. Upgrade when your firm is ready for
                enhanced features or premium placement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}