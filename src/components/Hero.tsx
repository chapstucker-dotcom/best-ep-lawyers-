import { Search, MapPin, Scale } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-franklin-star.png";

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

  const filteredSuggestions =
    searchQuery.length > 0
      ? practiceAreas.filter((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
    setShowSuggestions(false);
  };

  return (
    <section
      className="text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(2,27,69,0.65), rgba(2,27,69,0.82)), url(${heroImage})`,
    >
   <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Scale className="h-10 w-10 text-[#D4A62A]" />

            <div>
              <h1 className="text-3xl font-bold">
                El Paso's Best Lawyers
              </h1>

              <p className="text-gray-300">
                El Paso's Trusted Legal Directory
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/pricing" className="hover:text-[#D4A62A]">
              Pricing
            </Link>

            <Link to="/login" className="hover:text-[#D4A62A]">
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-[#D4A62A] text-[#021B45] px-5 py-3 rounded-lg font-bold"
            >
              List Your Firm
            </Link>
          </div>
        </div>

        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#D4A62A]/20 border border-[#D4A62A]/40 rounded-full px-4 py-2 mb-6">
            <MapPin className="h-4 w-4 text-[#D4A62A]" />
            <span>Serving El Paso, Texas</span>
<p className="text-[#D4A62A] uppercase tracking-widest font-semibold mt-6 mb-4">
  Limited Premium Placements Available
</p>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Find the Right
            <br />
           Find El Paso's
<br />
<span className="text-[#D4A62A]">
  Top-Rated Attorneys.
</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-200 mb-10">
            Search and compare trusted attorneys and law firms across
            El Paso by practice area, experience, and reputation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative max-w-5xl">
          <div className="bg-white rounded-xl p-4 flex flex-col lg:flex-row gap-4 shadow-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-500" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by lawyer or practice area..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border text-black"
              />

              {showSuggestions &&
                filteredSuggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 bg-white border rounded-lg shadow-lg w-full overflow-hidden">
                    {filteredSuggestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          handleSuggestionClick(item)
                        }
                        className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-black"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
            </div>

            <div className="flex items-center gap-2 border rounded-lg px-4 py-3 text-black">
              <MapPin className="h-5 w-5" />
              El Paso, TX
            </div>

            <button
              type="submit"
              className="bg-[#D4A62A] text-[#021B45] px-8 py-3 rounded-lg font-bold"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
