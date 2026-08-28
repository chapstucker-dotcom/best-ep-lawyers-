import WhyLawFirmsJoin from "./WhyLawFirmsJoin";
import LawFirmMarketplace from "./LawFirmMarketplace";
import SeoPracticeAreaLinks from "./SeoPracticeAreaLinks";
import { useEffect, useMemo, useState } from 'react';

import Hero from './Hero';
import FirmCard from './FirmCard';
import FirmModal from './FirmModal';
import ArticleCard from './ArticleCard';
import ListFirmForm from './ListFirmForm';
import PricingCard from './PricingCard';
import SearchFilters from './SearchFilters';
import Footer from './Footer';

import { getAllFirms } from '@/services/firmService';
import {
  categories,
  getPracticeAreaTitle,
} from '../data/categories';
import { articles } from '../data/articles';
import { plans } from '../data/plans';
import { getPlanRules } from '@/config/planRules';

import type { Firm } from '../data/types';

import {
  Award,
  BriefcaseBusiness,
  Building2,
  Car,
  ChevronDown,
  ChevronUp,
  Gavel,
  HeartHandshake,
  Home,
  Landmark,
  Loader2,
  Scale,
  Shield,
  Users,
} from 'lucide-react';

const HOMEPAGE_CATEGORY_SLUGS = [
  'personal-injury',
  'criminal-defense',
  'family-law',
  'immigration',
  'estate-planning',
  'business-law',
  'real-estate',
  'employment-law',
  'bankruptcy',
  'dwi-dui',
  'probate',
  'civil-litigation',
];

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  'personal-injury': HeartHandshake,
  'criminal-defense': Shield,
  'family-law': Users,
  immigration: Landmark,
  'estate-planning': Scale,
  'business-law': BriefcaseBusiness,
  'real-estate': Home,
  'employment-law': Building2,
  bankruptcy: Gavel,
  'dwi-dui': Car,
  probate: Scale,
  'civil-litigation': Gavel,
};

const normalizeText = (value: unknown): string =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();


type RankedFirm = Firm & {
  plan?: string | null;
  plan_key?: string | null;
  is_featured?: boolean | null;
  featured?: boolean | null;
  created_at?: string | null;
};

const getFirmPlanKey = (firm: Firm): string => {
  const rankedFirm = firm as RankedFirm;

  return String(
    rankedFirm.plan_key ??
      rankedFirm.plan ??
      'free'
  )
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
};

const getFirmRank = (firm: Firm): number => {
  const rules = getPlanRules(
    getFirmPlanKey(firm)
  );

  if (rules.categoryOwner) return 4;
  if (rules.featuredPlacement) return 3;
  if (rules.id === 'expert') return 2;

  return 1;
};

const rotateFeaturedFirms = (
  firms: Firm[]
): Firm[] => {
  if (firms.length <= 1) return firms;

  // Rotates once per day so Featured firms share exposure
  // without changing order while a visitor is browsing.
  const dayNumber = Math.floor(
    Date.now() / 86_400_000
  );
  const offset = dayNumber % firms.length;

  return [
    ...firms.slice(offset),
    ...firms.slice(0, offset),
  ];
};

const getFeaturedCategory = (firm: Firm): string => {
  const premiumFirm = firm as Firm & {
    primary_category?: string | null;
    category?: string | null;
  };

  return String(
    premiumFirm.primary_category ??
      premiumFirm.category ??
      'Featured Practice Area'
  ).trim();
};

const getHomepageFeaturedFirm = (firm: Firm): Firm => {
  const featuredCategory = getFeaturedCategory(firm);

  // The homepage premium card intentionally shows only the category
  // attached to the paid placement. Other profile practice areas remain
  // available on the firm's full profile and elsewhere in the directory.
  return {
    ...firm,
    category: featuredCategory,
    primary_category: featuredCategory,
    practice_areas: [featuredCategory],
    specialties: [],
    categories: [],
    description: null,
    bio: null,
  } as Firm;
};

export default function AppLayout() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('all');
  const [featuredOnly, setFeaturedOnly] =
    useState(false);
  const [sortBy, setSortBy] =
    useState('relevance');

  const [selectedFirm, setSelectedFirm] =
    useState<Firm | null>(null);

  const [showAllCategories, setShowAllCategories] =
    useState(false);

  useEffect(() => {
    let active = true;

    const loadFirms = async () => {
      setLoading(true);

      const { data, error } =
        await getAllFirms();

      if (!active) return;

      if (error) {
        console.error(
          'Failed to load firms:',
          error
        );
      }

      setFirms(data ?? []);
      setLoading(false);
    };

    void loadFirms();

    return () => {
      active = false;
    };
  }, []);

  const scrollToSearch = () => {
    window.setTimeout(() => {
      document
        .getElementById('search')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    }, 50);
  };

  const homepageCategories = useMemo(
    () =>
      HOMEPAGE_CATEGORY_SLUGS.map(
        (slug) =>
          categories.find(
            (category) =>
              category.slug === slug
          )
      ).filter(
        (
          category
        ): category is (typeof categories)[number] =>
          Boolean(category)
      ),
    []
  );

  const displayedCategories =
    showAllCategories
      ? categories
      : homepageCategories;

  const getFirmSearchText = (
    firm: Firm
  ): string => {
    const publicFirm = firm as Firm & {
      category?: string | null;
      description?: string | null;
      bio?: string | null;
      specialties?: string[] | null;
      categories?: string[] | null;
    };

    return normalizeText(
      [
        publicFirm.name,
        publicFirm.category,
        publicFirm.description,
        publicFirm.bio,
        publicFirm.phone,
        publicFirm.email,
        publicFirm.website,
        publicFirm.address,
        publicFirm.city,
        publicFirm.state,
        ...(publicFirm.specialties ?? []),
        ...(publicFirm.categories ?? []),
      ]
        .filter(Boolean)
        .join(' ')
    );
  };

  const handleSearch = (
    query: string
  ) => {
    const cleanQuery =
      normalizeText(query);

    if (!cleanQuery) {
      setSelectedCategory('all');
      setSearchQuery('');
      scrollToSearch();
      return;
    }

    const matchedCategory =
      categories.find((category) => {
        const title =
          normalizeText(category.title);
        const slug =
          normalizeText(category.slug);

        return (
          cleanQuery === title ||
          cleanQuery === slug ||
          title.includes(cleanQuery) ||
          slug.includes(cleanQuery) ||
          cleanQuery.includes(title)
        );
      });

    if (matchedCategory) {
      setSelectedCategory(
        matchedCategory.slug
      );
      setSearchQuery('');
    } else {
      setSelectedCategory('all');
      setSearchQuery(query);
    }

    scrollToSearch();
  };

  const handleCategoryClick = (
    slug: string
  ) => {
    setSelectedCategory(slug);
    setSearchQuery('');
    scrollToSearch();
  };

  const filteredFirms =
    useMemo(() => {
      const query =
        normalizeText(searchQuery);

      const selectedCategoryRecord =
        categories.find(
          (category) =>
            category.slug ===
            selectedCategory
        );

      const selectedTitle =
        normalizeText(
          selectedCategoryRecord?.title
        );

      const selectedSlug =
        normalizeText(
          selectedCategoryRecord?.slug ??
            selectedCategory
        );

      return firms.filter((firm) => {
        const searchableText =
          getFirmSearchText(firm);

        const matchesSearch =
          !query ||
          searchableText.includes(query) ||
          query
            .split(' ')
            .some(
              (word) =>
                word.length > 2 &&
                searchableText.includes(word)
            );

        const matchesCategory =
          selectedCategory === 'all' ||
          searchableText.includes(
            selectedSlug
          ) ||
          searchableText.includes(
            selectedTitle
          );

        const matchesFeatured =
          !featuredOnly ||
          Boolean(
            (
              firm as Firm & {
                is_featured?: boolean;
              }
            ).is_featured
          );

        return (
          matchesSearch &&
          matchesCategory &&
          matchesFeatured
        );
      });
    }, [
      firms,
      searchQuery,
      selectedCategory,
      featuredOnly,
    ]);

  const sortedFirms = useMemo(() => {
    const sorted = [...filteredFirms];

    if (sortBy === 'name') {
      sorted.sort((a, b) =>
        String(a.name ?? '').localeCompare(
          String(b.name ?? '')
        )
      );
    }

    if (sortBy === 'newest') {
      sorted.sort((a, b) => {
        const aDate = new Date(
          (
            a as Firm & {
              created_at?: string;
            }
          ).created_at ?? 0
        ).getTime();

        const bDate = new Date(
          (
            b as Firm & {
              created_at?: string;
            }
          ).created_at ?? 0
        ).getTime();

        return bDate - aDate;
      });
    }

    if (sortBy === 'relevance') {
      sorted.sort((a, b) => {
        const rankDifference =
          getFirmRank(b) -
          getFirmRank(a);

        if (rankDifference !== 0) {
          return rankDifference;
        }

        const aCreatedAt = new Date(
          (a as RankedFirm).created_at ?? 0
        ).getTime();

        const bCreatedAt = new Date(
          (b as RankedFirm).created_at ?? 0
        ).getTime();

        return bCreatedAt - aCreatedAt;
      });
    }

    return sorted;
  }, [filteredFirms, sortBy]);

  const featuredFirms = useMemo(() => {
    /*
     * Homepage premium-placement rules:
     *
     * 1. Category Exclusive firms have constant homepage presence.
     * 2. Category Featured firms share ONE rotating homepage slot.
     * 3. Featured rotation changes once per day.
     *
     * Category-page placement is handled separately by
     * PracticeAreaFirmDirectory.
     */
    const exclusiveFirms = firms
      .filter(
        (firm) =>
          getPlanRules(
            getFirmPlanKey(firm)
          ).categoryOwner
      )
      .sort((a, b) =>
        String(a.name ?? '').localeCompare(
          String(b.name ?? '')
        )
      );

    const rotatingFeatured =
      rotateFeaturedFirms(
        firms
          .filter((firm) => {
            const rules = getPlanRules(
              getFirmPlanKey(firm)
            );

            return (
              rules.featuredPlacement &&
              !rules.categoryOwner
            );
          })
          .sort((a, b) =>
            String(a.name ?? '').localeCompare(
              String(b.name ?? '')
            )
          )
      );

    const featuredHomepageFirm =
      rotatingFeatured[0];

    return featuredHomepageFirm
      ? [
          ...exclusiveFirms,
          featuredHomepageFirm,
        ]
      : exclusiveFirms;
  }, [firms]);

  const selectedCategoryTitle =
    selectedCategory === 'all'
      ? null
      : getPracticeAreaTitle(
          selectedCategory
        );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Hero onSearch={handleSearch} />
      <LawFirmMarketplace
        firmCount={firms.length}
        categoryCount={categories.length}
      />

      {/* Premium homepage placements */}
      <section className="relative overflow-hidden bg-[#071D2F] py-20">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#1FA8A1]/20 blur-3xl" />
          <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#C99A2E]/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E8C86A]/35 bg-[#C99A2E]/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#F2D77E]">
                <Award className="h-4 w-4" />
                Premium Firm Placement
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Featured El Paso Law Firms
              </h2>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                Explore firms with premium placement in specific legal categories.
                Featured placement is advertising and does not imply a ranking or endorsement.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                scrollToSearch();
              }}
              className="inline-flex w-fit items-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/15"
            >
              View All Firms →
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#42C6BE]" />
            </div>
          ) : featuredFirms.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {featuredFirms.map((firm) => {
                const rules = getPlanRules(getFirmPlanKey(firm));
                const isExclusive = rules.categoryOwner;
                const featuredCategory = getFeaturedCategory(firm);
                const displayFirm = getHomepageFeaturedFirm(firm);

                return (
                  <div
                    key={firm.id}
                    className={`group relative rounded-[28px] p-[1px] shadow-2xl transition duration-300 hover:-translate-y-1 ${
                      isExclusive
                        ? 'bg-gradient-to-br from-[#F4D77A] via-[#C99A2E] to-[#8A6516]'
                        : 'bg-gradient-to-br from-[#50D6CE] via-[#1FA8A1] to-[#0F5D66]'
                    }`}
                  >
                    <div className="relative h-full overflow-hidden rounded-[27px] bg-white">
                      <div
                        className={`flex items-center justify-between gap-3 px-5 py-4 ${
                          isExclusive
                            ? 'bg-gradient-to-r from-[#0F2A43] to-[#071D2F]'
                            : 'bg-gradient-to-r from-[#0F2A43] via-[#123B55] to-[#0D5C63]'
                        }`}
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/60">
                            {isExclusive ? 'Category Exclusive' : 'Category Featured'}
                          </p>
                          <p className="mt-1 text-lg font-black tracking-tight text-white">
                            {featuredCategory}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${
                            isExclusive
                              ? 'bg-[#F2D77E] text-[#332400]'
                              : 'bg-[#5DE0D7] text-[#063B3F]'
                          }`}
                        >
                          {isExclusive ? 'Exclusive' : 'Featured'}
                        </span>
                      </div>

                      <div className="p-3 sm:p-4">
                        <FirmCard
                          firm={displayFirm}
                          onClick={() => setSelectedFirm(firm)}
                        />
                      </div>

                      <div className="border-t border-slate-100 px-5 py-4">
                        <p className="text-xs leading-5 text-slate-500">
                          Paid premium placement for <span className="font-bold text-[#0F2A43]">{featuredCategory}</span>.
                          {' '}Other practice areas may be listed on the firm profile.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 px-6 py-12 text-center backdrop-blur-sm">
              <p className="font-semibold text-slate-200">
                Premium category placements are currently available.
              </p>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('pricing')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="mt-4 font-bold text-[#5DE0D7] hover:underline"
              >
                View law firm plans
              </button>
            </div>
          )}

          <p className="mt-7 text-center text-xs leading-5 text-slate-400">
            Category Exclusive placements maintain homepage presence. Category Featured placements rotate through the Featured position.
          </p>
        </div>
      </section>

      {/* Practice areas */}
      <section
        id="categories"
        className="bg-gray-50 py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#C99A2E]">
              Legal Services
            </p>

            <h2 className="text-3xl font-bold text-[#0F2A43]">
              Browse by Practice Area
            </h2>

            <p className="mt-3 text-gray-600">
              Choose a legal category to
              find El Paso firms handling
              that type of matter.
            </p>
          </div>

          <div
            className={`grid gap-4 ${
              showAllCategories
                ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {displayedCategories.map(
              (category) => {
                const Icon =
                  CATEGORY_ICONS[
                    category.slug
                  ] ?? Scale;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      handleCategoryClick(
                        category.slug
                      )
                    }
                    className="group flex min-h-36 flex-col items-center justify-center rounded-2xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#1FA8A1] hover:shadow-lg"
                  >
                    <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F2A43] to-[#1FA8A1] text-white shadow-sm transition group-hover:scale-105">
                      <Icon className="h-7 w-7" />
                    </span>

                    <span className="font-bold text-[#0F2A43]">
                      {category.title}
                    </span>
                  </button>
                );
              }
            )}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setShowAllCategories(
                  (current) => !current
                )
              }
              className="inline-flex items-center gap-2 rounded-lg border border-[#0F2A43]/20 bg-white px-6 py-3 font-semibold text-[#0F2A43] shadow-sm transition hover:bg-[#0F2A43] hover:text-white"
            >
              {showAllCategories ? (
                <>
                  Show Main Categories
                  <ChevronUp className="h-5 w-5" />
                </>
              ) : (
                <>
                  View All Practice Areas
                  <ChevronDown className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <SeoPracticeAreaLinks />

      {/* Search listings */}
      <section
        id="search"
        className="scroll-mt-20 bg-white py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0F2A43]">
              Find Lawyers
            </h2>

            <p className="mt-2 text-gray-600">
              {selectedCategoryTitle
                ? `Showing El Paso firms for ${selectedCategoryTitle}.`
                : 'Search all listed El Paso law firms.'}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <SearchFilters
                selectedCategory={
                  selectedCategory
                }
                onCategoryChange={
                  setSelectedCategory
                }
                featuredOnly={featuredOnly}
                onFeaturedChange={
                  setFeaturedOnly
                }
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#1FA8A1]" />
                </div>
              ) : sortedFirms.length ===
                0 ? (
                <div className="rounded-2xl border border-dashed bg-gray-50 py-12 text-center text-gray-500">
                  <p className="font-medium">
                    No matching firms were
                    found.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(
                        'all'
                      );
                      setSearchQuery('');
                      setFeaturedOnly(false);
                    }}
                    className="mt-3 font-semibold text-[#1FA8A1] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {sortedFirms.map((firm) => (
                    <FirmCard
                      key={firm.id}
                      firm={firm}
                      onClick={() =>
                        setSelectedFirm(firm)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-br from-[#0F2A43] to-[#1FA8A1] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold">
            How It Works
          </h2>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <Scale className="mx-auto mb-4 h-12 w-12 text-[#F5B800]" />
              <h3 className="mb-2 font-bold">
                Search
              </h3>
              <p className="text-sm opacity-90">
                Browse by name or practice
                area
              </p>
            </div>

            <div className="text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-[#F5B800]" />
              <h3 className="mb-2 font-bold">
                Compare
              </h3>
              <p className="text-sm opacity-90">
                Compare profiles, practice areas and firm information
              </p>
            </div>

            <div className="text-center">
              <Shield className="mx-auto mb-4 h-12 w-12 text-[#F5B800]" />
              <h3 className="mb-2 font-bold">
                Connect
              </h3>
              <p className="text-sm opacity-90">
                Contact attorneys directly
              </p>
            </div>

            <div className="text-center">
              <Award className="mx-auto mb-4 h-12 w-12 text-[#F5B800]" />
              <h3 className="mb-2 font-bold">
                Get Help
              </h3>
              <p className="text-sm opacity-90">
                Find counsel for your legal
                matter
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section
        id="resources"
        className="bg-white py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#0F2A43]">
            Texas Law Resources
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-center text-gray-600">
            Plain-English guides to Texas
            law, written for El Paso
            residents.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {articles.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="/guides" className="inline-flex items-center rounded-lg bg-[#0F2A43] px-6 py-3 font-bold text-white transition hover:bg-[#163b5d]">Browse All Texas Law Guides</a>
          </div>
        </div>
      </section>

      {/* For El Paso law firms */}
      <WhyLawFirmsJoin
        onListFirm={() =>
          document.getElementById("list-form")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
        onViewPricing={() =>
          document.getElementById("pricing")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      />
      {/* Pricing */}
      <section
        id="pricing"
        className="bg-gray-50 py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#0F2A43]">
            Plans for Law Firms
          </h2>

          <p className="mb-8 text-center text-gray-600">
            Start free. Upgrade at any
            time.
          </p>

          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
              />
            ))}
          </div>

          <p className="text-center text-sm text-gray-600">
            Plans renew monthly. Cancel
            anytime. Upgrades take effect
            immediately.
          </p>
        </div>
      </section>

      {/* List firm */}
      <section
        id="list-form"
        className="bg-white py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ListFirmForm />
        </div>
      </section>

      {/* Disclaimers */}
      <section
        id="disclaimers"
        className="bg-gray-50 py-16"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#0F2A43]">
            Legal Disclaimers
          </h2>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="mb-2 font-bold">
                No Legal Advice
              </h3>
              <p>
                Information on this site is
                for general informational
                purposes only and is not
                legal advice.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-bold">
                Advertising Disclosure
              </h3>
              <p>
                Some listings are paid
                advertisements. Featured
                labels indicate paid
                placement.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-bold">
                Accuracy
              </h3>
              <p>
                We do not guarantee the
                completeness or accuracy
                of profiles; confirm
                details with the firm
                directly.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-bold">
                Texas-Specific
              </h3>
              <p>
                Texas law changes over
                time; consult a licensed
                Texas attorney for advice
                about your situation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <FirmModal
        firm={selectedFirm}
        open={Boolean(selectedFirm)}
        onClose={() =>
          setSelectedFirm(null)
        }
      />

    </div>
  );
}