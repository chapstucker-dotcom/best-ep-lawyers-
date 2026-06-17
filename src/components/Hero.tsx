import { Search, MapPin, Scale, Car, Shield, Users, Gavel, FileText, Building2, Grid3X3 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface HeroProps {
  onSearch: (query: string) => void;
}

const quickPracticeAreas = [
  { label: 'Personal Injury', icon: Car },
  { label: 'Criminal Defense', icon: Scale },
  { label: 'Family Law', icon: Users },
  { label: 'DWI / DUI', icon: Gavel },
  { label: 'Immigration', icon: FileText },
  { label: 'Business Law', icon: Shield },
];

export default function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [practiceArea, setPracticeArea] = useState('All Practice Areas');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const combined = `${searchQuery} ${practiceArea === 'All Practice Areas' ? '' : practiceArea}`.trim();
    onSearch(combined);
  };

  const handleQuickArea = (area: string) => {
    setPracticeArea(area);
    onSearch(area);
  };

  return (
    <div className="bg-white">
      <header className="relative z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-[#C99A2E]/10 flex items-center justify-center">
              <Scale className="h-10 w-10 text-[#C99A2E]" />
            </div>
            <div>
              <div className="text-3xl font-serif font-bold tracking-wide text-[#0B1F3A] leading-none">
                EL PASO'S
              </div>
              <div className="text-2xl font-serif font-bold tracking-[0.18em] text-[#C99A2E] leading-none">
                BEST LAWYERS
              </div>
              <div className="text-[11px] tracking-[0.25em] text-[#0B1F3A] font-semibold mt-1">
                EL PASO'S TRUSTED LEGAL DIRECTORY
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-9 text-[#0B1F3A] font-semibold">
            <button onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}>
              Practice Areas
            </button>
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              For Attorneys
            </button>
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              Pricing
            </button>
            <button onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}>
              Articles
            </button>
            <Button asChild className="bg-[#C99A2E] hover:bg-[#B88923] text-white font-bold px-7">
              <Link to="/signup">LIST YOUR FIRM</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#07182E] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1548225686-2f8b36b99d5f?auto=format&fit=crop&w=1800&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07182E] via-[#07182E]/85 to-[#07182E]/35" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Find the Right
              <br />
              <span className="text-[#D6A437]">El Paso Lawyer.</span>
            </h1>

            <p className="text-xl sm:text-2xl font-semibold max-w-2xl mb-8 text-white/95">
              Search and compare trusted attorneys and law firms across El Paso, Texas by practice area, reviews, and experience.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="bg-white rounded-xl shadow-2xl p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_auto] gap-3 max-w-6xl border border-white/30"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B1F3A]/60 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by lawyer name, firm, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 border-0 text-[#0B1F3A] text-base focus-visible:ring-0"
              />
            </div>

            <select
              value={practiceArea}
              onChange={(e) => setPracticeArea(e.target.value)}
              className="h-14 rounded-md border-0 bg-white px-4 text-[#0B1F3A] font-medium outline-none"
            >
              <option>All Practice Areas</option>
              <option>Personal Injury</option>
              <option>Criminal Defense</option>
              <option>Family Law</option>
              <option>DWI / DUI</option>
              <option>Immigration</option>
              <option>Business Law</option>
              <option>Divorce</option>
              <option>Employment Law</option>
            </select>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B1F3A]/60 h-5 w-5" />
              <Input
                value="El Paso, TX"
                readOnly
                className="h-14 pl-12 border-0 text-[#0B1F3A] font-medium focus-visible:ring-0"
              />
            </div>

            <Button type="submit" className="h-14 px-9 bg-[#C99A2E] hover:bg-[#B88923] text-white font-bold text-lg">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </form>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 rounded-xl overflow-hidden border border-white/15 bg-[#07182E]/80 backdrop-blur">
            {quickPracticeAreas.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => handleQuickArea(label)}
                className="flex items-center gap-3 px-5 py-5 text-left border-r border-white/10 hover:bg-white/10 transition"
              >
                <Icon className="h-8 w-8 text-[#D6A437]" />
                <div>
                  <div className="font-bold text-sm">{label}</div>
                  <div className="text-xs text-white/70">View Lawyers →</div>
                </div>
              </button>
            ))}

            <button
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-3 px-5 py-5 text-left hover:bg-white/10 transition"
            >
              <Grid3X3 className="h-8 w-8 text-[#D6A437]" />
              <div>
                <div className="font-bold text-sm">View All</div>
                <div className="text-xs text-white/70">All Practice Areas →</div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}