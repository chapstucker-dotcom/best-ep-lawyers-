import {
  ArrowRight,
  MapPin,
  Scale,
  Search,
  ShieldCheck,
  Phone,
  Users,
  MessageCircle,
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

export default function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions =
    searchQuery.trim().length > 0
      ? practiceAreas
          .filter((area) =>
            area.toLowerCase().includes(searchQuery.trim().toLowerCase())
          )
          .slice(0, 6)
      : [];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchQuery.trim());
    setShowSuggestions(false);
  };

  const chooseSuggestion = (area: string) => {
    setSearchQuery(area);
    onSearch(area);
    setShowSuggestions(false);
  };

  return (
    <section
      className="relative overflow-hidden bg-[#061A2C] text-white"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(4,24,43,0.98) 0%, rgba(4,24,43,0.92) 46%, rgba(4,24,43,0.72) 100%), url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center 42%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#061A2C]/10 via-transparent to-[#061A2C]" />

      <div className="relative mx-auto max-w-[1500px] px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F7C84A] to-[#E2A822] text-[#071D2F] shadow-lg">
              <Scale className="h-8 w-8" strokeWidth={2.2} />
            </span>
            <span>
              <span className="block font-serif text-xl font-black leading-tight sm:text-[26px]">
                El Paso&apos;s Best Lawyers
              </span>
              <span className="block text-xs text-white/80 sm:text-sm">
                Find and Compare Local Lawyers
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-8 text-sm font-bold lg:flex">
            <button type="button" onClick={() => scrollToSection("search")} className="transition hover:text-[#F5B800]">
              Find Lawyers
            </button>
            <button type="button" onClick={() => scrollToSection("categories")} className="transition hover:text-[#F5B800]">
              Practice Areas
            </button>
            <button type="button" onClick={() => scrollToSection("articles")} className="transition hover:text-[#F5B800]">
              Legal Guides
            </button>
            <button type="button" onClick={() => scrollToSection("pricing")} className="transition hover:text-[#F5B800]">
              For Law Firms
            </button>
            <Link to="/login" className="transition hover:text-[#F5B800]">
              Login
            </Link>
          </nav>
        </header>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex min-h-[100px] items-center gap-4 rounded-xl border border-white/20 bg-[#10273E]/70 px-5 py-4 backdrop-blur">
            <Users className="h-9 w-9 shrink-0 text-[#F5B800]" />
            <div>
              <p className="font-black">Local Law Firms</p>
              <p className="mt-1 text-xs leading-5 text-white/75">
                Compare attorneys across El Paso
              </p>
            </div>
          </div>

          <div className="flex min-h-[100px] items-center gap-4 rounded-xl border border-white/20 bg-[#10273E]/70 px-5 py-4 backdrop-blur">
            <ShieldCheck className="h-9 w-9 shrink-0 text-[#F5B800]" />
            <div>
              <p className="font-black">All Practice Areas</p>
              <p className="mt-1 text-xs leading-5 text-white/75">
                From personal injury to family law and more
              </p>
            </div>
          </div>

          <div className="flex min-h-[100px] items-center gap-4 rounded-xl border border-white/20 bg-[#10273E]/70 px-5 py-4 backdrop-blur">
            <Phone className="h-9 w-9 shrink-0 text-[#F5B800]" />
            <div>
              <p className="font-black">Direct Connections</p>
              <p className="mt-1 text-xs leading-5 text-white/75">
                Contact law firms directly
              </p>
            </div>
          </div>

          <div className="flex min-h-[100px] items-center gap-4 rounded-xl border border-white/20 bg-[#10273E]/70 px-5 py-4 backdrop-blur">
            <MapPin className="h-9 w-9 shrink-0 text-[#F5B800]" />
            <div>
              <p className="font-black">El Paso Focused</p>
              <p className="mt-1 text-xs leading-5 text-white/75">
                Local firms and local legal resources
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center py-3">
            <h1 className="max-w-[620px] font-serif text-[46px] font-black leading-[0.98] tracking-[-0.02em] sm:text-[58px] lg:text-[66px]">
              Find the Right
              <br />
              Lawyer in
              <br />
              El Paso, Texas
            </h1>
            <p className="mt-4 max-w-[610px] text-base leading-7 text-white/90">
              Search local attorneys by practice area, compare law firms,
              explore legal resources, and connect with the right lawyer
              for your needs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection("lead-form")}
            className="group relative min-h-[230px] rounded-2xl border border-[#1FA8A1]/60 bg-[#061A2C]/90 p-7 text-left shadow-2xl backdrop-blur transition hover:border-[#F5B800]/80"
          >
            <div className="flex items-start gap-4">
              <MessageCircle className="mt-1 h-8 w-8 shrink-0 text-[#F5B800]" />
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-[#F5B800]">
                  We&apos;re Here to Help
                </p>
                <h2 className="mt-4 max-w-[360px] text-3xl font-black leading-tight">
                  Tell us about your legal issue
                </h2>
                <p className="mt-4 max-w-[390px] text-sm leading-6 text-white/85">
                  Share a few details about your situation and we&apos;ll help
                  connect you with relevant local legal options in El Paso.
                </p>
              </div>
            </div>
            <span className="absolute right-6 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#F5B800] text-[#F5B800] transition group-hover:bg-[#F5B800] group-hover:text-[#061A2C]">
              <ArrowRight className="h-5 w-5" />
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-30 mt-5">
          <div className="grid overflow-visible rounded-xl bg-white shadow-2xl lg:grid-cols-[1fr_190px_205px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#071D2F]" />
              <input
                type="text"
                value={searchQuery}
                placeholder="Search by lawyer, firm, or practice area..."
                className="h-16 w-full rounded-l-xl border-0 bg-white pl-14 pr-5 text-[15px] font-medium text-[#071D2F] outline-none placeholder:text-slate-500"
                style={{
                  color: "#071D2F",
                  WebkitTextFillColor: "#071D2F",
                  caretColor: "#071D2F",
                }}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
              />

              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-white py-2 shadow-xl">
                  {filteredSuggestions.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => chooseSuggestion(area)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-gray-800 transition hover:bg-gray-50"
                    >
                      <Scale className="h-4 w-4 text-[#1FA8A1]" />
                      {area}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex h-16 items-center gap-3 border-l border-slate-200 px-5 text-[#071D2F]">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">El Paso, TX</span>
            </div>

            <button
              type="submit"
              className="inline-flex h-16 items-center justify-center gap-3 rounded-r-xl bg-gradient-to-r from-[#E4AA25] to-[#F7C64A] px-7 font-black text-[#071D2F] transition hover:brightness-105"
            >
              Search Lawyers
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
