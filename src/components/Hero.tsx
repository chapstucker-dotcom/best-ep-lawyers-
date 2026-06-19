import {
  Search,
  MapPin,
  Scale,
  Car,
  Users,
  Gavel,
  FileText,
  Shield,
  Grid3X3,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface HeroProps {
  onSearch: (query: string) => void;
}

const practiceAreas = [
  "Personal Injury",
  "Criminal Defense",
  "Family Law",
  "DWI / DUI",
  "Immigration",
  "Business Law",
  "Probate",
  "Estate Planning",
  "Employment Law",
  "Civil Litigation",
  "Bankruptcy",
  "Real Estate Law",
];

const quickAreas = [
  { label: "Personal Injury", icon: Car },
  { label: "Criminal Defense", icon: Scale },
  { label: "Family Law", icon: Users },
  { label: "DWI / DUI", icon: Gavel },
  { label: "Immigration", icon: FileText },
  { label: "Business Law", icon: Shield },
];

export default function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions =
    searchQuery.trim().length > 0
      ? practiceAreas.filter((area) =>
          area.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const chooseSuggestion = (area: string) => {
    setSearchQuery(area);
    onSearch(area);
    setShowSuggestions(false);
  };

  const quickSearch = (area: string) => {
    setSearchQuery(area);
    onSearch(area);
    setShowSuggestions(false);
  };

  return (
    <section
      className="relative text-white overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(2,27,69,0.80), rgba(2,27,69,0.86)), url('https://d64gsuwffb70l.cloudfront.net/68ed9016467af1e849aff0b4_1760400701590_f9474cff.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-14">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Scale className="h-9 w-9 text-[#D4A62A]" />
            </div>

            <div>
              <h1 className="text-3xl font-bold leading-tight">
                El Paso&apos;s Best Lawyers
              </h1>
              <p className="text-sm text-white/85">
                El Paso&apos;s Trusted Legal Directory
              </p>
            </div>
          </div>

          <div className="hidden md:flex gap-7 items-center font-semibold">
            <Link to="/pricing" className="hover:text-[#D4A62A]">
              Pricing
            </Link>
            <Link to="/login" className="hover:text-[#D4A62A]">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-[#D4A62A] text-[#021B45] px-6 py-3 rounded-lg font-bold hover:bg-[#E4B93D]"
            >
              List Your Firm
            </Link>
          </div>
        </div>

        <div className="max-w-4xl">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Find the Right
            <br />
            <span className="text-[#D4A62A]">El Paso Lawyer.</span>
          </h2>

          <p className="text-xl sm:text-2xl mb-10 text-white/95 max-w-4xl">
            Search and compare trusted attorneys and law firms across El Paso,
            Texas by practice area, reviews, and experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative max-w-6xl">
          <div className="bg-white rounded-xl p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-[1.5fr_260px_auto] gap-3 shadow-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by lawyer name, firm, or keyword..."
                className="w-full h-14 pl-12 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-[#021B45] outline-none focus:border-[#D4A62A] focus:ring-2 focus:ring-[#D4A62A]/20"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                  {suggestions.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => chooseSuggestion(area)}
                      className="block w-full text-left px-5 py-3 text-[#021B45] hover:bg-gray-100 font-medium"
                    >
                      {area}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-14 rounded-lg bg-gray-50 border border-gray-200 px-4 flex items-center gap-3 text-[#021B45] font-medium">
              <MapPin className="h-5 w-5 text-gray-500" />
              El Paso, TX
            </div>

            <button
              type="submit"
              className="h-14 px-9 rounded-lg bg-[#D4A62A] text-[#021B45] font-bold text-lg hover:bg-[#E4B93D] flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>
        </form>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 rounded-xl overflow-hidden border border-white/15 bg-[#021B45]/80 backdrop-blur max-w-6xl">
          {quickAreas.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => quickSearch(label)}
              className="flex items-center gap-3 px-5 py-5 text-left border-r border-white/10 hover:bg-white/10 transition"
            >
              <Icon className="h-7 w-7 text-[#D4A62A]" />
              <div>
                <div className="font-bold text-sm leading-tight">{label}</div>
                <div className="text-xs text-white/70">View Lawyers →</div>
              </div>
            </button>
          ))}

          <button
            onClick={() =>
              document
                .getElementById("categories")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center gap-3 px-5 py-5 text-left hover:bg-white/10 transition"
          >
            <Grid3X3 className="h-7 w-7 text-[#D4A62A]" />
            <div>
              <div className="font-bold text-sm leading-tight">View All</div>
              <div className="text-xs text-white/70">All Practice Areas →</div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}