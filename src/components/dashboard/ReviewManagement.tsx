import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle,
  Flag,
  Loader2,
  MessageSquare,
  Send,
  Star,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Review {
  id: string;
  firm_id: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  comment: string;
  moderation_status:
    | 'pending'
    | 'published'
    | 'rejected'
    | 'disputed'
    | 'removed';
  firm_response: string | null;
  firm_response_at: string | null;
  dispute_status:
    | 'submitted'
    | 'reviewing'
    | 'resolved'
    | 'dismissed'
    | null;
  dispute_reason: string | null;
  dispute_details: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<Review['moderation_status'], string> = {
  pending: 'Pending EPBL Review',
  published: 'Published',
  rejected: 'Not Published',
  disputed: 'Under Review',
  removed: 'Removed',
};

const DISPUTE_REASONS = [
  { value: 'not_client', label: 'Reviewer was not a client' },
  { value: 'fake_spam', label: 'Suspected fake or spam review' },
  { value: 'wrong_firm', label: 'Review is for the wrong firm' },
  { value: 'conflict_of_interest', label: 'Potential conflict of interest' },
  { value: 'harassment_threats', label: 'Harassment or threats' },
  { value: 'private_information', label: 'Contains private or confidential information' },
  { value: 'other', label: 'Other' },
] as const;

export const ReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [responseReviewId, setResponseReviewId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const [disputeReviewId, setDisputeReviewId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDetails, setDisputeDetails] = useState('');

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    void fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    setLoading(true);

    try {
      if (!user?.id) {
        setReviews([]);
        return;
      }

      const { data: firms, error: firmsError } = await supabase
        .from('firms')
        .select('id')
        .eq('user_id', user.id);

      if (firmsError) throw firmsError;

      if (!firms?.length) {
        setReviews([]);
        return;
      }

      const firmIds = firms.map((firm) => firm.id);

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          firm_id,
          reviewer_name,
          rating,
          title,
          comment,
          moderation_status,
          firm_response,
          firm_response_at,
          dispute_status,
          dispute_reason,
          dispute_details,
          created_at
        `)
        .in('firm_id', firmIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews((data || []) as Review[]);
    } catch (err: any) {
      setReviews([]);
      toast({
        title: 'Unable to load reviews',
        description: err?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openResponse = (review: Review) => {
    setDisputeReviewId(null);
    setDisputeReason('');
    setDisputeDetails('');

    setResponseReviewId(review.id);
    setResponseText(review.firm_response || '');
  };

  const cancelResponse = () => {
    setResponseReviewId(null);
    setResponseText('');
  };

  const submitResponse = async (reviewId: string) => {
    const cleanResponse = responseText.trim();

    if (!cleanResponse) {
      toast({
        title: 'Response required',
        description: 'Enter a response before publishing.',
        variant: 'destructive',
      });
      return;
    }

    setActionLoading(reviewId);

    try {
      const { error } = await supabase.rpc('respond_to_review', {
        p_review_id: reviewId,
        p_response: cleanResponse,
      });

      if (error) throw error;

      toast({
        title: 'Response published',
        description: 'Your firm response has been added to the review.',
      });

      cancelResponse();
      await fetchReviews();
    } catch (err: any) {
      toast({
        title: 'Unable to publish response',
        description: err?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openDispute = (review: Review) => {
    setResponseReviewId(null);
    setResponseText('');

    setDisputeReviewId(review.id);
    setDisputeReason(review.dispute_reason || '');
    setDisputeDetails(review.dispute_details || '');
  };

  const cancelDispute = () => {
    setDisputeReviewId(null);
    setDisputeReason('');
    setDisputeDetails('');
  };

  const submitDispute = async (reviewId: string) => {
    if (!disputeReason) {
      toast({
        title: 'Reason required',
        description: 'Select a reason for reporting this review.',
        variant: 'destructive',
      });
      return;
    }

    setActionLoading(reviewId);

    try {
      const { error } = await supabase.rpc('dispute_review', {
        p_review_id: reviewId,
        p_reason: disputeReason,
        p_details: disputeDetails.trim() || null,
      });

      if (error) throw error;

      toast({
        title: 'Review reported',
        description:
          'Your report was submitted to El Paso’s Best Lawyers for review.',
      });

      cancelDispute();
      await fetchReviews();
    } catch (err: any) {
      toast({
        title: 'Unable to submit report',
        description: err?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            rating >= star
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const getStatusBadge = (review: Review) => {
    if (review.dispute_status === 'submitted') {
      return <Badge variant="secondary">Report Submitted</Badge>;
    }

    if (review.dispute_status === 'reviewing') {
      return <Badge variant="secondary">Under EPBL Review</Badge>;
    }

    return (
      <Badge
        variant={
          review.moderation_status === 'published' ? 'default' : 'secondary'
        }
      >
        {STATUS_LABELS[review.moderation_status]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#1FA8A1]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reviews & Reputation</h2>
        <p className="mt-2 text-gray-600">
          Monitor client reviews, publish professional responses, and report
          reviews that may violate our review standards.
        </p>
      </div>

      <Card className="border-blue-200 bg-blue-50/60">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-[#1FA8A1]" />
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">
                Independent review moderation
              </p>
              <p>
                El Paso’s Best Lawyers reviews submissions under the same
                moderation standards regardless of a firm’s subscription plan.
                Firms cannot approve or delete consumer reviews.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="font-medium text-gray-700">No reviews yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Reviews submitted for your firm will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isPublished = review.moderation_status === 'published';
            const disputeOpen =
              review.dispute_status === 'submitted' ||
              review.dispute_status === 'reviewing';

            return (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="space-y-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                          <span className="font-semibold">
                            {review.reviewer_name}
                          </span>
                          {renderStars(review.rating)}
                          {getStatusBadge(review)}
                        </div>

                        {review.title && (
                          <p className="mb-1 font-medium">{review.title}</p>
                        )}

                        <p className="text-sm leading-6 text-gray-600">
                          {review.comment}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        {isPublished && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openResponse(review)}
                            disabled={!!actionLoading}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {review.firm_response
                              ? 'Edit Response'
                              : 'Respond'}
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDispute(review)}
                          disabled={!!actionLoading || disputeOpen}
                        >
                          <Flag className="mr-2 h-4 w-4" />
                          {disputeOpen ? 'Reported' : 'Report Review'}
                        </Button>
                      </div>
                    </div>

                    {review.firm_response && (
                      <div className="rounded-lg border bg-gray-50 p-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-gray-900">
                            Response from the firm
                          </p>

                          {review.firm_response_at && (
                            <span className="text-xs text-gray-400">
                              {new Date(
                                review.firm_response_at
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <p className="text-sm leading-6 text-gray-700">
                          {review.firm_response}
                        </p>
                      </div>
                    )}

                    {responseReviewId === review.id && (
                      <div className="space-y-3 rounded-lg border p-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Public firm response
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Your response will be displayed publicly with this
                            review.
                          </p>
                        </div>

                        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                          <p>
                            Do not disclose confidential, privileged, or
                            personally identifying client information in a
                            public response.
                          </p>
                        </div>

                        <Textarea
                          value={responseText}
                          onChange={(event) =>
                            setResponseText(event.target.value)
                          }
                          placeholder="Write a professional response..."
                          rows={5}
                          maxLength={3000}
                        />

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() => submitResponse(review.id)}
                            disabled={actionLoading === review.id}
                          >
                            {actionLoading === review.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="mr-2 h-4 w-4" />
                            )}
                            Publish Response
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelResponse}
                            disabled={actionLoading === review.id}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {disputeReviewId === review.id && (
                      <div className="space-y-4 rounded-lg border p-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Report this review
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Reporting a review does not automatically remove or
                            hide it. El Paso’s Best Lawyers will review the
                            report under its moderation standards.
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor={`dispute-reason-${review.id}`}
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Reason
                          </label>

                          <select
                            id={`dispute-reason-${review.id}`}
                            value={disputeReason}
                            onChange={(event) =>
                              setDisputeReason(event.target.value)
                            }
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="">Select a reason</option>
                            {DISPUTE_REASONS.map((reason) => (
                              <option
                                key={reason.value}
                                value={reason.value}
                              >
                                {reason.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor={`dispute-details-${review.id}`}
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Additional details
                          </label>

                          <Textarea
                            id={`dispute-details-${review.id}`}
                            value={disputeDetails}
                            onChange={(event) =>
                              setDisputeDetails(event.target.value)
                            }
                            placeholder="Explain why this review should be reviewed by EPBL..."
                            rows={4}
                            maxLength={3000}
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() => submitDispute(review.id)}
                            disabled={actionLoading === review.id}
                          >
                            {actionLoading === review.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Flag className="mr-2 h-4 w-4" />
                            )}
                            Submit Report
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelDispute}
                            disabled={actionLoading === review.id}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {disputeOpen && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm font-semibold text-amber-900">
                          Report under review
                        </p>
                        <p className="mt-1 text-sm text-amber-800">
                          EPBL will review your report. The review’s publication
                          status is controlled by EPBL under the platform’s
                          moderation standards.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};