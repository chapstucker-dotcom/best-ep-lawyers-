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
  Building2,
  Crown,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  PlayCircle,
  Star,
  UserRound,
} from "lucide-react";

import type { Firm } from "../data/types";
import type { AttorneyProfile } from "../data/attorneyTypes";

import { categories } from "../data/categories";
import { ReviewForm } from "./ReviewForm";
import LeadCaptureForm from "./LeadCaptureForm";
import { supabase } from "@/lib/supabase";

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
    void loadReviews(publicFirm.id);
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

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto p-0">
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
            <section className="overflow-hidden rounded-2xl border border-[#D4A62A]/40 bg-[#0F2A43] shadow-lg">
              <div className="border-b border-white/10 px-6 py-5 text-white">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D4A62A]">
                  {isCategoryExclusive
                    ? "Exclusive Video Introduction"
                    : "Featured Video Introduction"}
                </p>
                <h3 className="mt-2 flex items-center gap-2 text-2xl font-bold">
                  <PlayCircle className="h-6 w-6 text-[#D4A62A]" />
                  Meet {publicFirm.name}
                </h3>
              </div>

              <div className="aspect-video w-full bg-black">
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
              <div className="grid gap-5">
                {attorneys.map((attorney) => (
                  <article
                    key={attorney.id}
                    className="rounded-2xl border bg-white p-5 shadow-sm transition hover:border-[#1FA8A1]/50 hover:shadow-md"
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

          <LeadCaptureForm
            firmId={publicFirm.id}
            firmName={publicFirm.name}
            firmEmail={publicFirm.email}
            practiceArea={displayedPracticeAreas[0]?.title}
          />

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
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FirmModal;