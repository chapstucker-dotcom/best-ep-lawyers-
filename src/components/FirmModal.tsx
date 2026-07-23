import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

import { Badge } from './ui/badge';
import { Button } from './ui/button';

import {
  Building2,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  UserRound,
} from 'lucide-react';

import type { Firm } from '../data/types';
import type { AttorneyProfile } from '../data/attorneyTypes';

import { categories } from '../data/categories';
import { ReviewForm } from './ReviewForm';
import { supabase } from '@/lib/supabase';

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
  is_featured?: boolean | null;
  featured?: boolean | null;
  is_verified?: boolean | null;
  specialties?: string[] | null;
};

export default function FirmModal({
  firm,
  open,
  onClose,
}: FirmModalProps) {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [attorneys, setAttorneys] = useState<AttorneyProfile[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loadingAttorneys, setLoadingAttorneys] = useState(false);

  useEffect(() => {
    if (!firm?.id || !open) return;

    void fetchReviews();
    void fetchAttorneys();
  }, [firm?.id, open]);

  const fetchReviews = async () => {
    if (!firm?.id) return;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('firm_id', firm.id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load reviews:', error);
      setReviews([]);
      return;
    }

    setReviews(data ?? []);
  };

  const fetchAttorneys = async () => {
    if (!firm?.id) return;

    setLoadingAttorneys(true);

    const { data, error } = await supabase
      .from('attorney_profiles')
      .select('*')
      .eq('firm_id', firm.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Failed to load attorneys:', error);
      setAttorneys([]);
      setLoadingAttorneys(false);
      return;
    }

    setAttorneys((data ?? []) as AttorneyProfile[]);
    setLoadingAttorneys(false);
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  if (!firm) return null;

  const publicFirm = firm as PublicFirm;

  const firmDescription =
    publicFirm.description?.trim() ||
    publicFirm.blurb?.trim() ||
    '';

  const firmLogo =
    publicFirm.logo_url ||
    publicFirm.logo ||
    '';

  const isFeatured =
    Boolean(publicFirm.is_featured) ||
    Boolean(publicFirm.featured);

  const isVerified =
    Boolean(publicFirm.is_verified);

  const storedPracticeAreas =
    publicFirm.specialties?.length
      ? publicFirm.specialties
      : firm.categories || [];

  const firmCategories = categories.filter((category) =>
    storedPracticeAreas.some(
      (storedValue) =>
        storedValue.toLowerCase() === category.slug.toLowerCase() ||
        storedValue.toLowerCase() === category.title.toLowerCase()
    )
  );

  const addressParts = [
    firm.address,
    firm.city,
    firm.state,
    firm.zip,
  ].filter(Boolean);

  const fullAddress = addressParts.join(', ');

  const openWebsite = () => {
    if (!firm.website) return;

    const website = firm.website.startsWith('http')
      ? firm.website
      : `https://${firm.website}`;

    window.open(
      website,
      '_blank',
      'noopener,noreferrer'
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
      '_blank',
      'noopener,noreferrer'
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
          <DialogTitle>{firm.name}</DialogTitle>

          <DialogDescription>
            View firm information, attorneys, practice areas,
            contact options, and client reviews.
          </DialogDescription>
        </DialogHeader>

        <section className="bg-gradient-to-r from-[#0F2A43] via-[#176B78] to-[#1FA8A1] px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {firmLogo ? (
              <img
                src={firmLogo}
                alt={`${firm.name} logo`}
                className="h-28 w-28 shrink-0 rounded-2xl border-4 border-white bg-white object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-4 border-white/80 bg-white/10 shadow-lg">
                <Building2 className="h-14 w-14 text-white" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap gap-2">
                {firm.plan && (
                  <Badge className="border border-white/30 bg-white/90 text-[#0F2A43]">
                    {firm.plan}
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
                {firm.name}
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
                    ({reviews.length}{' '}
                    {reviews.length === 1 ? 'review' : 'reviews'})
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
            {firm.phone && (
              <Button
                type="button"
                className="h-12 bg-[#1FA8A1] text-base hover:bg-[#178D87]"
                onClick={() =>
                  window.location.assign(`tel:${firm.phone}`)
                }
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Firm
              </Button>
            )}

            {firm.email && (
              <Button
                type="button"
                variant="outline"
                className="h-12 text-base"
                onClick={() =>
                  window.location.assign(`mailto:${firm.email}`)
                }
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Firm
              </Button>
            )}

            {firm.website && (
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
                {firm.phone && (
                  <a
                    href={`tel:${firm.phone}`}
                    className="flex items-start gap-3 text-gray-700 hover:text-[#1FA8A1]"
                  >
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#1FA8A1]" />
                    <span>{firm.phone}</span>
                  </a>
                )}

                {firm.email && (
                  <a
                    href={`mailto:${firm.email}`}
                    className="flex items-start gap-3 break-all text-gray-700 hover:text-[#1FA8A1]"
                  >
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#1FA8A1]" />
                    <span>{firm.email}</span>
                  </a>
                )}

                {firm.website && (
                  <button
                    type="button"
                    onClick={openWebsite}
                    className="flex items-start gap-3 text-left text-gray-700 hover:text-[#1FA8A1]"
                  >
                    <Globe className="mt-0.5 h-5 w-5 shrink-0 text-[#1FA8A1]" />
                    <span className="break-all">
                      {firm.website}
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

            {firmCategories.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {firmCategories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="rounded-full px-4 py-2 text-sm"
                  >
                    {category.title}
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
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="flex items-center gap-2 text-2xl font-bold text-[#0F2A43]">
                <UserRound className="h-6 w-6" />
                Attorneys ({attorneys.length})
              </h3>
            </div>

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
                                  attorney.linkedin_url.startsWith(
                                    'http'
                                  )
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
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </Button>
            </div>

            {showReviewForm && (
              <div className="mb-6 rounded-xl border bg-gray-50 p-4">
                <ReviewForm
                  firmId={firm.id}
                  firmName={firm.name}
                  onSuccess={() => {
                    setShowReviewForm(false);
                    void fetchReviews();
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
                              ? 'fill-[#F5B800] text-[#F5B800]'
                              : 'text-gray-300'
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