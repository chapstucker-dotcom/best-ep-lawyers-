import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface HeroProps {
  onSearch: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="relative bg-gradient-to-br from-[#0F2A43] via-[#1FA8A1] to-[#0F2A43] text-white">
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://d64gsuwffb70l.cloudfront.net/68ed9016467af1e849aff0b4_1760400701590_f9474cff.webp)' }}
      />
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button asChild variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 text-white">
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild className="bg-[#F5B800] hover:bg-[#F5B800]/90 text-[#0F2A43]">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Best EP Lawyers</h1>
          <p className="text-2xl mb-2">Find trusted attorneys in El Paso, TX</p>
          <p className="text-lg mb-8 opacity-90">
            Search by name or practice area. Compare firms, read plain-English Texas law guides, and contact attorneys directly.
          </p>
          
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by firm or practice area (e.g., 'family law')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-gray-900"
              />
            </div>
            <Button type="submit" size="lg" className="bg-[#F5B800] hover:bg-[#F5B800]/90 text-[#0F2A43]">
              Search
            </Button>
          </form>

          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white/30 hover:bg-white/20 text-white"
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Categories
            </Button>
            <Button 
              size="lg" 
              className="bg-[#F5B800] hover:bg-[#F5B800]/90 text-[#0F2A43]"
              onClick={() => document.getElementById('list-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              List Your Firm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

