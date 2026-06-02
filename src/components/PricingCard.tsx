import { Card } from './ui/card';
import { Button } from './ui/button';
import { Check } from 'lucide-react';
import { Plan } from '../data/types';

interface PricingCardProps {
  plan: Plan;
}

export default function PricingCard({ plan }: PricingCardProps) {
  const handleSelectPlan = () => {
    document.getElementById('list-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card className={`p-6 ${plan.isFeatured ? 'border-[#1FA8A1] border-2 shadow-xl' : ''}`}>
      {plan.isFeatured && (
        <div className="bg-[#F5B800] text-[#0F2A43] text-sm font-bold text-center py-1 -mx-6 -mt-6 mb-4 rounded-t-lg">
          POPULAR
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-[#0F2A43] mb-2">{plan.name}</h3>
        <div className="text-4xl font-bold text-[#1FA8A1] mb-1">
          ${plan.priceMonth}
          <span className="text-lg text-gray-600">/mo</span>
        </div>
        {plan.attorneyProfileLimit > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            +${plan.additionalAttorneyPrice}/mo per additional attorney
          </p>
        )}
      </div>
      
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-[#1FA8A1] flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className={`w-full ${plan.isFeatured ? 'bg-[#1FA8A1] hover:bg-[#1FA8A1]/90' : ''}`}
        variant={plan.isFeatured ? 'default' : 'outline'}
        onClick={handleSelectPlan}
      >
        Get Started
      </Button>
    </Card>
  );
}


