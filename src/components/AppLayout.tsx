import { useState, useEffect } from 'react';
import Hero from './Hero';
import FirmCard from './FirmCard';
import CategoryCard from './CategoryCard';
import FirmModal from './FirmModal';
import ArticleCard from './ArticleCard';
import ArticleModal from './ArticleModal';
import ListFirmForm from './ListFirmForm';
import PricingCard from './PricingCard';
import SearchFilters from './SearchFilters';
import Footer from './Footer';
import { getAllFirms } from '@/services/firmService';
import { categories } from '../data/categories';
import { articles } from '../data/articles';
import { plans } from '../data/plans';
import { Firm, Article } from '../data/types';
import { Scale, Shield, Users, Award, Loader2 } from 'lucide-react';

export default function AppLayout() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedFirm, setSelectedFirm] = useState<Firm | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Load firms from database
  useEffect(() => {
    const loadFirms = async () => {
      const { data, error } = await getAllFirms();
      if (data && !error) {
        setFirms(data);
      }
      setLoading(false);
    };
    loadFirms();
  }, []);

const handleSearch = (query: string) => {
  const cleanQuery = query.toLowerCase().trim();

  const matchedCategory = categories.find(cat =>
    cat.title.toLowerCase().includes(cleanQuery) ||
    cat.slug.toLowerCase().includes(cleanQuery) ||
    cleanQuery.includes(cat.title.toLowerCase().split(' ')[0])
  );

  if (matchedCategory) {
    setSelectedCategory(matchedCategory.slug);
    setSearchQuery('');
  } else {
    setSelectedCategory('all');
    setSearchQuery(query);
  }

  document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
};

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredFirms = firms.filter(firm => {
    const matchesSearch = searchQuery === '' || 
      firm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      firm.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      firm.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
  const selectedCategoryObj = categories.find(cat => cat.slug === selectedCategory);

const matchesCategory =
  selectedCategory === 'all' ||
  firm.category?.toLowerCase().includes(selectedCategoryObj?.title.toLowerCase() || selectedCategory.toLowerCase()) ||
  firm.specialties?.some(s =>
    s.toLowerCase().includes(selectedCategoryObj?.title.toLowerCase() || selectedCategory.toLowerCase())
  );
    const matchesFeatured = !featuredOnly || firm.is_featured;
    
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  const sortedFirms = [...filteredFirms].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return 0;
  });

  const featuredFirms = firms.filter(f => f.is_featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Hero onSearch={handleSearch} />
      
      {/* Featured Firms */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0F2A43] mb-8 text-center">Featured Law Firms</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredFirms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredFirms.map(firm => (
                <FirmCard key={firm.id} firm={firm} onClick={() => setSelectedFirm(firm)} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No featured firms yet</p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0F2A43] mb-8 text-center">Browse by Practice Area</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} onClick={() => handleCategoryClick(cat.slug)} />
            ))}
          </div>
        </div>
      </section>

      {/* Search & Results */}
      <section id="search" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0F2A43] mb-8">Find Lawyers</h2>
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <SearchFilters
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                featuredOnly={featuredOnly}
                onFeaturedChange={setFeaturedOnly}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : sortedFirms.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No matches yet. Try a broader term or remove a filter.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {sortedFirms.map(firm => (
                    <FirmCard key={firm.id} firm={firm} onClick={() => setSelectedFirm(firm)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-[#0F2A43] to-[#1FA8A1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <Scale className="h-12 w-12 mx-auto mb-4 text-[#F5B800]" />
              <h3 className="font-bold mb-2">Search</h3>
              <p className="text-sm opacity-90">Browse by name or practice area</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-[#F5B800]" />
              <h3 className="font-bold mb-2">Compare</h3>
              <p className="text-sm opacity-90">View profiles, reviews & credentials</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-[#F5B800]" />
              <h3 className="font-bold mb-2">Connect</h3>
              <p className="text-sm opacity-90">Contact attorneys directly</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-[#F5B800]" />
              <h3 className="font-bold mb-2">Get Help</h3>
              <p className="text-sm opacity-90">Resolve your legal matter</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0F2A43] mb-4 text-center">Texas Law Resources</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Plain-English guides to Texas law, written for El Paso residents
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} onClick={() => setSelectedArticle(article)} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0F2A43] mb-4 text-center">Plans for Law Firms</h2>
          <p className="text-center text-gray-600 mb-8">Start free. Upgrade any time.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {plans.map(plan => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            Plans renew monthly. Cancel anytime. Upgrades take effect immediately.
          </p>
        </div>
      </section>

      {/* List Your Firm */}
      <section id="list-form" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ListFirmForm />
        </div>
      </section>

      {/* Disclaimers */}
      <section id="disclaimers" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0F2A43] mb-8 text-center">Legal Disclaimers</h2>
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="font-bold mb-2">No Legal Advice</h3>
              <p>Information on this site is for general informational purposes only and is not legal advice.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Advertising Disclosure</h3>
              <p>Some listings are paid advertisements. Featured labels indicate paid placement.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Accuracy</h3>
              <p>We do not guarantee the completeness or accuracy of profiles; confirm details with the firm directly.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Texas-Specific</h3>
              <p>Texas law changes over time; consult a licensed Texas attorney for advice about your situation.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <FirmModal firm={selectedFirm} open={!!selectedFirm} onClose={() => setSelectedFirm(null)} />
      <ArticleModal article={selectedArticle} open={!!selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}


