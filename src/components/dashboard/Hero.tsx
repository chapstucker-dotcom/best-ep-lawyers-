import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  PlayCircle,
  Scale,
  Search,
} from "lucide-react";

import heroImage from "../assets/hero-franklin-star.png";
import HowItWorksModal from "./HowItWorksModal";

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

export default function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const filteredSuggestions =
    searchQuery.trim().length > 0
      ? practiceAreas.filter((area) =>
          area.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanQuery = searchQuery.trim();

    if (!cleanQuery) {
      return;
    }

    onSearch(cleanQuery);
    setShowSuggestions(false);
  };

  const chooseSuggestion = (area: string) => {
    setSearchQuery(area);
    onSearch(area);
    setShowSuggestions(false);
  };

  const handleListFirm = () => {
    window.setTimeout(() => {
      scrollToSection("list-form");
    }, 100);
  };

  return (
    <>
      <section
        className="text-white"
        style={{
          backgroundImage: `linear-gradient(
            rgba(2, 27, 69, 0.65),
            rgba(2, 27, 69, 0.82)
          ), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="h-10 w-10 text-[#D4A62A]" />

              <div>
                <h1 className="text-3xl font-bold">
                  El Paso&apos;s Best Lawyers
                </h1>

                <p className="text-gray-300">
                  El Paso&apos;s Trusted Legal Directory
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-6 md:flex">
              <button
                type="button"
                onClick={() => scrollToSection("pricing")}
                className="transition hover:text-[#D4A62A]"
              >
                Pricing
              </button>

              <Link
                to="/login"
                className="transition hover:text-[#D4A62A]"
              >
                Login
              </Link>

              <button
                type="button"
                onClick={() => scrollToSection("list-form")}
                className="rounded-lg bg-[#D4A62A] px-5 py-3 font-bold text-[#021B45] transition hover:brightness-105"
              >
                List Your Firm
              </button>
            </div>
          </div>

          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4A62A]/40 bg-[#D4A62A]/20 px-4 py-2">
              <MapPin className="h-4 w-4 text-[#D4A62A]" />
              <span>Serving El Paso, Texas</span>
            </div>

            <p className="mb-4 font-semibold uppercase tracking-widest text-[#D4A62A]">
              Limited Premium Placements Available
            </p>

            <h2 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
              Find El Paso&apos;s
              <br />
              <span className="text-[#D4A62A]">
                Top-Rated Attorneys.
              </span>
            </h2>

            <p className="mb-8 text-xl text-gray-200 md:text-2xl">
              Find trusted El Paso attorneys by practice area, compare top law
              firms, and connect directly with experienced local counsel.
            </p>

            <div className="mb-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setShowHowItWorks(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                <PlayCircle className="h-5 w-5 text-[#D4A62A]" />
                Watch How It Works
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative max-w-6xl"
          >
            <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-2xl lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-500" />

                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Search by lawyer or practice area..."
                  className="w-full rounded-lg border py-3 pl-12 pr-4 text-black"
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  aria-label="Search by lawyer or practice area"
                />

                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border bg-white shadow-lg">
                    {filteredSuggestions.map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => chooseSuggestion(area)}
                        className="block w-full px-4 py-3 text-left text-black transition hover:bg-gray-100"
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-lg border px-6 py-3 text-black">
                <MapPin className="h-5 w-5" />
                <span>El Paso, TX</span>
              </div>

              <button
                type="submit"
                className="rounded-lg bg-[#D4A62A] px-10 py-3 font-bold text-[#021B45] transition hover:brightness-105"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <HowItWorksModal
        open={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
        onListFirm={handleListFirm}
      />
    </>
  );
}