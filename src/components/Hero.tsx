import { Search, MapPin, Scale } from "lucide-react";
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
  "Real Estate Law"
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
    <section className="bg-[#021B45] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Scale className="h-10 w-10 text-[#D4A62A]" />
            <div>
              <h1 className="text-3xl font-bold">
                El Paso's Best Lawyers
              </h1>
              <p className="text-sm text-gray-300">
                El Paso's Trusted Legal Directory
              </p>
            </div>
          </div>

          <div className="hidden md:flex gap-6 items-center">
            <Link to="/pricing">Pricing</Link>
            <Link to="/login">Login</Link>

            <Link
              to="/signup"
              className="bg-[#D4A62A] text-[#021B45] px-5 py-2 rounded-md font-semibold"
            >
              List Your Firm
            </Link>
          </div>
        </div>

        <div className="max-w-4xl">
          <h2 className="text-6xl font-bold leading-tight mb-4">
            Find the Right
            <br />
            <span className="text-[#D4A62A]">
              El Paso Lawyer.
            </span>
          </h2>

          <p className="text-2xl mb-10 text-gray-200">
            Search and compare trusted attorneys and law firms
            across El Paso, Texas by practice area, reviews,
            and experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-white rounded-xl p-4 flex flex-col lg:flex-row gap-4">

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
                placeholder="Search by lawyer name, firm, or keyword..."
                className="w-full pl-12 pr-4 py-3 border rounded-lg text-black"
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
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 text-black"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
            </div>

            <div className="flex items-center gap-2 border rounded-lg px-4 py-3 text-black">
              <MapPin size={18} />
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