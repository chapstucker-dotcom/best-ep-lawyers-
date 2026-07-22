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

type FirmWithDescription = Firm & {
  description?: string | null;
  blurb?: string | null;
  logo_url?: string | null;
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

  const publicFirm = firm as FirmWithDescription;

  const firmDescription =
    publicFirm.description?.trim() ||
    publicFirm.blurb?.trim() ||
    '';

  const firmLogo =
    publicFirm.logo ||
    publicFirm.logo_url ||
    '';

  const firmCategories = categories.filter((category) =>
    firm.categories?.includes(category.slug)
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

    window.open(website, '_blank', 'noopener,noreferrer');
  };

  const openDirections = () => {
    if (!fullAddress) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      fullAddress
    )}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {firm.name}
          </DialogTitle>

          <DialogDescription>
            View firm information, attorneys, practice areas,
            contact options, and client reviews.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          <section className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {firmLogo ? (
              <img
                src={firmLogo}
                alt={`${firm.name} logo`}
                className="h-24 w-24 rounded-lg border object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-lg border bg-gray-100">
                <UserRound className="h-10 w-10 text-gray-400" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap gap-2">
                {firm.plan && (
                  <Badge variant="outline">
                    {firm.plan}
                  </Badge>
                )}

                {firm.featured && (
                  <Badge className="bg-[#F5B800] text-[#0F2A43]">
                    Featured
                  </Badge>
                )}

                {averageRating && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="mr-1 h-3 w-3 fill-yellow-500" />
                    {averageRating} ({reviews.length})
                  </Badge>
                )}
              </div>

              {fullAddress && (
                <p className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {fullAddress}
                </p>
              )}

              {firmDescription && (
                <div className="mt-5 max-w-3xl">
                  <h3 className="mb-2 text-base font-semibold text-gray-900">
                    About the Firm
                  </h3>

                  <p className="whitespace-pre-line leading-relaxed text-gray-600">
                    {firmDescription}
                  </p>
                </div>
              )}
            </div>
          </section>

          {firmCategories.length > 0 && (
            <section>
              <h3 className="mb-3 text-lg font-bold">
                Practice Areas
              </h3>

              <div className="flex flex-wrap gap-2">
                {firmCategories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                  >
                    {category.title}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {firm.phone && (
              <Button
                type="button"
                className="bg-[#1FA8A1] hover:bg-[#1FA8A1]/90"
                onClick={() =>
                  window.location.assign(`tel:${firm.phone}`)
                }
              >
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
            )}

            {firm.email && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  window.location.assign(`mailto:${firm.email}`)
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            )}

            {firm.website && (
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
          </section>

          <section>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <UserRound className="h-5 w-5" />
              Attorneys ({attorneys.length})
            </h3>

            {loadingAttorneys ? (
              <div className="rounded-lg border p-6 text-center text-gray-500">
                Loading attorneys...
              </div>
            ) : attorneys.length === 0 ? (
              <div className="rounded-lg border p-6 text-center text-gray-500">
                No attorney profiles have been added yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {attorneys.map((attorney) => (
                  <div
                    key={attorney.id}
                    className="flex gap-4 rounded-lg border p-4"
                  >
                    {attorney.photo_url ? (
                      <img
                        src={attorney.photo_url}
                        alt={attorney.name}
                        className="h-20 w-20 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl font-semibold text-gray-500">
                        {attorney.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold">
                        {attorney.name}
                      </h4>

                      {attorney.title && (
                        <p className="text-sm text-gray-600">
                          {attorney.title}
                        </p>
                      )}

                      {attorney.bio && (
                        <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                          {attorney.bio}
                        </p>
                      )}

                      {attorney.specialties?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {attorney.specialties.map(
                            (specialty, index) => (
                              <Badge
                                key={`${specialty}-${index}`}
                                variant="secondary"
                                className="text-xs"
                              >
                                {specialty}
                              </Badge>
                            )
                          )}
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        {attorney.email && (
                          <a
                            href={`mailto:${attorney.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            Email
                          </a>
                        )}

                        {attorney.phone && (
                          <a
                            href={`tel:${attorney.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            Call
                          </a>
                        )}

                        {attorney.linkedin_url && (
                          <a
                            href={
                              attorney.linkedin_url.startsWith('http')
                                ? attorney.linkedin_url
                                : `https://${attorney.linkedin_url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        className="mt-4"
                        onClick={() => {
                          onClose();
                          navigate(`/attorney/${attorney.id}`);
                        }}
                      >
                        View Full Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <MessageSquare className="h-5 w-5" />
                Reviews ({reviews.length})
              </h3>

              <Button
                type="button"
                size="sm"
                onClick={() =>
                  setShowReviewForm((current) => !current)
                }
              >
                {showReviewForm ? 'Cancel' : 'Write Review'}
              </Button>
            </div>

            {showReviewForm && (
              <div className="mb-5">
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
              <div className="rounded-lg border p-6 text-center text-gray-500">
                No approved reviews yet.
              </div>
            ) : (
              <div className="divide-y rounded-lg border px-4">
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="py-4"
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        {review.reviewer_name}
                      </span>

                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              review.rating >= star
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {review.title && (
                      <p className="text-sm font-medium">
                        {review.title}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-gray-600">
                      {review.comment}
                    </p>
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