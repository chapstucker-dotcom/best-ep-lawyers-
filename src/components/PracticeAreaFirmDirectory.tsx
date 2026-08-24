import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Crown,
  Globe2,
  Loader2,
  MapPin,
  Phone,
  Scale,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { Firm } from "../data/types";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";
import { getAllFirms } from "../services/firmService";

type Props = {
  page: PracticeAreaPageData;
};

type PublicFirm = Firm & {
  category?: string;
  categories?: string[];
  specialties?: string[];
  description?: string;
  bio?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  zip_code?: string;
  plan?: string;
  plan_key?: string;
  is_featured?: boolean;
  featured?: boolean;
  is_verified?: boolean;
  verified?: boolean;
};

const PRACTICE_ALIASES: Record<string, string[]> = {
  probate: [
    "probate",
    "estate",
    "will",
    "trust",
    "heirship",
    "guardianship",
    "elder law",
  ],
  bankruptcy: [
    "bankruptcy",
    "chapter 7",
    "chapter 13",
    "debt relief",
  ],
  employment: [
    "employment",
    "labor",
    "wrongful termination",
    "discrimination",
    "wage",
  ],
  business: [
    "business",
    "corporate",
    "commercial",
    "contract",
    "partnership",
  ],
  "real estate": [
    "real estate",
    "property",
    "landlord",
    "tenant",
    "title",
  ],
  "civil litigation": [
    "civil litigation",
    "litigation",
    "contract dispute",
    "business dispute",
  ],
  divorce: [
    "divorce",
    "family law",
    "custody",
    "child support",
  ],
  "child custody": [
    "child custody",
    "family law",
    "divorce",
    "visitation",
  ],
  "car accident": [
    "car accident",
    "auto accident",
    "personal injury",
    "motor vehicle",
  ],
  "truck accident": [
    "truck accident",
    "18-wheeler",
    "commercial vehicle",
    "personal injury",
  ],
  "motorcycle accident": [
    "motorcycle accident",
    "personal injury",
    "motor vehicle",
  ],
  "wrongful death": [
    "wrongful death",
    "personal injury",
    "fatal accident",
  ],
  "green card": [
    "green card",
    "immigration",
    "adjustment of status",
  ],
  citizenship: [
    "citizenship",
    "naturalization",
    "immigration",
  ],
  immigration: [
    "immigration",
    "green card",
    "citizenship",
    "deportation",
  ],
  "personal injury": [
    "personal injury",
    "car accident",
    "truck accident",
    "wrongful death",
    "injury",
  ],
  "criminal defense": [
    "criminal defense",
    "criminal law",
    "dwi",
    "dui",
  ],
  dwi: [
    "dwi",
    "dui",
    "criminal defense",
    "criminal law",
  ],
  "family law": [
    "family law",
    "divorce",
    "custody",
    "child support",
  ],
  "estate planning": [
    "estate planning",
    "probate",
    "wills",
    "trusts",
  ],
};

function normalize(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getFirmSearchText(
  firm: PublicFirm
): string {
  return normalize(
    [
      firm.name,
      firm.category,
      ...(firm.specialties ?? []),
      ...(firm.categories ?? []),
    ].join(" ")
  );
}

function getPlanKey(
  firm: PublicFirm
): string {
  return normalize(
    firm.plan_key ?? firm.plan
  );
}

function getPlanRank(
  firm: PublicFirm
): number {
  const plan = getPlanKey(firm);

  if (plan.includes("exclusive")) return 4;
  if (plan.includes("featured")) return 3;
  if (plan.includes("expert")) return 2;
  if (plan.includes("pro")) return 1;

  return 0;
}

function planLabel(
  firm: PublicFirm
): string | null {
  const plan = getPlanKey(firm);

  if (plan.includes("exclusive")) {
    return "Category Owner";
  }

  if (plan.includes("featured")) {
    return "Category Featured";
  }

  if (plan.includes("expert")) {
    return "Expert";
  }

  if (plan.includes("pro")) {
    return "Pro";
  }

  return null;
}

function externalUrl(
  value: string
): string {
  return /^https?:\/\//i.test(value)
    ? value
    : `https://${value}`;
}

function matchesPracticeArea(
  firm: PublicFirm,
  page: PracticeAreaPageData
): boolean {
  const firmText =
    getFirmSearchText(firm);

  const key =
    normalize(page.shortTitle);

  const aliases =
    PRACTICE_ALIASES[key] ?? [key];

  return aliases.some((alias) =>
    firmText.includes(normalize(alias))
  );
}

export default function PracticeAreaFirmDirectory({
  page,
}: Props) {
  const [firms, setFirms] =
    useState<PublicFirm[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    const loadFirms = async () => {
      try {
        const { data, error } =
          await getAllFirms();

        if (error) {
          console.error(
            "Failed to load practice-area firms:",
            error
          );
        }

        if (active) {
          setFirms(
            (data ?? []) as PublicFirm[]
          );
        }
      } catch (error) {
        console.error(
          "Failed to load practice-area firms:",
          error
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadFirms();

    return () => {
      active = false;
    };
  }, []);

  const matchingFirms = useMemo(
    () =>
      firms
        .filter(
          (firm) =>
            firm?.name &&
            matchesPracticeArea(
              firm,
              page
            )
        )
        .sort((a, b) => {
          const rankDifference =
            getPlanRank(b) -
            getPlanRank(a);

          if (rankDifference !== 0) {
            return rankDifference;
          }

          const bFeatured = Number(
            Boolean(
              b.is_featured ??
                b.featured
            )
          );

          const aFeatured = Number(
            Boolean(
              a.is_featured ??
                a.featured
            )
          );

          return bFeatured - aFeatured;
        })
        .slice(0, 6),
    [firms, page]
  );

  return (
    <section
      id={`${normalize(
        page.shortTitle
      ).replace(/\s+/g, "-")}-firms`}
      className="scroll-mt-24 bg-[#07162f] text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-bold uppercase tracking-widest text-[#d6a928]">
              Local Directory
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              El Paso {page.shortTitle}{" "}
              Law Firms
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-slate-300">
              Compare local law firms
              serving El Paso. Review
              practice information,
              contact details and firm
              websites to help find a
              lawyer for your legal
              needs.
            </p>
          </div>

          <Link
            to="/pricing"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d6a928]/50 px-6 py-3 font-bold text-[#d6a928] transition hover:bg-[#d6a928] hover:text-[#07162f]"
          >
            For Law Firms
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 flex min-h-48 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <Loader2 className="h-8 w-8 animate-spin text-[#d6a928]" />

            <span className="ml-3 font-semibold">
              Loading local firms...
            </span>
          </div>
        ) : matchingFirms.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {matchingFirms.map(
              (firm, index) => {
                const plan =
                  getPlanKey(firm);

                const rank =
                  getPlanRank(firm);

                const tier =
                  planLabel(firm);

                const verified =
                  Boolean(
                    firm.is_verified ??
                      firm.verified
                  );

                const isExclusive =
                  plan.includes(
                    "exclusive"
                  );

                const isFeatured =
                  !isExclusive &&
                  plan.includes(
                    "featured"
                  );

                const isExpert =
                  !isExclusive &&
                  !isFeatured &&
                  plan.includes("expert");

                const isPro =
                  !isExclusive &&
                  !isFeatured &&
                  !isExpert &&
                  plan.includes("pro");

                const rawAddress =
                  String(
                    firm.address ?? ""
                  ).trim();

                const city =
                  String(
                    firm.city ?? ""
                  ).trim();

                const state =
                  String(
                    firm.state ?? ""
                  ).trim();

                const zip =
                  String(
                    firm.zip_code ??
                      firm.zip ??
                      ""
                  ).trim();

                const address =
                  rawAddress &&
                  city &&
                  rawAddress
                    .toLowerCase()
                    .includes(
                      city.toLowerCase()
                    )
                    ? rawAddress
                    : [
                        rawAddress,
                        city,
                        state,
                        zip,
                      ]
                        .filter(Boolean)
                        .join(", ");

                const cardClass =
                  isExclusive
                    ? "relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[#d6a928] bg-[#0b2348] p-6 text-white shadow-2xl ring-1 ring-[#d6a928]/30"
                    : isFeatured
                    ? "relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[#d6a928] bg-white p-6 text-slate-900 shadow-2xl"
                    : isExpert
                    ? "relative flex h-full flex-col rounded-2xl border border-[#d6a928]/60 bg-white p-6 text-slate-900 shadow-xl"
                    : isPro
                    ? "flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl"
                    : "flex h-full flex-col rounded-2xl border border-white/15 bg-white p-6 text-slate-900 shadow-xl";

                const headingClass =
                  isExclusive
                    ? "text-white"
                    : "text-[#07162f]";

                const bodyClass =
                  isExclusive
                    ? "text-slate-300"
                    : "text-slate-600";

                const detailClass =
                  isExclusive
                    ? "text-slate-200"
                    : "text-slate-700";

                return (
                  <article
                    key={String(
                      firm.id ??
                        `${firm.name}-${index}`
                    )}
                    className={cardClass}
                  >
                    {isExclusive && (
                      <div className="-mx-6 -mt-6 mb-6 flex items-center justify-center gap-2 bg-[#d6a928] px-4 py-2.5 text-sm font-extrabold uppercase tracking-wider text-[#07162f]">
                        <Crown className="h-4 w-4" />
                        Category Owner
                      </div>
                    )}

                    {isFeatured && (
                      <div className="-mx-6 -mt-6 mb-6 flex items-center justify-center gap-2 bg-[#d6a928] px-4 py-2.5 text-sm font-extrabold uppercase tracking-wider text-[#07162f]">
                        <Star className="h-4 w-4 fill-current" />
                        Featured Firm
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={
                          isExclusive
                            ? "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#d6a928] text-[#07162f]"
                            : "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#07162f] text-[#d6a928]"
                        }
                      >
                        {isExclusive ? (
                          <Crown className="h-7 w-7" />
                        ) : isFeatured ||
                          isExpert ? (
                          <Sparkles className="h-7 w-7" />
                        ) : (
                          <Building2 className="h-7 w-7" />
                        )}
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        {tier &&
                          !isExclusive &&
                          !isFeatured && (
                            <span className="rounded-full bg-[#d6a928]/20 px-3 py-1 text-xs font-bold text-[#7a5800]">
                              {tier}
                            </span>
                          )}

                        {verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <h3
                      className={`mt-5 text-2xl font-bold ${headingClass}`}
                    >
                      {firm.name}
                    </h3>

                    {(firm.category ||
                      (firm.specialties &&
                        firm.specialties
                          .length > 0)) && (
                      <p className="mt-2 font-semibold text-[#b58a1d]">
                        {firm.category ??
                          firm.specialties
                            ?.slice(0, 2)
                            .join(" · ")}
                      </p>
                    )}

                    <p
                      className={`mt-4 line-clamp-4 leading-7 ${bodyClass}`}
                    >
                      {firm.description ||
                        firm.bio ||
                        `Local law firm listed for ${page.shortTitle.toLowerCase()} searches in El Paso.`}
                    </p>

                    {rank >= 2 && (
                      <div
                        className={
                          isExclusive
                            ? "mt-5 rounded-xl border border-white/15 bg-white/5 px-4 py-3"
                            : "mt-5 rounded-xl bg-[#f8f4e8] px-4 py-3"
                        }
                      >
                        <p
                          className={
                            isExclusive
                              ? "text-sm font-bold text-[#d6a928]"
                              : "text-sm font-bold text-[#7a5800]"
                          }
                        >
                          Enhanced Firm Profile
                        </p>

                        <p
                          className={`mt-1 text-sm ${bodyClass}`}
                        >
                          Expanded visibility
                          and profile features
                          for consumers comparing
                          local firms.
                        </p>
                      </div>
                    )}

                    <div
                      className={`mt-6 space-y-3 text-sm ${detailClass}`}
                    >
                      {firm.phone && (
                        <a
                          href={`tel:${firm.phone}`}
                          className="flex items-center gap-3 font-semibold hover:text-[#d6a928]"
                        >
                          <Phone className="h-4 w-4 shrink-0 text-[#d6a928]" />
                          {firm.phone}
                        </a>
                      )}

                      {address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d6a928]" />
                          <span>
                            {address}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto flex flex-wrap gap-3 pt-7">
                      {firm.website && (
                        <a
                          href={externalUrl(
                            firm.website
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className={
                            isExclusive
                              ? "inline-flex items-center gap-2 rounded-lg bg-[#d6a928] px-4 py-2.5 font-bold text-[#07162f] transition hover:bg-[#e3b53a]"
                              : "inline-flex items-center gap-2 rounded-lg bg-[#07162f] px-4 py-2.5 font-bold text-white transition hover:bg-[#123665]"
                          }
                        >
                          <Globe2 className="h-4 w-4" />
                          Firm Website
                        </a>
                      )}

                      {firm.phone && (
                        <a
                          href={`tel:${firm.phone}`}
                          className={
                            isExclusive
                              ? "inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 font-bold text-white transition hover:bg-white hover:text-[#07162f]"
                              : "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 font-bold text-[#07162f] transition hover:border-[#d6a928]"
                          }
                        >
                          <Phone className="h-4 w-4" />
                          Call
                        </a>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-white/25 bg-white/10 p-10 text-center">
            <Scale className="mx-auto h-10 w-10 text-[#d6a928]" />

            <h3 className="mt-4 text-2xl font-bold">
              More local firms coming soon
            </h3>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-300">
              We are continuing to
              expand this El Paso legal
              directory. You can also
              browse other practice
              areas to find local legal
              help.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#d6a928] px-6 py-3 font-bold text-[#07162f]"
            >
              Browse Practice Areas
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}