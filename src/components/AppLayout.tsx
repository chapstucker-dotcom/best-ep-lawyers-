import LawFirmMarketplace from "./LawFirmMarketplace";
import SeoPracticeAreaLinks from "./SeoPracticeAreaLinks";
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";




import Hero from './Hero';
import FirmCard from './FirmCard';
import LeadCaptureForm from './LeadCaptureForm';
import ArticleCard from './ArticleCard';


import SearchFilters from './SearchFilters';
import Footer from './Footer';

import { getAllFirms } from '@/services/firmService';
import {
  categories,
  getPracticeAreaTitle,
} from '../data/categories';
import { articles } from '../data/articles';

import { getPlanRules } from '@/config/planRules';

import type { Firm } from '../data/types';

import {
  Award,
  BriefcaseBusiness,
  Building2,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crown,
  ExternalLink,
  MapPin,
  Phone,
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

type HomepageFirm = Firm & {
  logo_url?: string | null;
  image_url?: string | null;
  primary_category?: string | null;
  category?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
};

const getHomepageFirmLogo = (firm: Firm): string => {
  const homepageFirm = firm as HomepageFirm;
  return String(
    homepageFirm.logo_url ??
      homepageFirm.image_url ??
      ''
  ).trim();
};

const getHomepageFirmLocation = (firm: Firm): string => {
  const homepageFirm = firm as HomepageFirm;
  const city = String(homepageFirm.city ?? 'El Paso').trim();
  const state = String(homepageFirm.state ?? 'TX').trim();
  return [city, state].filter(Boolean).join(', ');
};

const getHomepageFirmInitials = (firm: Firm): string =>
  String(firm.name ?? 'Law Firm')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');



export default function AppLayout() {
  const navigate = useNavigate();
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('all');
  const [featuredOnly, setFeaturedOnly] =
    useState(false);
  const [sortBy, setSortBy] =
    useState('relevance');

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

  const homepageExclusiveFirms = useMemo(
    () =>
      firms
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
        ),
    [firms]
  );

  const homepageFeaturedFirms = useMemo(() => {
    const rotatingFeatured = rotateFeaturedFirms(
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

    return rotatingFeatured.slice(0, 3);
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
      {/* Premium homepage placements */}
      <section className="bg-[#061A2C] px-4 pb-3 pt-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#D4A62A]" />
            </div>
          ) : (
            <>
              <div className="rounded-2xl border-2 border-[#F5B800] bg-[#071D2F]/75 px-3 pb-3 pt-1 shadow-[0_0_20px_rgba(245,184,0,0.28)] sm:px-4">
                <div className="mb-2 flex items-center justify-center gap-4">
                  <div className="hidden h-px max-w-28 flex-1 bg-gradient-to-r from-transparent to-[#D4A62A] sm:block" />
                  <div className="flex items-center gap-2">
                    <Crown className="h-7 w-7 fill-[#F5B800] text-[#F5B800]" />
                    <h2 className="font-serif text-xl font-black uppercase tracking-wide text-[#F5B800] sm:text-2xl">
                      Exclusive Law Firms
                    </h2>
                  </div>
                  <div className="hidden h-px max-w-28 flex-1 bg-gradient-to-l from-transparent to-[#D4A62A] sm:block" />
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {homepageExclusiveFirms.slice(0, 5).map((firm) => {
                    const category = getFeaturedCategory(firm);
                    const logo = getHomepageFirmLogo(firm);
                    const location = getHomepageFirmLocation(firm);

                    return (
                      <article
                        key={firm.id}
                        className="group relative flex min-h-[285px] flex-col overflow-visible rounded-xl border-[3px] border-[#FFD21F] bg-[#FFFDF8] px-4 pb-4 pt-8 text-[#071D2F] shadow-[0_0_14px_rgba(255,210,31,0.55),0_10px_28px_rgba(0,0,0,0.24)] transition hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,210,31,0.72),0_14px_34px_rgba(0,0,0,0.28)]"
                      >
                        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-md border border-[#FFD45A] bg-gradient-to-r from-[#E0AB26] via-[#F5B800] to-[#FFD45A] px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#061A2C] shadow-[0_0_12px_rgba(245,184,0,0.55)]">
                          Exclusive
                        </span>

                        <div className="flex h-20 items-center justify-center">
                          {logo ? (
                            <img
                              src={logo}
                              alt={`${firm.name} logo`}
                              className="max-h-16 max-w-[90%] object-contain"
                            />
                          ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-[#D4A62A] bg-[#071D2F] text-2xl font-black text-white">
                              {getHomepageFirmInitials(firm)}
                            </div>
                          )}
                        </div>

                        <div className="mt-2 flex flex-1 flex-col text-center">
                          <h3 className="line-clamp-2 min-h-[48px] font-serif text-[17px] font-black uppercase leading-6 text-[#071D2F]">
                            {firm.name}
                          </h3>

                          <p className="mt-3 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wide text-[#9A6413]">
                            <Scale className="h-4 w-4 shrink-0" />
                            <span className="line-clamp-1">{category}</span>
                          </p>

                          <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-slate-700">
                            <MapPin className="h-4 w-4" />
                            {location}
                          </p>

                          <button
                            type="button"
                            onClick={() => navigate(`/firm/${firm.id}`)}
                            className="mt-auto inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border-2 border-[#E6B319] bg-white font-black text-[#071D2F] transition hover:bg-[#FFF6D9]"
                          >
                            View Profile
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="mt-1.5 rounded-2xl border border-[#1FA8A1]/35 bg-[#071D2F]/60 px-3 pb-3 pt-1 sm:px-4">
                <div className="relative mb-2 flex min-h-10 items-center justify-center">
                  <div className="flex items-center gap-2">
                    <Award className="h-6 w-6 fill-[#42C6BE] text-[#42C6BE]" />
                    <h2 className="text-lg font-black uppercase tracking-wide text-[#42C6BE] sm:text-xl">
                      Featured Law Firms
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                      setFeaturedOnly(true);
                      scrollToSearch();
                    }}
                    className="hidden rounded-lg border border-[#42C6BE]/45 px-3 py-1.5 text-[11px] font-bold text-[#5DE0D7] transition hover:bg-[#1FA8A1]/10 sm:absolute sm:right-0 sm:block"
                  >
                    View All Featured Firms →
                  </button>
                </div>

                <div className="grid items-center gap-2 lg:grid-cols-[42px_1fr_42px]">
                  <button
                    type="button"
                    aria-label="Previous featured firms"
                    disabled
                    className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#D4A62A] text-[#D4A62A] opacity-70 lg:flex"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="grid gap-3 lg:grid-cols-[repeat(3,minmax(0,390px))] lg:justify-between">
                    {homepageFeaturedFirms.slice(0, 3).map((firm) => {
                      const category = getFeaturedCategory(firm);
                      const logo = getHomepageFirmLogo(firm);
                      const location = getHomepageFirmLocation(firm);
                      const homepageFirm = firm as HomepageFirm;

                      return (
                        <article
                          key={firm.id}
                          className="group relative grid min-h-[108px] w-full grid-cols-[84px_1fr] overflow-hidden rounded-xl border border-[#1FA8A1]/45 bg-white text-[#071D2F] shadow-md transition hover:-translate-y-0.5"
                        >
                          <div className="relative flex items-center justify-center bg-gradient-to-br from-[#176B78] to-[#1FA8A1] p-3">
                            <span className="absolute left-2 top-2 rounded bg-[#1FA8A1] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                              Featured
                            </span>

                            {logo ? (
                              <img
                                src={logo}
                                alt={`${firm.name} logo`}
                                className="mt-3 max-h-16 max-w-full object-contain"
                              />
                            ) : (
                              <div className="mt-3 flex h-14 w-14 items-center justify-center rounded-lg border border-white/40 bg-white/10 text-lg font-black text-white">
                                {getHomepageFirmInitials(firm)}
                              </div>
                            )}
                          </div>

                          <div className="flex min-w-0 flex-col p-3">
                            <h3 className="line-clamp-1 text-base font-black">
                              {firm.name}
                            </h3>

                            <p className="mt-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-[#168C8B]">
                              <Scale className="h-3.5 w-3.5 shrink-0" />
                              <span className="line-clamp-1">{category}</span>
                            </p>

                            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {location}
                              </span>
                              {homepageFirm.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3.5 w-3.5" />
                                  {homepageFirm.phone}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => navigate(`/firm/${firm.id}`)}
                              className="mt-auto self-end text-[11px] font-bold text-[#168C8B] transition hover:text-[#0F5D66]"
                            >
                              View Profile →
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    aria-label="Next featured firms"
                    disabled
                    className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#D4A62A] text-[#D4A62A] opacity-70 lg:flex"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Consumer legal issue intake */}
      <section className="bg-[#061A2C] px-4 pb-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <LeadCaptureForm
            practiceArea="General Legal Inquiry"
            title="Get Matched with the Right Lawyer"
            description="Whether you've been in an accident, need a criminal defense attorney, or have a family law matter, tell us what you're facing and we'll use your request to help identify relevant local legal options in El Paso."
            variant="homepage"
          />
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
                        navigate(`/firm/${firm.id}`)
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

      <LawFirmMarketplace
        firmCount={firms.length}
        categoryCount={categories.length}
      />

      {/* Law firm business gateway */}
      <section className="border-y border-[#D4A62A]/25 bg-gradient-to-br from-[#061A2C] via-[#0F2A43] to-[#123D55] py-14 text-white">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div>
        <div className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#D4A62A]">
          For El Paso Law Firms
        </div>

        <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          More Visibility. More Opportunities to Connect.
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
          Build your presence where people are actively searching for El Paso
          legal help. Start with a complimentary firm listing, then add enhanced
          profiles, lead tools, advertising, and limited premium category
          visibility as your firm grows.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="bg-[#D4A62A] font-semibold text-[#061A2C] hover:bg-[#E3B83E]"
          >
            <Link to="/for-law-firms">
              Advertising &amp; Law Firm Listings
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link to="/pricing">Compare Firm Plans</Link>
          </Button>
        </div>

        <p className="mt-3 text-sm text-slate-300">
          Complimentary firm listings available.
        </p>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <Award className="mt-1 h-6 w-6 shrink-0 text-[#D4A62A]" />
          <div>
            <h3 className="text-xl font-bold">Built for the El Paso Legal Market</h3>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Present your firm clearly, highlight your attorneys and practice
              areas, and give prospective clients direct ways to learn more.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "Local El Paso legal directory exposure",
            "Practice-area visibility",
            "Firm and attorney profile options",
            "Limited premium placement inventory",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-2 rounded-lg border border-white/10 bg-[#061A2C]/35 p-3"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A62A]" />
              <span className="text-sm text-slate-100">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-xl border border-white/10 bg-white p-5 text-[#061A2C] shadow-lg">
        <Award className="h-6 w-6 text-[#B88A12]" />
        <h3 className="mt-4 text-lg font-bold">Premium Visibility</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Increase visibility in relevant practice areas with enhanced firm
          presentation and limited Featured or Exclusive category
          opportunities.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white p-5 text-[#061A2C] shadow-lg">
        <Users className="h-6 w-6 text-[#B88A12]" />
        <h3 className="mt-4 text-lg font-bold">
          Enhanced Firm &amp; Attorney Profiles
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Showcase your firm, attorneys, practice areas, biography, photos,
          contact information, website, and other details available with your
          plan.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white p-5 text-[#061A2C] shadow-lg">
        <Phone className="h-6 w-6 text-[#B88A12]" />
        <h3 className="mt-4 text-lg font-bold">Lead &amp; Contact Tools</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Give prospective clients clear ways to view your profile, visit your
          website, contact your firm, and submit consultation inquiries when
          included with your plan.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white p-5 text-[#061A2C] shadow-lg">
        <ExternalLink className="h-6 w-6 text-[#B88A12]" />
        <h3 className="mt-4 text-lg font-bold">Search &amp; Content Visibility</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Build visibility across the El Paso legal directory, practice-area
          pages, attorney profiles, and relevant consumer legal resources.
        </p>
      </div>
    </div>

    <p className="mt-7 text-center text-xs leading-5 text-slate-300">
      Paid placement increases visibility but does not constitute an
      endorsement, ranking of legal ability, or guarantee of clients, leads,
      search rankings, or case results.
    </p>
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
</div>
  );
}
