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

  useEffect(() => {
    const loadFirms = async () => {
      const { data, error } = await getAllFirms();

      if (data && !error) {
        setFirms(data);
      } else if (data) {
        setFirms(data);
      }

      setLoading(false);
    };

    loadFirms();
  }, []);

  const scrollToSearch = () => {
    setTimeout(() => {
      document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const normalizeText = (value: unknown) =>
    String(value || '')
      .toLowerCase()
      .replace(/[-_/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const getFirmSearchText = (firm: any) => {
    return normalizeText([
      firm.name,
      firm.category,
      firm.description,
      firm.bio,
      firm.phone,
      firm.website,
      firm.address,
      firm.city,
      firm.state,
      ...(firm.specialties || []),
    ].filter(Boolean).join(' '));
  };

  const handleSearch = (query: string) => {
    const cleanQuery = normalizeText(query);

    const matchedCategory = categories.find((cat: any) => {
      const catTitle = normalizeText(cat.title);
      const catSlug = normalizeText(cat.slug);
      const firstWord = catTitle.split(' ')[0];

      return (
        cleanQuery === catTitle ||
        cleanQuery === catSlug ||
        catTitle.includes(cleanQuery) ||
        catSlug.includes(cleanQuery) ||
        cleanQuery.includes(catTitle) ||
        cleanQuery.includes(firstWord)
      );
    });

    if (matchedCategory) {
      setSelectedCategory(matchedCategory.slug);
      setSearchQuery('');
    } else {
      setSelectedCategory('all');
      setSearchQuery(query);
    }

    scrollToSearch();
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    setSearchQuery('');
    scrollToSearch();
  };

  const filteredFirms = firms.filter((firm: any) => {
    const q = normalizeText(searchQuery);
    const searchableText = getFirmSearchText(firm);

    const selectedCategoryObj = categories.find((cat: any) => cat.slug === selectedCategory);
    const selectedTitle = normalizeText(selectedCategoryObj?.title);
    const selectedSlug = normalizeText(selectedCategoryObj?.slug || selectedCategory);

    const matchesSearch =
      q === '' ||
      searchableText.includes(q) ||
      q.split(' ').some(word => word.length > 2 && searchableText.includes(word));

    const matchesCategory =
      selectedCategory === 'all' ||
      searchableText.includes(selectedTitle) ||
      searchableText.includes(selectedSlug) ||
      (selectedTitle && selectedTitle.split(' ').some(word => word.length > 2 && searchableText.includes(word)));

    const matchesFeatured = !featuredOnly || firm.is_featured;

    return matchesSearch && matchesCategory && matchesFeatured;
  });
const visibleFirms = filteredFirms.length > 0 ? filteredFirms : firms;
const sortedFirms = [...visibleFirms].sort((a: any, b: any) => {
    if (sortBy === 'name') return String(a.name || '').localeCompare(String(b.name || ''));
    if (sortBy === 'newest') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    return 0;
  });

  const featuredFirms = firms.filter((f: any) => f.is_featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Hero onSearch={handleSearch} />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#C99A2E] mb-2">
                Featured Law Firms
              </p>
              <h2 className="text-3xl font-bold text-[#0F2A43]">
                Top-Rated El Paso Lawyers You Can Trust
              </h2>
              <p className="text-gray-600 mt-2">
                Verified profiles, direct contact, and practice-area visibility.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                scrollToSearch();
              }}
              className="hidden md:inline-flex border border-[#0F2A43]/20 rounded-lg px-5 py-3 font-semibold text-[#0F2A43] hover:bg-[#0F2A43] hover:text-white transition"
            >
              View All Firms →
            </button>
          </div>

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

      <section id="categories" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0F2A43] mb-8 text-center">
            Browse by Practice Area
          </h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} onClick={() => handleCategoryClick(cat.slug)} />
            ))}
          </div>
        </div>
      </section>

      <section id="search" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0F2A43]">Find Lawyers</h2>
            <p className="text-gray-600 mt-2">
              {selectedCategory === 'all'
                ? 'Search all listed El Paso law firms.'
                : `Showing ${categories.find((cat: any) => cat.slug === selectedCategory)?.title || selectedCategory} firms.`}
            </p>
          </div>

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

      <section id="resources" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0F2A43] mb-4 text-center">
            Texas Law Resources
          </h2>

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

      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0F2A43] mb-4 text-center">
            Plans for Law Firms
          </h2>

          <p className="text-center text-gray-600 mb-8">
            Start free. Upgrade any time.
          </p>

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

      <section id="list-form" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ListFirmForm />
        </div>
      </section>

      <section id="disclaimers" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0F2A43] mb-8 text-center">
            Legal Disclaimers
          </h2>

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
