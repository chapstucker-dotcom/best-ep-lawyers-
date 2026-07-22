import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';

import { plans } from '@/data/plans';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const checkoutLinks: Record<string, string> = {
  expert:
    'https://buy.stripe.com/7sY8wOgQU8u65N198SaAw01',

  'category-featured':
    'https://buy.stripe.com/fZu6oG0RWeSu2AP98SaAw03',

  'category-exclusive':
    'https://buy.stripe.com/8x27sK3046lYb7lgBkaAw04',
};

export const Subscription = () => {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(
    null
  );

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadCurrentPlan = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('firms')
        .select('plan, plan_key')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error(
          'Unable to load current subscription plan:',
          error
        );
        return;
      }

      if (!data) {
        setCurrentPlan('free');
        return;
      }

      const databasePlan =
        data.plan_key || data.plan || 'free';

      const normalizedPlan =
        databasePlan === 'basic'
          ? 'free'
          : databasePlan;

      setCurrentPlan(normalizedPlan);
    };

    void loadCurrentPlan();
  }, [user]);

  const handleSubscribe = (planId: string) => {
    if (planId === 'free') {
      toast({
        title: 'Free Listing',
        description:
          'Your firm already has access to the free listing plan.',
      });
      return;
    }

    const checkoutUrl = checkoutLinks[planId];

    if (!checkoutUrl) {
      toast({
        title: 'Checkout unavailable',
        description:
          'The checkout link for this plan has not been configured.',
        variant: 'destructive',
      });
      return;
    }

    setLoadingPlan(planId);

    window.location.href = checkoutUrl;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Subscription Management
        </h2>

        <p className="mt-2 text-gray-600">
          Current Plan:{' '}
          <Badge className="bg-[#1FA8A1]">
            {currentPlan}
          </Badge>
        </p>
      </div>
<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {plans.map((plan) => {
          const isCurrentPlan =
            currentPlan === plan.id;

          const isFreePlan =
            plan.id === 'free';

          const isLoading =
            loadingPlan === plan.id;

          return (
            <Card
              key={plan.id}
              className={
                isCurrentPlan
                  ? 'border-2 border-[#1FA8A1]'
                  : ''
              }
            >
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-2xl font-bold">
                    {plan.name}
                  </div>

                  <div className="mt-2 text-3xl font-bold text-[#1FA8A1]">
                    ${plan.priceMonth}
                    <span className="text-sm text-gray-500">
                      /mo
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <ul className="mb-6 space-y-2">
                  {plan.features.map(
                    (feature, index) => (
                      <li
                        key={`${feature}-${index}`}
                        className="flex items-start text-sm"
                      >
                        <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-[#1FA8A1]" />
                        <span>{feature}</span>
                      </li>
                    )
                  )}
                </ul>

                {isCurrentPlan ? (
                  <Button
                    type="button"
                    className="w-full"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : isFreePlan ? (
                  <Button
                    type="button"
                    className="w-full"
                    variant="outline"
                    disabled
                  >
                    Free Listing
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="w-full bg-[#1FA8A1] hover:bg-[#178d87]"
                    onClick={() =>
                      handleSubscribe(plan.id)
                    }
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Opening Checkout...
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};