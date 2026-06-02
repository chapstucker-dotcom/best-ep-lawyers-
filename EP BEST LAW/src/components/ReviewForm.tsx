import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ReviewFormProps {
  firmId: string;
  firmName: string;
  onSuccess?: () => void;
}

export const ReviewForm = ({ firmId, firmName, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ title: 'Error', description: 'Please select a rating', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        firm_id: firmId,
        reviewer_name: name,
        reviewer_email: email,
        rating,
        title,
        comment,
        is_approved: false
      });
      if (error) throw error;
      toast({ title: 'Success', description: 'Review submitted! It will appear after approval.' });
      setRating(0); setName(''); setEmail(''); setTitle(''); setComment('');
      onSuccess?.();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review for {firmName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Rating</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}>
                  <Star className={`h-8 w-8 ${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Your Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          </div>
          <div><Label>Review Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summarize your experience" /></div>
          <div><Label>Your Review</Label><Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} required placeholder="Share your experience..." /></div>
          <Button type="submit" className="w-full bg-[#1FA8A1] hover:bg-[#1FA8A1]/90" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};


