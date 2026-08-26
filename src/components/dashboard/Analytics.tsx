import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Activity,
  BarChart3,
  Eye,
  Globe,
  Loader2,
  Mail,
  MousePointerClick,
  Phone,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';

import { getFirmByUserId } from '@/services/firmService';
import { getAnalyticsSummary } from '@/services/analyticsService';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsSummary {
  total_views: number;
  phone_clicks: number;
  email_clicks: number;
  website_clicks: number;
  total_clicks: number;
}

const EMPTY_SUMMARY: AnalyticsSummary = {
  total_views: 0,
  phone_clicks: 0,
  email_clicks: 0,
  website_clicks: 0,
  total_clicks: 0,
};

export const Analytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [firmName, setFirmName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [summary, setSummary] =
    useState<AnalyticsSummary>(EMPTY_SUMMARY);

  const loadAnalytics = useCallback(
    async (showRefreshMessage = false) => {
      if (!user) {
        setLoading(false);
        return;
      }

      if (showRefreshMessage) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMessage('');

      try {
        const {
          data: firm,
          error: firmError,
        } = await getFirmByUserId(user.id);

        if (firmError || !firm) {
          const message =
            'Create your firm profile before viewing analytics.';

          setErrorMessage(message);
          setSummary(EMPTY_SUMMARY);

          toast({
            title: 'Firm profile required',
            description: message,
            variant: 'destructive',
          });

          return;
        }

        setFirmName(firm.name ?? '');

        const {
          data,
          error,
        } = await getAnalyticsSummary(firm.id);

        if (error) {
          throw error;
        }

        setSummary({
          total_views:
            Number(data?.total_views) || 0,
          phone_clicks:
            Number(data?.phone_clicks) || 0,
          email_clicks:
            Number(data?.email_clicks) || 0,
          website_clicks:
            Number(data?.website_clicks) || 0,
          total_clicks:
            Number(data?.total_clicks) || 0,
        });

        if (showRefreshMessage) {
          toast({
            title: 'Analytics refreshed',
            description:
              'Your latest profile activity is now displayed.',
          });
        }
      } catch (error) {
        console.error(
          'Failed to load analytics:',
          error
        );

        const message =
          error instanceof Error
            ? error.message
            : 'An unexpected analytics error occurred.';

        setErrorMessage(message);

        toast({
          title: 'Failed to load analytics',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [toast, user]
  );

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const actionRate = useMemo(() => {
    if (summary.total_views === 0) {
      return 0;
    }

    return Math.min(
      (summary.total_clicks /
        summary.total_views) *
        100,
      100
    );
  }, [
    summary.total_clicks,
    summary.total_views,
  ]);

  const contactClicks =
    summary.phone_clicks +
    summary.email_clicks;

  const hasActivity =
    summary.total_views > 0 ||
    summary.total_clicks > 0;

  const stats = [
    {
      label: 'Profile Views',
      value: summary.total_views,
      description:
        'Times visitors opened your firm profile',
      icon: Eye,
    },
    {
      label: 'Phone Clicks',
      value: summary.phone_clicks,
      description:
        'Visitors who clicked to call your firm',
      icon: Phone,
    },
    {
      label: 'Email Clicks',
      value: summary.email_clicks,
      description:
        'Visitors who clicked your email button',
      icon: Mail,
    },
    {
      label: 'Website Clicks',
      value: summary.website_clicks,
      description:
        'Visitors sent to your firm website',
      icon: Globe,
    },
  ];

  const interactionRows = [
    {
      label: 'Phone',
      value: summary.phone_clicks,
      icon: Phone,
    },
    {
      label: 'Email',
      value: summary.email_clicks,
      icon: Mail,
    },
    {
      label: 'Website',
      value: summary.website_clicks,
      icon: Globe,
    },
  ];

  const highestInteraction = Math.max(
    summary.phone_clicks,
    summary.email_clicks,
    summary.website_clicks,
    1
  );

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#1FA8A1]" />

          <p className="mt-3 text-sm text-gray-500">
            Loading firm analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-[#0F2A43] to-[#176B78] text-white">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />

                <CardTitle className="text-2xl text-white">
                  Analytics Dashboard
                </CardTitle>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-white/80">
                Track how visitors discover and
                interact with{' '}
                {firmName
                  ? firmName
                  : 'your firm profile'}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border border-white/20 bg-white/10 text-white">
                <Activity className="mr-1.5 h-3.5 w-3.5" />
                Live activity
              </Badge>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  void loadAnalytics(true)
                }
                disabled={refreshing}
                className="border-white/30 bg-white text-[#0F2A43] hover:bg-white/90"
              >
                {refreshing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}

                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.label}
              className="transition hover:border-[#1FA8A1]/40 hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-[#0F2A43]">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1FA8A1]/10">
                    <Icon className="h-5 w-5 text-[#1FA8A1]" />
                  </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-gray-500">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>
                  Visitor Actions
                </CardTitle>

                <p className="mt-1 text-sm text-gray-500">
                  How often profile views generate a phone, email, or website action.
                </p>
              </div>

              <Badge variant="secondary">
                {actionRate.toFixed(1)}%
                action rate
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Actions per profile view
                </span>

                <span className="font-semibold text-[#0F2A43]">
                  {summary.total_clicks.toLocaleString()}{' '}
                  interactions
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[#1FA8A1] transition-all duration-500"
                  style={{
                    width: `${actionRate}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-5">
              {interactionRows.map((row) => {
                const Icon = row.icon;

                const width =
                  (row.value /
                    highestInteraction) *
                  100;

                return (
                  <div key={row.label}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[#1FA8A1]" />

                        <span className="text-sm font-medium text-gray-700">
                          {row.label} clicks
                        </span>
                      </div>

                      <span className="text-sm font-bold text-[#0F2A43]">
                        {row.value.toLocaleString()}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#0F2A43] transition-all"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Performance Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MousePointerClick className="h-4 w-4 text-[#1FA8A1]" />
                Total Interactions
              </div>

              <p className="mt-2 text-2xl font-bold text-[#0F2A43]">
                {summary.total_clicks.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="h-4 w-4 text-[#1FA8A1]" />
                Direct Contact Clicks
              </div>

              <p className="mt-2 text-2xl font-bold text-[#0F2A43]">
                {contactClicks.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp className="h-4 w-4 text-[#1FA8A1]" />
                Action Rate
              </div>

              <p className="mt-2 text-2xl font-bold text-[#0F2A43]">
                {actionRate.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {!hasActivity && !errorMessage && (
        <Card>
          <CardContent className="px-6 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1FA8A1]/10">
              <TrendingUp className="h-8 w-8 text-[#1FA8A1]" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#0F2A43]">
              Analytics will appear here
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">
              Your dashboard will begin recording
              profile views and contact clicks as
              visitors interact with your public
              firm listing.
            </p>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-gray-500">
        Analytics reflect button clicks recorded through your public firm listing. A click shows visitor intent; it does not confirm a completed call, email, website visit, consultation, or new client.
      </p>
    </div>
  );
};