import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Article } from '../data/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface ArticleModalProps {
  article: Article | null;
  open: boolean;
  onClose: () => void;
}

export default function ArticleModal({ article, open, onClose }: ArticleModalProps) {
  if (!article) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{article.title}</DialogTitle>
            <Badge variant="secondary">{article.topic}</Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-gray-600 italic">{article.summary}</p>
          
          <div className="prose max-w-none">
            <p className="text-gray-700">{article.body}</p>
          </div>
          
          {article.faqs && article.faqs.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible>
                {article.faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-amber-900 mb-2">Disclaimer</p>
            <p className="text-amber-800">
              This information is for general educational purposes only and is not legal advice. 
              Texas law changes over time. Consult a licensed Texas attorney for advice about your specific situation.
            </p>
          </div>
          
          <p className="text-xs text-gray-500">
            Last updated: {new Date(article.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}


