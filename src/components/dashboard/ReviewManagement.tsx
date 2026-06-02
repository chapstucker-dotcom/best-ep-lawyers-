import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X, Loader2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Review {
  id: string;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  title: string;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export const ReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    setLoading(true);
    const { data: firms } = await supabase.from('firms').select('id').eq('user_id', user?.id);
    if (firms?.length) {
      const { data } = await supabase.from('reviews').select('*').in('firm_id', firms.map(f => f.id)).order('created_at', { ascending: false });
      setReviews(data || []);
    }
    setLoading(false);
  };

  const handleAction = async (reviewId: string, approve: boolean) => {
    setActionLoading(reviewId);
    try {
      if (approve) {
        await supabase.from('reviews').update({ is_approved: true }).eq('id', reviewId);
        toast({ title: 'Approved', description: 'Review is now visible' });
      } else {
        await supabase.from('reviews').delete().eq('id', reviewId);
        toast({ title: 'Deleted', description: 'Review removed' });
      }
      fetchReviews();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-4 w-4 ${rating >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-[#1FA8A1]" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Review Management</h2>
        <p className="text-gray-600 mt-2">Manage client reviews for your firm</p>
      </div>

      {reviews.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" /><p className="text-gray-500">No reviews yet</p></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold">{review.reviewer_name}</span>
                      {renderStars(review.rating)}
                      <Badge variant={review.is_approved ? 'default' : 'secondary'}>{review.is_approved ? 'Approved' : 'Pending'}</Badge>
                    </div>
                    {review.title && <p className="font-medium mb-1">{review.title}</p>}
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                  {!review.is_approved && (
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" onClick={() => handleAction(review.id, true)} disabled={!!actionLoading} className="bg-green-600 hover:bg-green-700">
                        {actionLoading === review.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleAction(review.id, false)} disabled={!!actionLoading}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};


