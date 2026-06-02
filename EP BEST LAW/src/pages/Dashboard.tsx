import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [firmId, setFirmId] = useState<string>('');
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [attorneyCount, setAttorneyCount] = useState(0);
  const { user, isConfigured } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({ title: 'Payment Successful!', description: 'Your subscription is now active.' });
      setActiveTab('subscription');
    }
    if (searchParams.get('canceled') === 'true') {
      toast({ title: 'Payment Canceled', description: 'Your subscription was not changed.', variant: 'destructive' });
    }
  }, [searchParams]);

  useEffect(() => {
    const loadFirmData = async () => {
      if (!user || !isSupabaseConfigured) return;
      const { data } = await supabase.from('firms').select('id').eq('user_id', user.id).single();
      if (data) setFirmId(data.id);
    };
    loadFirmData();
  }, [user]);

  const planData = plans.find(p => p.id === currentPlan);
  const planLimit = planData?.attorneyProfileLimit || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="container mx-auto px-4 py-8">
        {!isConfigured && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Demo Mode</AlertTitle>
            <AlertDescription>
              Supabase is not configured. The dashboard is running in demo mode with limited functionality.
              Please contact the administrator to set up the database connection.
            </AlertDescription>
          </Alert>
        )}
        {activeTab === 'profile' && <ProfileEditor />}
        {activeTab === 'attorneys' && firmId && (
          <AttorneyManagement firmId={firmId} planLimit={planLimit} currentCount={attorneyCount} onCountChange={setAttorneyCount} />
        )}
        {activeTab === 'reviews' && <ReviewManagement />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'subscription' && <Subscription />}
      </div>
    </div>
  );
}


