import { ArrowRight, Building2, Crown, MapPin, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface LawFirmMarketplaceProps {
  firmCount: number;
  categoryCount: number;
}

export default function LawFirmMarketplace({
  firmCount,
  categoryCount,
}: LawFirmMarketplaceProps) {
  const firmLabel = firmCount === 1 ? "firm" : "firms";
  const categoryLabel = categoryCount === 1 ? "practice area" : "practice areas";

  return (
    <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800">
              <Sparkles className="h-4 w-4" />
              Built to compete locally
            </div>

            <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              A local legal marketplace with premium positions that stay limited.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              El Paso&apos;s Best Lawyers is designed around local search, strong public firm profiles,
              attorney visibility, consultation requests, and premium category placement without
              overcrowding every practice area.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup?plan=free"
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-slate-800"
              >
                Create Firm Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-4 font-bold text-slate-950 transition hover:border-amber-400 hover:bg-amber-50"
              >
                Compare Memberships
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-amber-400">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="mt-5 text-3xl font-extrabold text-slate-950">{firmCount}</div>
              <p className="mt-1 font-semibold text-slate-800">Listed {firmLabel}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Public firm profiles currently available in the directory.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-amber-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="mt-5 text-3xl font-extrabold text-slate-950">{categoryCount}</div>
              <p className="mt-1 font-semibold text-slate-800">Local {categoryLabel}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Organized around the legal services El Paso residents search for.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                <Star className="h-5 w-5" />
              </div>
              <div className="mt-5 text-3xl font-extrabold text-slate-950">2</div>
              <p className="mt-1 font-semibold text-slate-800">Featured firms per category</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Category Featured inventory is capped to protect premium visibility.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-300 bg-slate-950 p-6 text-white shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                <Crown className="h-5 w-5" />
              </div>
              <div className="mt-5 text-3xl font-extrabold">1</div>
              <p className="mt-1 font-semibold">Category Owner per category</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Exclusive placement includes top position, Category Owner status, and competitor lockout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
