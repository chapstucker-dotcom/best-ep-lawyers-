import { ArrowRight, MapPin, Scale, Search, ShieldCheck, Phone, Users, Menu, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-franklin-star.png";

interface HeroProps {
  onSearch: (query: string) => void;
}

const practiceAreas = [
  "Personal Injury", "Car Accidents", "Truck Accidents", "Criminal Defense",
  "DWI / DUI", "Family Law", "Divorce", "Child Custody", "Immigration",
  "Business Law", "Probate", "Estate Planning", "Employment Law",
  "Civil Litigation", "Bankruptcy", "Real Estate Law",
];

const highlights = [
  { icon: Users, title: "Local Law Firms", detail: "Compare El Paso attorneys" },
  { icon: ShieldCheck, title: "Legal Services", detail: "Explore practice areas" },
  { icon: Phone, title: "Direct Connections", detail: "Contact firms directly" },
  { icon: MapPin, title: "El Paso Focused", detail: "Local legal resources" },
];

export default function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredSuggestions = searchQuery.trim()
    ? practiceAreas.filter((area) =>
        area.toLowerCase().includes(searchQuery.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <section className="relative isolate overflow-hidden bg-[#071b30] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})`, backgroundPosition: "center 46%" }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-[#06172b]/80 via-[#06172b]/40 to-[#06172b]/90" />

      <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-5 sm:px-6 sm:pb-14 lg:px-8">
        <header className="flex items-center justify-between gap-5">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F7C84A] to-[#DDA321] text-[#071D2F] shadow-lg sm:h-14 sm:w-14">
              <Scale className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.2} />
            </span>
            <span className="min-w-0">
              <span className="block font-serif text-lg font-black leading-tight sm:text-[26px]">El Paso&apos;s Best Lawyers</span>
              <span className="block text-xs text-white/85 sm:text-sm">Find and Compare Local Lawyers</span>
            </span>
          </button>

          <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm font-bold lg:flex">
            <button type="button" onClick={() => scrollToSection("search")} className="hover:text-[#F5C147]">Find Lawyers</button>
            <button type="button" onClick={() => scrollToSection("categories")} className="hover:text-[#F5C147]">Practice Areas</button>
            <Link to="/guides" className="hover:text-[#F5C147]">Legal Guides</Link>
            <Link to="/for-law-firms" className="hover:text-[#F5C147]">For Law Firms</Link>
            <Link to="/login" className="hover:text-[#F5C147]">Login</Link>
          </nav>
          <button type="button" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)} className="rounded-lg border border-white/30 p-2 lg:hidden">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {mobileMenuOpen && (
          <nav aria-label="Mobile navigation" className="mt-4 flex flex-col gap-1 rounded-xl border border-white/20 bg-[#071b30]/95 p-3 text-sm font-semibold lg:hidden">
            <button type="button" onClick={() => scrollToSection("search")} className="rounded-lg px-3 py-3 text-left hover:bg-white/10">Find Lawyers</button>
            <button type="button" onClick={() => scrollToSection("categories")} className="rounded-lg px-3 py-3 text-left hover:bg-white/10">Practice Areas</button>
            <Link to="/guides" className="rounded-lg px-3 py-3 hover:bg-white/10">Legal Guides</Link>
            <Link to="/for-law-firms" className="rounded-lg px-3 py-3 hover:bg-white/10">For Law Firms</Link>
            <Link to="/login" className="rounded-lg px-3 py-3 hover:bg-white/10">Login</Link>
          </nav>
        )}

        <div className="mx-auto max-w-[1050px] pb-6 pt-16 text-center sm:pt-20 lg:pb-10 lg:pt-24">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#F6CB66] sm:text-sm">Your connection to local legal help</p>
          <h1 className="mx-auto max-w-[1040px] font-serif text-[39px] font-black leading-[1.08] tracking-[-0.025em] drop-shadow-[0_3px_18px_rgba(0,0,0,0.4)] sm:text-[55px] lg:text-[68px]">
            Find the Right Lawyer for Your Legal Needs in El Paso
          </h1>
          <p className="mx-auto mt-6 max-w-[710px] text-sm leading-7 text-white/95 sm:text-lg">
            Search local lawyers, compare firms, and explore legal resources to find the help you need.
          </p>
        </div>

        <form onSubmit={handleSubmit} role="search" className="relative z-30 mx-auto max-w-[1150px]">
          <div className="grid rounded-xl bg-white shadow-[0_14px_45px_rgba(0,0,0,0.3)] md:grid-cols-[minmax(0,1fr)_175px_195px]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#102A43]" />
              <input
                type="search"
                aria-label="Search lawyers, firms, or practice areas"
                value={searchQuery}
                placeholder="Search by lawyer, firm, or practice area..."
                className="h-16 w-full rounded-t-xl bg-white pl-13 pr-4 text-[15px] font-medium text-[#071D2F] outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-[#D4A62A] md:rounded-l-xl md:rounded-tr-none"
                style={{ paddingLeft: "3.4rem" }}
                onChange={(event) => { setSearchQuery(event.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 text-left shadow-xl">
                  {filteredSuggestions.map((area) => (
                    <button key={area} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => chooseSuggestion(area)} className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#071D2F] hover:bg-slate-100">
                      <Scale className="h-4 w-4 text-[#C99A2E]" />{area}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex h-14 items-center justify-center gap-3 border-t border-slate-200 px-4 text-[#071D2F] md:h-16 md:justify-start md:border-l md:border-t-0">
              <MapPin className="h-5 w-5" /><span className="font-semibold">El Paso, TX</span>
            </div>
            <button type="submit" className="inline-flex h-16 items-center justify-center gap-3 rounded-b-xl bg-gradient-to-r from-[#E6AE2E] to-[#F8CA54] px-5 font-black text-[#071D2F] transition hover:brightness-105 md:rounded-b-none md:rounded-r-xl">
              Search Lawyers <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>

        <div className="mx-auto mt-8 grid max-w-[1150px] grid-cols-2 gap-3 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, title, detail }) => (
            <div key={title} className="flex min-h-[92px] items-center gap-3 rounded-xl border border-white/20 bg-[#071b30]/75 px-4 py-4 shadow-lg backdrop-blur-sm sm:gap-4 sm:px-5">
              <Icon className="h-7 w-7 shrink-0 text-[#F5BF3B] sm:h-8 sm:w-8" />
              <div className="min-w-0">
                <p className="text-sm font-bold sm:text-base">{title}</p>
                <p className="mt-1 text-xs leading-5 text-white/80">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
