import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Users, Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { plans } from '@/data/plans';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const Subscription = () => {
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [loading, setLoading] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user?.id)
      .single();
    if (data) {
      setSubscription(data);
      setCurrentPlan(data.plan_type);
    }
  };

  const handleSubscribe = async (plan: typeof plans[0]) => {
    setLoading(plan.id);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planId: plan.id,
          planName: plan.name,
          priceMonth: plan.priceMonth,
          firmId: subscription?.firm_id || 'new',
          userId: user?.id,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/dashboard?canceled=true`
        }
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Subscription Management</h2>
        <p className="text-gray-600 mt-2">
          Current Plan: <Badge className="bg-[#1FA8A1]">{currentPlan}</Badge>
          {subscription?.status && <Badge className="ml-2" variant="outline">{subscription.status}</Badge>}
        </p>
      </div>

      {subscription && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Billing Info</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Next billing: {subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={currentPlan === plan.id ? 'border-[#1FA8A1] border-2' : ''}>
            <CardHeader>
              <CardTitle className="text-center">
                <div className="text-2xl font-bold">{plan.name}</div>
                <div className="text-3xl font-bold text-[#1FA8A1] mt-2">${plan.priceMonth}<span className="text-sm text-gray-500">/mo</span></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.slice(0, 5).map((f, i) => (
                  <li key={i} className="flex items-start text-sm"><Check className="h-4 w-4 text-[#1FA8A1] mr-2 mt-0.5" />{f}</li>
                ))}
              </ul>
              {currentPlan === plan.id ? (
                <Button className="w-full" disabled>Current Plan</Button>
              ) : (
                <Button className="w-full bg-[#1FA8A1] hover:bg-[#1FA8A1]/90" onClick={() => handleSubscribe(plan)} disabled={!!loading}>
                  {loading === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};


