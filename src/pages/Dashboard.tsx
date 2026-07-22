import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { ProfileEditor } from '@/components/dashboard/ProfileEditor';
import { Analytics } from '@/components/dashboard/Analytics';
import { Subscription } from '@/components/dashboard/Subscription';
import { AttorneyManagement } from '@/components/dashboard/AttorneyManagement';
import { ReviewManagement } from '@/components/dashboard/ReviewManagement';

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { plans } from '@/data/plans';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [firmId, setFirmId] = useState('');
  const [currentPlan, setCurrentPlan] = useState('free');
  const [attorneyCount, setAttorneyCount] = useState(0);
  const [isLoadingFirm, setIsLoadingFirm] = useState(true);
  const [firmLoadError, setFirmLoadError] = useState('');

  const { user, isConfigured } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: 'Payment Successful!',
        description: 'Your subscription is now active.',
      });

      setActiveTab('subscription');
    }

    if (searchParams.get('canceled') === 'true') {
      toast({
        title: 'Payment Canceled',
        description: 'Your subscription was not changed.',
        variant: 'destructive',
      });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    const loadFirmData = async () => {
      setIsLoadingFirm(true);
      setFirmLoadError('');
      setFirmId('');

      if (!user) {
        console.log('No authenticated user found.');
        setFirmLoadError('No authenticated user was found.');
        setIsLoadingFirm(false);
        return;
      }

      console.log('Logged-in user ID:', user.id);
      console.log('Logged-in user email:', user.email);

      if (!isSupabaseConfigured) {
        console.log('Supabase is not configured.');

        setFirmLoadError('Supabase is not configured.');
        setIsLoadingFirm(false);
        return;
      }

      const { data, error } = await supabase
        .from('firms')
        .select('id, name, plan, plan_key, user_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      console.log('Firm query result:', data);
      console.log('Firm query error:', error);

      if (error) {
        setFirmLoadError(error.message);

        toast({
          title: 'Could not load firm profile',
          description: error.message,
          variant: 'destructive',
        });

        setIsLoadingFirm(false);
        return;
      }

      if (!data) {
        setFirmLoadError(
          `No firm profile is connected to this account. Logged-in user ID: ${user.id}`
        );

        toast({
          title: 'No firm profile found',
          description:
            'This account is not connected to a firm record.',
          variant: 'destructive',
        });

        setIsLoadingFirm(false);
        return;
      }

      setFirmId(String(data.id));

      const databasePlan =
        data.plan_key || data.plan || 'free';

      const normalizedPlan =
        databasePlan === 'basic'
          ? 'free'
          : databasePlan;

      console.log('Firm ID:', data.id);
      console.log('Firm name:', data.name);
      console.log('Database plan:', databasePlan);
      console.log('Normalized plan:', normalizedPlan);

      setCurrentPlan(normalizedPlan);
      setIsLoadingFirm(false);
    };

    void loadFirmData();
  }, [user, toast]);

  const planData = plans.find(
    (plan) => plan.id === currentPlan
  );

  const planLimit =
    planData?.attorneyProfileLimit ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="container mx-auto px-4 py-8">
        {!isConfigured && (
          <Alert
            variant="destructive"
            className="mb-6"
          >
            <AlertTriangle className="h-4 w-4" />

            <AlertTitle>Demo Mode</AlertTitle>

            <AlertDescription>
              Supabase is not configured. The dashboard is
              running in demo mode with limited functionality.
            </AlertDescription>
          </Alert>
        )}

        {firmLoadError && (
          <Alert
            variant="destructive"
            className="mb-6"
          >
            <AlertTriangle className="h-4 w-4" />

            <AlertTitle>Firm Profile Error</AlertTitle>

            <AlertDescription>
              {firmLoadError}
            </AlertDescription>
          </Alert>
        )}

        {activeTab === 'profile' && (
          <ProfileEditor />
        )}

        {activeTab === 'attorneys' && (
          <>
            {isLoadingFirm && (
              <div className="rounded-lg border bg-white p-6">
                Loading your firm profile...
              </div>
            )}

            {!isLoadingFirm &&
              firmId &&
              !firmLoadError && (
                <AttorneyManagement
                  firmId={firmId}
                  planLimit={planLimit}
                  currentCount={attorneyCount}
                  onCountChange={setAttorneyCount}
                />
              )}

            {!isLoadingFirm &&
              !firmId &&
              !firmLoadError && (
                <div className="rounded-lg border bg-white p-6">
                  No firm profile was found for this account.
                </div>
              )}
          </>
        )}

        {activeTab === 'reviews' && (
          <ReviewManagement />
        )}

        {activeTab === 'analytics' && (
          <Analytics />
        )}

        {activeTab === 'subscription' && (
          <Subscription />
        )}
      </div>
    </div>
  );
}