import {
  ArrowRight,
  Building2,
  MapPin,
  PhoneCall,
  Search,
  Sparkles,
} from "lucide-react";

interface LawFirmMarketplaceProps {
  firmCount: number;
  categoryCount: number;
}

export default function LawFirmMarketplace({
  firmCount,
  categoryCount,
}: LawFirmMarketplaceProps) {
  const firmLabel =
    firmCount === 1 ? "firm" : "firms";

  const categoryLabel =
    categoryCount === 1
      ? "practice area"
      : "practice areas";

  const scrollToSection = (
    sectionId: string
  ) => {
    const section =
      document.getElementById(sectionId);

    if (!section) {
      console.error(
        `Homepage section not found: ${sectionId}`
      );
      return;
    }

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800">
              <Sparkles className="h-4 w-4" />
              Find the right El Paso lawyer
            </div>

            <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Find an El Paso lawyer for your
              legal needs.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Compare local law firms by
              practice area, explore firm
              profiles, and connect directly
              with attorneys serving El Paso
              and the surrounding community.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  scrollToSection("search")
                }
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-slate-800"
              >
                Find a Lawyer

                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollToSection("categories")
                }
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-4 font-bold text-slate-950 transition hover:border-amber-400 hover:bg-amber-50"
              >
                Browse Practice Areas
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-amber-400">
                <Building2 className="h-5 w-5" />
              </div>

              <div className="mt-5 text-3xl font-extrabold text-slate-950">
                {firmCount}
              </div>

              <p className="mt-1 font-semibold text-slate-800">
                Local {firmLabel}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Explore law firms serving El
                Paso and surrounding
                communities.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-amber-400">
                <MapPin className="h-5 w-5" />
              </div>

              <div className="mt-5 text-3xl font-extrabold text-slate-950">
                {categoryCount}
              </div>

              <p className="mt-1 font-semibold text-slate-800">
                Legal {categoryLabel}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Find attorneys based on the
                type of legal help you need.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                <PhoneCall className="h-5 w-5" />
              </div>

              <div className="mt-5 text-2xl font-extrabold text-slate-950">
                Direct Contact
              </div>

              <p className="mt-1 font-semibold text-slate-800">
                Connect with law firms
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Call firms or visit their
                websites directly from their
                profiles.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-300 bg-slate-950 p-6 text-white shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                <Search className="h-5 w-5" />
              </div>

              <div className="mt-5 text-2xl font-extrabold">
                El Paso Focused
              </div>

              <p className="mt-1 font-semibold">
                Built for local legal searches
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                A legal directory organized
                around the firms and practice
                areas El Paso residents search
                for.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}