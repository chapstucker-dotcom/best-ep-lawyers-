import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

import {
  Award,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Images,
  Languages,
  Linkedin,
  Facebook,
  Instagram,
  Crown,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  PlayCircle,
  Scale,
  Star,
  UserRound,
  Users,
} from "lucide-react";

import type { Firm } from "../data/types";
import type { AttorneyProfile } from "../data/attorneyTypes";

import { categories } from "../data/categories";
import { ReviewForm } from "./ReviewForm";
import LeadCaptureForm from "./LeadCaptureForm";
import { supabase } from "@/lib/supabase";
import { getPlanRules } from "@/config/planRules";

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
}

interface FirmModalProps {
  firm: Firm | null;
  open: boolean;
  onClose: () => void;
}

type PublicFirm = Firm & {
  description?: string | null;
  blurb?: string | null;
  logo?: string | null;
  logo_url?: string | null;
  specialties?: string[] | null;
  categories?: string[] | null;
  is_featured?: boolean | null;
  featured?: boolean | null;
  is_verified?: boolean | null;
  zip_code?: string | null;
  plan_key?: string | null;
  video_url?: string | null;
  years_experience?: number | string | null;
  team_size?: number | string | null;
  consultation_fee?: number | string | null;
  office_hours?: string | null;
  languages?: string[] | null;
  awards?: string[] | null;
  linkedin_url?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  google_maps_url?: string | null;
  gallery_urls?: string[] | null;
};


const normalizePlanKey = (value: unknown): string =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const getVideoEmbedUrl = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    );
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com"
    ) {
      const id =
        url.searchParams.get("v") ||
        url.pathname.match(/\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = url.pathname
        .split("/")
        .filter(Boolean)
        .find((part) => /^\d+$/.test(part));
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    return null;
  } catch {
    return null;
  }
};

function FirmModal({
  firm,
  open,
  onClose,
}: FirmModalProps) {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [attorneys, setAttorneys] = useState<AttorneyProfile[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loadingAttorneys, setLoadingAttorneys] = useState(false);
  const [liveFirm, setLiveFirm] = useState<PublicFirm | null>(null);

  const loadLiveFirm = async (firmId: string) => {
    const { data, error } = await supabase
      .from("firms")
      .select("*")
      .eq("id", firmId)
      .maybeSingle();

    if (error) {
      console.error("Failed to refresh firm details:", error);
      setLiveFirm(null);
      return;
    }

    setLiveFirm((data ?? null) as PublicFirm | null);
  };

  const loadReviews = async (firmId: string) => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("firm_id", firmId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load reviews:", error);
      setReviews([]);
      return;
    }

    setReviews((data ?? []) as Review[]);
  };

  const loadAttorneys = async (firmId: string) => {
    setLoadingAttorneys(true);

    const { data, error } = await supabase
      .from("attorney_profiles")
      .select("*")
      .eq("firm_id", firmId)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Failed to load attorneys:", error);
      setAttorneys([]);
      setLoadingAttorneys(false);
      return;
    }

    setAttorneys((data ?? []) as AttorneyProfile[]);
    setLoadingAttorneys(false);
  };

  useEffect(() => {
    if (!firm?.id || !open) return;

    void loadLiveFirm(firm.id);
    void loadReviews(firm.id);
    void loadAttorneys(firm.id);
  }, [firm?.id, open]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  if (!firm) return null;

  const publicFirm = {
    ...(firm as PublicFirm),
    ...(liveFirm ?? {}),
  } as PublicFirm;

  const firmDescription =
    publicFirm.description?.trim() ||
    publicFirm.blurb?.trim() ||
    "";

  const firmLogo =
    publicFirm.logo_url?.trim() ||
    publicFirm.logo?.trim() ||
    "";

  const isFeatured =
    Boolean(publicFirm.is_featured) ||
    Boolean(publicFirm.featured);

  const isVerified =
    Boolean(publicFirm.is_verified);

  const planKey = normalizePlanKey(
    publicFirm.plan_key ?? publicFirm.plan
  );

  const isCategoryFeatured =
    planKey === "category_featured" || planKey === "featured";

  const isCategoryExclusive =
    planKey === "category_exclusive" || planKey === "exclusive";

  const videoEmbedUrl =
    (isCategoryFeatured || isCategoryExclusive) &&
    publicFirm.video_url
      ? getVideoEmbedUrl(publicFirm.video_url)
      : null;

  const rawPracticeAreas =
    publicFirm.specialties?.length
      ? publicFirm.specialties
      : publicFirm.categories ?? [];

  const normalizedPracticeAreas = rawPracticeAreas
    .map((value) => String(value).trim())
    .filter(Boolean);

  const matchedCategories = categories.filter((category) =>
    normalizedPracticeAreas.some(
      (storedValue) =>
        storedValue.toLowerCase() === category.slug.toLowerCase() ||
        storedValue.toLowerCase() === category.title.toLowerCase()
    )
  );

  const unmatchedPracticeAreas = normalizedPracticeAreas.filter(
    (storedValue) =>
      !categories.some(
        (category) =>
          storedValue.toLowerCase() === category.slug.toLowerCase() ||
          storedValue.toLowerCase() === category.title.toLowerCase()
      )
  );

  const displayedPracticeAreas = [
    ...matchedCategories.map((category) => ({
      key: category.id,
      title: category.title,
    })),
    ...unmatchedPracticeAreas.map((practiceArea) => ({
      key: practiceArea,
      title: practiceArea,
    })),
  ];

  const zipCode =
    publicFirm.zip_code ||
    publicFirm.zip ||
    "";

  const addressParts = [
    publicFirm.address,
    publicFirm.city,
    publicFirm.state,
    zipCode,
  ].filter(Boolean);

  const fullAddress = addressParts.join(", ");

  const openWebsite = () => {
    if (!publicFirm.website) return;

    const websiteUrl = /^https?:\/\//i.test(publicFirm.website)
      ? publicFirm.website
      : `https://${publicFirm.website}`;

    window.open(
      websiteUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openDirections = () => {
    if (!fullAddress) return;

    const directionsUrl =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        fullAddress
      )}`;

    window.open(
      directionsUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openAttorneyProfile = (attorneyId: string) => {
    onClose();
    navigate(`/attorney/${attorneyId}`);
  };

  const yearsExperience = Number(
    publicFirm.years_experience ?? 0
  );

  const teamSize = Number(
    publicFirm.team_size ?? 0
  );

  const consultationFee = Number(
    publicFirm.consultation_fee ?? 0
  );

  const hasFirmStats =
    yearsExperience > 0 ||
    teamSize > 0 ||
    consultationFee > 0;

  const languages =
    Array.isArray(publicFirm.languages)
      ? publicFirm.languages.filter(Boolean)
      : [];

  const awards =
    Array.isArray(publicFirm.awards)
      ? publicFirm.awards.filter(Boolean)
      : [];

  const galleryUrls =
    Array.isArray(publicFirm.gallery_urls)
      ? publicFirm.gallery_urls.filter(Boolean)
      : [];

  const premiumHighlights = [
    isCategoryExclusive
      ? "Category Owner placement"
      : isCategoryFeatured
        ? "Premium featured placement"
        : null,
    videoEmbedUrl
      ? "Video introduction"
      : null,
    attorneys.length > 0
      ? `${attorneys.length} attorney profile${
          attorneys.length === 1 ? "" : "s"
        }`
      : null,
    reviews.length > 0
      ? `${reviews.length} approved review${
          reviews.length === 1 ? "" : "s"
        }`
      : null,
  ].filter(Boolean) as string[];

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="max-h-[94vh] max-w-7xl overflow-y-auto border-0 p-0 shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{publicFirm.name}</DialogTitle>
          <DialogDescription>
            View firm information, attorneys, practice areas, contact options,
            introduction video, consultation form, and client reviews.
          </DialogDescription>
        </DialogHeader>

        <section className="bg-gradient-to-r from-[#0F2A43] via-[#176B78] to-[#1FA8A1] px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {firmLogo ? (
              <img
                src={firmLogo}
                alt={`${publicFirm.name} logo`}
                className="h-28 w-28 shrink-0 rounded-2xl border-4 border-white bg-white object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-4 border-white/80 bg-white/10 shadow-lg">
                <Building2 className="h-14 w-14 text-white" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap gap-2">
                {(publicFirm.plan_key || publicFirm.plan) && (
                  <Badge className="border border-white/30 bg-white/90 text-[#0F2A43]">
                    {isCategoryExclusive
                      ? "Category Exclusive"
                      : isCategoryFeatured
                        ? "Category Featured"
                        : publicFirm.plan_key || publicFirm.plan}
                  </Badge>
                )}

                {isCategoryExclusive && (
                  <Badge className="bg-[#F5B800] text-[#0F2A43]">
                    <Crown className="mr-1 h-3.5 w-3.5 fill-current" />
                    Category Owner
                  </Badge>
                )}

                {isFeatured && (
                  <Badge className="bg-[#F5B800] text-[#0F2A43]">
                    <Star className="mr-1 h-3.5 w-3.5 fill-current" />
                    Featured Firm
                  </Badge>
                )}

                {isVerified && (
                  <Badge className="border border-white/30 bg-white/15 text-white">
                    Verified Listing
                  </Badge>
                )}
              </div>

              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                {publicFirm.name}
              </h2>

              {averageRating && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 fill-[#F5B800] text-[#F5B800]"
                      />
                    ))}
                  </div>

                  <span className="font-semibold">
                    {averageRating}
                  </span>

                  <span className="text-white/80">
                    ({reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}

              {fullAddress && (
                <p className="mt-4 flex items-start gap-2 text-white/90">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{fullAddress}</span>
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="border-b bg-white px-6 py-4 sm:px-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {premiumHighlights.length > 0 ? (
              premiumHighlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-center gap-2 text-sm font-semibold text-[#0F2A43]"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1FA8A1]" />
                  <span>{highlight}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0F2A43]">
                <CheckCircle2 className="h-4 w-4 text-[#1FA8A1]" />
                Professional local firm profile
              </div>
            )}
          </div>
        </section>

        <div className="space-y-8 px-6 py-7 sm:px-8">
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {publicFirm.phone && (
              <Button
                type="button"
                className="h-12 bg-[#1FA8A1] text-base hover:bg-[#178D87]"
                onClick={() =>
                  window.location.assign(`tel:${publicFirm.phone}`)
                }
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Firm
              </Button>
            )}

            {publicFirm.email && (
              <Button
                type="button"
                variant="outline"
                className="h-12 text-base"
                onClick={() =>
                  window.location.assign(`mailto:${publicFirm.email}`)
                }
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Firm
              </Button>
            )}

            {publicFirm.website && (
              <Button
                type="button"
                variant="outline"
                className="h-12 text-base"
                onClick={openWebsite}
              >
                <Globe className="mr-2 h-5 w-5" />
                Visit Website
              </Button>
            )}

            {fullAddress && (
              <Button
                type="button"
                variant="outline"
                className="h-12 text-base"
                onClick={openDirections}
              >
                <MapPin className="mr-2 h-5 w-5" />
                Directions
              </Button>
            )}
          </section>

                    {videoEmbedUrl && (
            <section className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-[#D4A62A]/40 bg-[#0F2A43] shadow-lg">
              <div className="border-b border-white/10 px-6 py-4 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4A62A]">
                  {isCategoryExclusive
                    ? "Exclusive Video Introduction"
                    : "Featured Video Introduction"}
                </p>

                <h3 className="mt-2 flex items-center gap-2 text-xl font-bold">
                  <PlayCircle className="h-5 w-5 text-[#D4A62A]" />
                  Meet {publicFirm.name}
                </h3>
              </div>

              <div className="aspect-video w-full overflow-hidden bg-black">
                <iframe
                  src={videoEmbedUrl}
                  title={`${publicFirm.name} introduction video`}
                  className="h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </section>
          )}
          {hasFirmStats && (
            <section className="grid gap-4 sm:grid-cols-3">
              {yearsExperience > 0 && (
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F2A43] text-[#D4A62A]">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#0F2A43]">
                        {yearsExperience}+
                      </p>
                      <p className="text-sm text-gray-600">
                        Years of experience
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {teamSize > 0 && (
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F2A43] text-[#D4A62A]">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#0F2A43]">
                        {teamSize}
                      </p>
                      <p className="text-sm text-gray-600">
                        Team members
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {consultationFee > 0 && (
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F2A43] text-[#D4A62A]">
                      <Scale className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#0F2A43]">
                        ${consultationFee.toLocaleString("en-US")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Listed consultation fee
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          <section className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-2xl font-bold text-[#0F2A43]">
                About the Firm
              </h3>

              {firmDescription ? (
                <p className="whitespace-pre-line text-base leading-7 text-gray-600">
                  {firmDescription}
                </p>
              ) : (
                <p className="text-gray-500">
                  This firm has not added a full description yet.
                </p>
              )}

              {(isCategoryFeatured || isCategoryExclusive) && (
                <div className="mt-6 rounded-xl border border-[#D4A62A]/30 bg-[#0F2A43] p-5 text-white">
                  <div className="flex items-start gap-3">
                    <Award className="mt-0.5 h-6 w-6 shrink-0 text-[#D4A62A]" />
                    <div>
                      <p className="font-bold">
                        {isCategoryExclusive
                          ? "Category Owner Profile"
                          : "Category Featured Profile"}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-white/75">
                        This firm receives premium visibility within the El Paso legal directory.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <aside className="rounded-2xl border bg-gray-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-[#0F2A43]">
                Firm Information
              </h3>

              <div className="space-y-4 text-sm">
                {publicFirm.phone && (
                  <a
                    href={`tel:${publicFirm.phone}`}
                    className="flex items-start gap-3 text-gray-700 hover:text-[#1FA8A1]"
                  >
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#1FA8A1]" />
                    <span>{publicFirm.phone}</span>
                  </a>
                )}

                {publicFirm.email && (
                  <a
                    href={`mailto:${publicFirm.email}`}
                    className="flex items-start gap-3 break-all text-gray-700 hover:text-[#1FA8A1]"
                  >
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#1FA8A1]" />
                    <span>{publicFirm.email}</span>
                  </a>
                )}

                {publicFirm.website && (
                  <button
                    type="button"
                    onClick={openWebsite}
                    className="flex items-start gap-3 text-left text-gray-700 hover:text-[#1FA8A1]"
                  >
                    <Globe className="mt-0.5 h-5 w-5 shrink-0 text-[#1FA8A1]" />
                    <span className="break-all">
                      {publicFirm.website}
                    </span>
                  </button>
                )}

                {fullAddress && (
                  <button
                    type="button"
                    onClick={openDirections}
                    className="flex items-start gap-3 text-left text-gray-700 hover:text-[#1FA8A1]"
                  >
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#1FA8A1]" />
                    <span>{fullAddress}</span>
                  </button>
                )}
              </div>
            </aside>
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-2xl font-bold text-[#0F2A43]">
              Practice Areas
            </h3>

            {displayedPracticeAreas.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {displayedPracticeAreas.map((practiceArea) => (
                  <Badge
                    key={practiceArea.key}
                    variant="secondary"
                    className="rounded-full px-4 py-2 text-sm"
                  >
                    {practiceArea.title}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No practice areas have been added yet.
              </p>
            )}
          </section>

          <section>
            <h3 className="mb-5 flex items-center gap-2 text-2xl font-bold text-[#0F2A43]">
              <UserRound className="h-6 w-6" />
              Attorneys ({attorneys.length})
            </h3>

            {loadingAttorneys ? (
              <div className="rounded-2xl border p-8 text-center text-gray-500">
                Loading attorneys...
              </div>
            ) : attorneys.length === 0 ? (
              <div className="rounded-2xl border p-8 text-center text-gray-500">
                No attorney profiles have been added yet.
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {attorneys.map((attorney) => (
                  <article
                    key={attorney.id}
                    className="h-full rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#1FA8A1]/50 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row">
                      {attorney.photo_url ? (
                        <img
                          src={attorney.photo_url}
                          alt={attorney.name}
                          className="h-28 w-28 shrink-0 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-4xl font-bold text-gray-400">
                          {attorney.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h4 className="text-xl font-bold text-[#0F2A43]">
                          {attorney.name}
                        </h4>

                        {attorney.title && (
                          <p className="mt-1 font-medium text-gray-600">
                            {attorney.title}
                          </p>
                        )}

                        {attorney.bio && (
                          <p className="mt-3 line-clamp-4 leading-6 text-gray-600">
                            {attorney.bio}
                          </p>
                        )}

                        {attorney.specialties?.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {attorney.specialties.map(
                              (specialty, index) => (
                                <Badge
                                  key={`${specialty}-${index}`}
                                  variant="secondary"
                                  className="rounded-full"
                                >
                                  {specialty}
                                </Badge>
                              )
                            )}
                          </div>
                        )}

                        <div className="mt-5 flex flex-wrap gap-3">
                          {attorney.email && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a href={`mailto:${attorney.email}`}>
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                              </a>
                            </Button>
                          )}

                          {attorney.phone && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a href={`tel:${attorney.phone}`}>
                                <Phone className="mr-2 h-4 w-4" />
                                Call
                              </a>
                            </Button>
                          )}

                          {attorney.linkedin_url && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a
                                href={
                                  /^https?:\/\//i.test(attorney.linkedin_url)
                                    ? attorney.linkedin_url
                                    : `https://${attorney.linkedin_url}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                LinkedIn
                              </a>
                            </Button>
                          )}

                          <Button
                            type="button"
                            size="sm"
                            className="bg-[#1FA8A1] hover:bg-[#178D87]"
                            onClick={() =>
                              openAttorneyProfile(attorney.id)
                            }
                          >
                            View Full Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {(publicFirm.office_hours ||
            languages.length > 0 ||
            awards.length > 0) && (
            <section className="grid gap-6 lg:grid-cols-3">
              {publicFirm.office_hours && (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 text-[#1FA8A1]" />
                    <h3 className="text-lg font-bold text-[#0F2A43]">
                      Office Hours
                    </h3>
                  </div>
                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-700">
                    {publicFirm.office_hours}
                  </p>
                </div>
              )}

              {languages.length > 0 && (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Languages className="h-5 w-5 text-[#1FA8A1]" />
                    <h3 className="text-lg font-bold text-[#0F2A43]">
                      Languages Spoken
                    </h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {languages.map((language) => (
                      <Badge key={language} variant="secondary">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {awards.length > 0 && (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-[#D4A62A]" />
                    <h3 className="text-lg font-bold text-[#0F2A43]">
                      Awards & Recognition
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm text-gray-700">
                    {awards.map((award) => (
                      <li key={award} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1FA8A1]" />
                        <span>{award}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {galleryUrls.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-3">
                <Images className="h-5 w-5 text-[#1FA8A1]" />
                <h3 className="text-xl font-bold text-[#0F2A43]">
                  Firm Gallery
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryUrls.map((url, index) => (
                  <img
                    key={`${url}-${index}`}
                    src={url}
                    alt={`${publicFirm.name} gallery image ${index + 1}`}
                    className="aspect-[4/3] w-full rounded-2xl border object-cover shadow-sm"
                    loading="lazy"
                  />
                ))}
              </div>
            </section>
          )}

          {(publicFirm.google_maps_url ||
            publicFirm.linkedin_url ||
            publicFirm.facebook_url ||
            publicFirm.instagram_url) && (
            <section className="rounded-2xl border bg-gray-50 p-6">
              <h3 className="text-xl font-bold text-[#0F2A43]">
                Connect With the Firm
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">
                {publicFirm.google_maps_url && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        publicFirm.google_maps_url!,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    View on Google Maps
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </Button>
                )}

                {publicFirm.linkedin_url && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      window.open(publicFirm.linkedin_url!, "_blank", "noopener,noreferrer")
                    }
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                )}

                {publicFirm.facebook_url && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      window.open(publicFirm.facebook_url!, "_blank", "noopener,noreferrer")
                    }
                  >
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                )}

                {publicFirm.instagram_url && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      window.open(publicFirm.instagram_url!, "_blank", "noopener,noreferrer")
                    }
                  >
                    <Instagram className="mr-2 h-4 w-4" />
                    Instagram
                  </Button>
                )}
              </div>
            </section>
          )}

         <div
  id={`consultation-form-${publicFirm.id}`}
  className="scroll-mt-24"
>
  <LeadCaptureForm
    firmId={publicFirm.id}
    firmName={publicFirm.name}
    firmEmail={publicFirm.email}
    practiceArea={displayedPracticeAreas[0]?.title}
  />
</div>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h3 className="flex items-center gap-2 text-2xl font-bold text-[#0F2A43]">
                <MessageSquare className="h-6 w-6" />
                Client Reviews ({reviews.length})
              </h3>

              <Button
                type="button"
                onClick={() =>
                  setShowReviewForm((current) => !current)
                }
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </Button>
            </div>

            {showReviewForm && (
              <div className="mb-6 rounded-xl border bg-gray-50 p-4">
                <ReviewForm
                  firmId={publicFirm.id}
                  firmName={publicFirm.name}
                  onSuccess={() => {
                    setShowReviewForm(false);
                    void loadReviews(publicFirm.id);
                  }}
                />
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
                No approved reviews yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-xl border bg-gray-50 p-5"
                  >
                    <div className="mb-3 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            review.rating >= star
                              ? "fill-[#F5B800] text-[#F5B800]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    {review.title && (
                      <h4 className="font-bold text-[#0F2A43]">
                        {review.title}
                      </h4>
                    )}

                    <p className="mt-2 leading-6 text-gray-600">
                      {review.comment}
                    </p>

                    <div className="mt-4 border-t pt-3">
                      <p className="font-medium text-gray-800">
                        {review.reviewer_name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {new Date(
                          review.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="sticky bottom-0 z-10 -mx-6 border-t bg-white/95 px-6 py-4 shadow-[0_-8px_24px_rgba(15,42,67,0.10)] backdrop-blur sm:-mx-8 sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-bold text-[#0F2A43]">
                  Ready to speak with {publicFirm.name}?
                </p>

                <p className="text-sm text-gray-600">
                  Call, email, visit the firm’s website, get directions, or request a consultation.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {publicFirm.phone && (
                  <Button
                    asChild
                    className="bg-[#1FA8A1] hover:bg-[#178D87]"
                  >
                    <a
                      href={`tel:${publicFirm.phone.replace(
                        /[^\d+]/g,
                        ""
                      )}`}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Firm
                    </a>
                  </Button>
                )}

                {publicFirm.email && (
                  <Button asChild variant="outline">
                    <a href={`mailto:${publicFirm.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email Firm
                    </a>
                  </Button>
                )}

                {publicFirm.website && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={openWebsite}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Website
                  </Button>
                )}

                {fullAddress && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={openDirections}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Directions
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    document
                      .getElementById(
                        `consultation-form-${publicFirm.id}`
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Request Consultation
                </Button>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FirmModal;