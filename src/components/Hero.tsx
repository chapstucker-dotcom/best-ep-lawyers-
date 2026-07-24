import {
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  PlayCircle,
  Scale,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  useState,
  type FormEvent,
} from "react";

import { Link } from "react-router-dom";

import heroImage from "../assets/hero-franklin-star.png";

interface HeroProps {
  onSearch: (query: string) => void;
}

const practiceAreas = [
  "Personal Injury",
  "Car Accidents",
  "Truck Accidents",
  "Criminal Defense",
  "DWI / DUI",
  "Family Law",
  "Divorce",
  "Child Custody",
  "Immigration",
  "Business Law",
  "Probate",
  "Estate Planning",
  "Employment Law",
  "Civil Litigation",
  "Bankruptcy",
  "Real Estate Law",
];

export default function Hero({
  onSearch,
}: HeroProps) {
  const [searchQuery, setSearchQuery] =
    useState("");

  const [
    showSuggestions,
    setShowSuggestions,
  ] = useState(false);

  const filteredSuggestions =
    searchQuery.trim().length > 0
      ? practiceAreas
          .filter((area) =>
            area
              .toLowerCase()
              .includes(
                searchQuery
                  .trim()
                  .toLowerCase()
              )
          )
          .slice(0, 6)
      : [];

  const scrollToSection = (
    id: string
  ) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    onSearch(searchQuery.trim());
    setShowSuggestions(false);
  };

  const chooseSuggestion = (
    area: string
  ) => {
    setSearchQuery(area);
    onSearch(area);
    setShowSuggestions(false);
  };

  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(2,27,69,0.97) 0%, rgba(2,27,69,0.91) 45%, rgba(2,27,69,0.68) 100%), url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#021B45]/30" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
        <header className="mb-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4A62A] text-[#021B45] shadow-lg">
              <Scale className="h-7 w-7" />
            </span>

            <span>
              <span className="block text-xl font-bold sm:text-2xl">
                El Paso&apos;s Best Lawyers
              </span>

              <span className="hidden text-sm text-white/70 sm:block">
                El Paso&apos;s Trusted Legal
                Directory
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            <button
              type="button"
              onClick={() =>
                scrollToSection("search")
              }
              className="font-medium text-white/85 transition hover:text-[#D4A62A]"
            >
              Find Lawyers
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection("categories")
              }
              className="font-medium text-white/85 transition hover:text-[#D4A62A]"
            >
              Practice Areas
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection("pricing")
              }
              className="font-medium text-white/85 transition hover:text-[#D4A62A]"
            >
              Pricing
            </button>

            <Link
              to="/login"
              className="font-medium text-white/85 transition hover:text-[#D4A62A]"
            >
              Login
            </Link>

            <button
              type="button"
              onClick={() =>
                scrollToSection("list-form")
              }
              className="rounded-lg bg-[#D4A62A] px-5 py-3 font-bold text-[#021B45] shadow-lg transition hover:bg-[#E3B53A]"
            >
              List Your Firm
            </button>
          </nav>
        </header>

        <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4A62A]/40 bg-[#D4A62A]/15 px-4 py-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-[#D4A62A]" />
                Built Exclusively for El Paso
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
                <ShieldCheck className="h-4 w-4 text-[#D4A62A]" />
                Local Legal Directory
              </span>
            </div>

            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#D4A62A]">
              Find Counsel. Build Visibility.
            </p>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              El Paso&apos;s Premier
              Attorney Directory
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 sm:text-xl">
              Helping El Paso residents find
              trusted local attorneys while giving
              law firms the professional profiles,
              visibility, lead tools, and analytics
              they need to grow.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  scrollToSection("search")
                }
                className="inline-flex h-13 items-center justify-center rounded-lg bg-[#D4A62A] px-7 py-4 font-bold text-[#021B45] shadow-xl transition hover:bg-[#E3B53A]"
              >
                Find a Lawyer
                <Search className="ml-2 h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollToSection("list-form")
                }
                className="inline-flex h-13 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white hover:text-[#021B45]"
              >
                List Your Firm
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollToSection("demo")
                }
                className="inline-flex h-13 items-center justify-center rounded-lg px-5 py-4 font-semibold text-white/90 transition hover:text-[#D4A62A]"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch How It Works
              </button>
            </div>

            <p className="mt-4 text-sm text-white/65">
              Free firm listings available.
              Premium category placements are
              limited.
            </p>
          </div>

          <aside className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md lg:p-7">
            <p className="text-sm font-bold uppercase tracking-widest text-[#D4A62A]">
              For El Paso Law Firms
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Build Your Firm&apos;s Local
              Presence
            </h2>

            <p className="mt-3 leading-7 text-white/75">
              Create a professional listing,
              showcase your attorneys, receive
              consultation requests, and track
              visitor engagement from one
              dashboard.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A62A]" />
                <div>
                  <p className="font-semibold">
                    Professional Firm Profile
                  </p>
                  <p className="text-sm text-white/65">
                    Present your practice,
                    attorneys, and services.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A62A]" />
                <div>
                  <p className="font-semibold">
                    Consultation Requests
                  </p>
                  <p className="text-sm text-white/65">
                    Connect with potential clients
                    searching for legal help.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A62A]" />
                <div>
                  <p className="font-semibold">
                    Premium Category Placement
                  </p>
                  <p className="text-sm text-white/65">
                    Secure prominent visibility in
                    high-value practice areas.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                scrollToSection("pricing")
              }
              className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 font-bold text-[#021B45] transition hover:bg-[#D4A62A]"
            >
              View Firm Plans
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </aside>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative z-20 mt-12"
        >
          <div className="rounded-2xl bg-white p-3 shadow-2xl sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Search by lawyer, firm, or practice area..."
                  className="h-14 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1FA8A1] focus:ring-2 focus:ring-[#1FA8A1]/20"
                  onChange={(event) => {
                    setSearchQuery(
                      event.target.value
                    );
                    setShowSuggestions(true);
                  }}
                  onFocus={() =>
                    setShowSuggestions(true)
                  }
                  onBlur={() => {
                    window.setTimeout(
                      () =>
                        setShowSuggestions(
                          false
                        ),
                      150
                    );
                  }}
                />

                {showSuggestions &&
                  filteredSuggestions.length >
                    0 && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-white py-2 shadow-xl">
                      {filteredSuggestions.map(
                        (area) => (
                          <button
                            key={area}
                            type="button"
                            onMouseDown={(
                              event
                            ) =>
                              event.preventDefault()
                            }
                            onClick={() =>
                              chooseSuggestion(
                                area
                              )
                            }
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-gray-800 transition hover:bg-gray-50"
                          >
                            <Scale className="h-4 w-4 text-[#1FA8A1]" />
                            {area}
                          </button>
                        )
                      )}
                    </div>
                  )}
              </div>

              <div className="flex h-14 items-center gap-2 rounded-xl border border-gray-200 px-5 text-gray-700 lg:min-w-48">
                <MapPin className="h-5 w-5 text-[#1FA8A1]" />
                <span className="font-medium">
                  El Paso, TX
                </span>
              </div>

              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center rounded-xl bg-[#D4A62A] px-9 font-bold text-[#021B45] transition hover:bg-[#E3B53A]"
              >
                Search Lawyers
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <MapPin className="h-6 w-6 text-[#D4A62A]" />
            <div>
              <p className="font-bold">
                El Paso Focused
              </p>
              <p className="text-sm text-white/60">
                Built for the local market
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <Users className="h-6 w-6 text-[#D4A62A]" />
            <div>
              <p className="font-bold">
                Attorney Profiles
              </p>
              <p className="text-sm text-white/60">
                Showcase your legal team
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <Building2 className="h-6 w-6 text-[#D4A62A]" />
            <div>
              <p className="font-bold">
                Professional Listings
              </p>
              <p className="text-sm text-white/60">
                Build trust with clients
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <TrendingUp className="h-6 w-6 text-[#D4A62A]" />
            <div>
              <p className="font-bold">
                Growth Tools
              </p>
              <p className="text-sm text-white/60">
                Leads and engagement data
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}