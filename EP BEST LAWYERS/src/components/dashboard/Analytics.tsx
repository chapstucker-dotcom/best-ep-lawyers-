import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Phone, Mail, Globe, TrendingUp, Loader2 } from 'lucide-react';
import { getFirmByUserId } from '@/services/firmService';
import { getAnalyticsSummary, getFirmAnalytics } from '@/services/analyticsService';
import { useToast } from '@/hooks/use-toast';

export const Analytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total_views: 0,
    phone_clicks: 0,
    email_clicks: 0,
    website_clicks: 0,
    total_clicks: 0
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return;

      try {
        // Get firm ID
        const { data: firm, error: firmError } = await getFirmByUserId(user.id);
        if (firmError || !firm) {
          toast({
            title: 'Error',
            description: 'Please create a firm profile first',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }

        // Get analytics summary
        const { data, error } = await getAnalyticsSummary(firm.id);
        if (error) {
          console.error('Analytics error:', error);
        } else if (data) {
          setSummary(data);
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user, toast]);

  const stats = [
    {
      label: 'Profile Views',
      value: summary.total_views.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Phone Clicks',
      value: summary.phone_clicks.toLocaleString(),
      icon: Phone,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Email Clicks',
      value: summary.email_clicks.toLocaleString(),
      icon: Mail,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Website Clicks',
      value: summary.website_clicks.toLocaleString(),
      icon: Globe,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Real-time data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Interactions</span>
              <span className="text-2xl font-bold">{summary.total_clicks.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{
                  width: `${summary.total_views > 0 ? (summary.total_clicks / summary.total_views) * 100 : 0}%`
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {summary.total_views > 0
                ? `${((summary.total_clicks / summary.total_views) * 100).toFixed(1)}% engagement rate`
                : 'No data yet'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
