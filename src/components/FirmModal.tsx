import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Phone, Mail, Globe, MapPin, Star, MessageSquare } from 'lucide-react';
import { Firm } from '../data/types';
import { categories } from '../data/categories';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ReviewForm } from './ReviewForm';
import { supabase } from '@/lib/supabase';

interface Review { id: string; reviewer_name: string; rating: number; title: string; comment: string; created_at: string; }
interface FirmModalProps { firm: Firm | null; open: boolean; onClose: () => void; }

export default function FirmModal({ firm, open, onClose }: FirmModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (firm?.id && open) fetchReviews();
  }, [firm?.id, open]);

  const fetchReviews = async () => {
    const { data } = await supabase.from('reviews').select('*').eq('firm_id', firm?.id).eq('is_approved', true).order('created_at', { ascending: false });
    setReviews(data || []);
  };

  if (!firm) return null;
  const firmCategories = categories.filter(c => firm.categories.includes(c.slug));
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-2xl">{firm.name}</DialogTitle></DialogHeader>
        <div className="space-y-6">
          {firm.coverImage && <img src={firm.coverImage} alt={firm.name} className="w-full h-48 object-cover rounded-lg" />}
          <div className="flex items-center gap-4">
            {firm.logo && <img src={firm.logo} alt={`${firm.name} logo`} className="w-20 h-20 rounded-lg" />}
            <div>
              <div className="flex gap-2 mb-2">
                <Badge variant="outline">{firm.plan}</Badge>
                {firm.featured && <Badge className="bg-[#F5B800] text-[#0F2A43]">Featured</Badge>}
                {avgRating && <Badge className="bg-yellow-100 text-yellow-800"><Star className="h-3 w-3 mr-1 fill-yellow-500" />{avgRating} ({reviews.length})</Badge>}
              </div>
              <p className="text-gray-600">{firm.blurb}</p>
            </div>
          </div>
          <div><h3 className="font-bold text-lg mb-2">Practice Areas</h3><div className="flex flex-wrap gap-2">{firmCategories.map(cat => <Badge key={cat.id} variant="secondary">{cat.title}</Badge>)}</div></div>
          <div className="grid md:grid-cols-2 gap-4">
            <Button className="bg-[#1FA8A1] hover:bg-[#1FA8A1]/90" onClick={() => window.open(`tel:${firm.phone}`)}><Phone className="mr-2 h-4 w-4" />Call</Button>
            <Button variant="outline" onClick={() => window.open(`mailto:${firm.email}`)}><Mail className="mr-2 h-4 w-4" />Email</Button>
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><MessageSquare className="h-5 w-5" />Reviews ({reviews.length})</h3>
              <Button size="sm" onClick={() => setShowReviewForm(!showReviewForm)}>{showReviewForm ? 'Cancel' : 'Write Review'}</Button>
            </div>
            {showReviewForm && <ReviewForm firmId={firm.id} firmName={firm.name} onSuccess={() => { setShowReviewForm(false); fetchReviews(); }} />}
            {reviews.map(r => (
              <div key={r.id} className="border-b py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{r.reviewer_name}</span>
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`h-4 w-4 ${r.rating >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
                </div>
                {r.title && <p className="font-medium text-sm">{r.title}</p>}
                <p className="text-gray-600 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


