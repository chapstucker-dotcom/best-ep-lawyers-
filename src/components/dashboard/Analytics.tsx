import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  Send,
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
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { InquiryPerformance } from './FirmInquiries';

interface AnalyticsSummary {
  listing_impressions: number;
  total_views: number;
  phone_clicks: number;
  email_clicks: number;
  website_clicks: number;
  total_clicks: number;
  consultation_submissions: number;
}

const EMPTY_SUMMARY: AnalyticsSummary = {
  listing_impressions: 0,
  total_views: 0,
  phone_clicks: 0,
  email_clicks: 0,
  website_clicks: 0,
  total_clicks: 0,
  consultation_submissions: 0,
};

type Period = '7' | '30' | '90' | 'all' | 'custom';
type DateRange = { start: string | null; end: string | null };

function elPasoToday(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const part = (type: string) => parts.find(item => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function presetRange(days: number): DateRange {
  const end = elPasoToday();
  const date = new Date(end + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() - days + 1);
  return { start: date.toISOString().slice(0, 10), end };
}

export const Analytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [firmName, setFirmName] = useState('');
  const [inquiryFirm, setInquiryFirm] = useState<{ id: string; ownerId: string } | null>(null);
  const [inquiryRevision, setInquiryRevision] = useState(0);
  const [period, setPeriod] = useState<Period>('all');
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [customStart, setCustomStart] = useState(() => presetRange(30).start ?? '');
  const [customEnd, setCustomEnd] = useState(() => elPasoToday());
  const requestId = useRef(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [summary, setSummary] =
    useState<AnalyticsSummary>(EMPTY_SUMMARY);

  const loadAnalytics = useCallback(
    async (showRefreshMessage = false) => {
      const request = ++requestId.current;
      if (!user) {
        setInquiryFirm(null);
        setLoading(false);
        return;
      }

      if (showRefreshMessage) {
        setRefreshing(true);
        setInquiryRevision(value => value + 1);
      } else {
        setLoading(true);
      }

      setErrorMessage('');

      try {
        const {
          data: firm,
          error: firmError,
        } = await getFirmByUserId(user.id);
        if (request !== requestId.current) return;

        if (firmError || !firm) {
          setInquiryFirm(null);
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
        setInquiryFirm({ id: firm.id, ownerId: user.id });

        if (!supabase) throw new Error('Analytics unavailable.');
        const { data: result, error } = await supabase.rpc('get_owned_firm_attribution_period', {
          p_firm_id: firm.id, p_start: range.start, p_end: range.end,
        });
        if (request !== requestId.current) return;
        if (error || !Array.isArray(result) || result.length !== 1) throw new Error('Analytics unavailable.');
        const data = result[0] as AnalyticsSummary;
        if (Object.keys(EMPTY_SUMMARY).some(key => !Number.isSafeInteger(data[key as keyof AnalyticsSummary]) || data[key as keyof AnalyticsSummary] < 0)) throw new Error('Invalid analytics summary.');

        setSummary({
          listing_impressions:
            Number(data?.listing_impressions) || 0,
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
          consultation_submissions:
            Number(data?.consultation_submissions) || 0,
        });

        if (showRefreshMessage) {
          toast({
            title: 'Analytics refreshed',
            description:
              'Your latest profile activity is now displayed.',
          });
        }
      } catch (error) {
        if (request !== requestId.current) return;
        setSummary(EMPTY_SUMMARY);
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
        if (request === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [toast, user, range.start, range.end]
  );

  useEffect(() => {
    void loadAnalytics();
    return () => { requestId.current += 1; };
  }, [loadAnalytics]);

  function choosePeriod(next: Period) {
    setPeriod(next);
    if (next === 'all') setRange({ start: null, end: null });
    else if (next !== 'custom') setRange(presetRange(Number(next)));
  }

  const actionsPer100Views = useMemo(() => {
    if (summary.total_views === 0) {
      return 0;
    }

    return (
      (summary.total_clicks /
        summary.total_views) *
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
    summary.listing_impressions > 0 ||
    summary.total_views > 0 ||
    summary.total_clicks > 0 ||
    summary.consultation_submissions > 0;

  const stats = [
    {
      label: 'Listing Impressions',
      value: summary.listing_impressions,
      description: 'Times your firm appeared in a matching directory',
      icon: BarChart3,
    },
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
        'Recorded clicks to call your firm',
      icon: Phone,
    },
    {
      label: 'Email Clicks',
      value: summary.email_clicks,
      description:
        'Recorded clicks on your email button',
      icon: Mail,
    },
    {
      label: 'Website Clicks',
      value: summary.website_clicks,
      description:
        'Recorded clicks to visit your firm website',
      icon: Globe,
    },
    {
      label: 'Attributed Consultation Submissions',
      value: summary.consultation_submissions,
      description: 'Recorded consultation submission events; see authorized inquiries below',
      icon: Send,
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
                  Firm Performance Dashboard
                </CardTitle>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-white/80">
                Track recorded visibility, engagement and
                inquiry outcomes for{' '}
                {firmName
                  ? firmName
                  : 'your firm profile'}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border border-white/20 bg-white/10 text-white">
                <Activity className="mr-1.5 h-3.5 w-3.5" />
                Recorded activity
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

      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="font-semibold text-[#0F2A43]">Reporting period</h2>
          <div className="flex flex-wrap gap-2">
            {([
              ['7', 'Last 7 days'], ['30', 'Last 30 days'], ['90', 'Last 90 days'],
              ['all', 'All time'], ['custom', 'Custom range'],
            ] as const).map(([value, label]) => (
              <Button key={value} type="button" variant={period === value ? 'default' : 'outline'}
                aria-pressed={period === value} disabled={refreshing} onClick={() => choosePeriod(value)}>{label}</Button>
            ))}
          </div>
          {period === 'custom' && (
            <div className="flex flex-wrap items-end gap-3">
              <label className="text-sm font-medium">From
                <input type="date" value={customStart} max={customEnd || elPasoToday()}
                  onChange={event => setCustomStart(event.target.value)} className="mt-1 block rounded-md border p-2" />
              </label>
              <label className="text-sm font-medium">To
                <input type="date" value={customEnd} min={customStart} max={elPasoToday()}
                  onChange={event => setCustomEnd(event.target.value)} className="mt-1 block rounded-md border p-2" />
              </label>
              <Button type="button" disabled={refreshing || !customStart || !customEnd || customStart > customEnd || customEnd > elPasoToday()}
                onClick={() => setRange({ start: customStart, end: customEnd })}>Apply dates</Button>
            </div>
          )}
          <p className="text-sm text-gray-600">Showing: {range.start && range.end ? `${range.start} through ${range.end}` : 'All time'} · El Paso local time. The end date is inclusive.</p>
          <p className="text-xs text-gray-500">Engagement uses event dates. Inquiry outcomes use inquiries received in this period and reflect their latest recorded status.</p>
        </CardContent>
      </Card>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h2 className="text-xl font-bold text-[#0F2A43]">Visibility &amp; engagement</h2>
        <p className="mt-1 text-sm text-gray-600">Recorded directory and profile events. Counts may include repeat actions and are not unique visitors.</p>
      </div>
      {!errorMessage && <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
      </section>}

      {user && inquiryFirm?.ownerId === user.id && (
        <InquiryPerformance key={user.id + ':' + inquiryFirm.id}
          firmId={inquiryFirm.id} revision={inquiryRevision} start={range.start} end={range.end} />
      )}

      <Card className="border-teal-200 bg-teal-50/50">
        <CardHeader>
          <CardTitle className="text-lg text-[#0F2A43]">Understanding your advertising performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700">
          <p>Visibility shows how often your listing was seen. Engagement shows recorded actions visitors took. Authorized inquiries and firm-reported retention outcomes measure a separate part of the experience.</p>
          <p>Attribution events and inquiry assignments are different records and may not match one-for-one. Do not add them together. Recorded conversions are not verified revenue, and financial return on investment is not calculated without actual costs and revenue.</p>
        </CardContent>
      </Card>

      {!errorMessage && <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>
                  Visitor Actions
                </CardTitle>

                <p className="mt-1 text-sm text-gray-500">
                  How often profile visitors take
                  a direct action.
                </p>
              </div>

              <Badge variant="secondary">
                {actionsPer100Views.toFixed(0)}
                actions / 100 views
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
                    width: `${Math.min(actionsPer100Views, 100)}%`,
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
                Actions per 100 Views
              </div>

              <p className="mt-2 text-2xl font-bold text-[#0F2A43]">
                {actionsPer100Views.toFixed(0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>}

      {!hasActivity && !errorMessage && (
        <Card>
          <CardContent className="px-6 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1FA8A1]/10">
              <TrendingUp className="h-8 w-8 text-[#1FA8A1]" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#0F2A43]">
              No visibility or engagement activity yet
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">
              Your dashboard will begin recording
              listing impressions, profile views,
              contact actions, and consultation
              submissions as visitors interact with
              your public firm listing.
            </p>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-gray-500">
        Analytics reflect activity recorded through your
        public firm listing. Clicks show visitor actions
        and do not confirm completed calls, emails,
        consultations, or new clients. Consultation
        submissions indicate a successfully stored
        consultation request and do not confirm
        representation or a new client.
      </p>
    </div>
  );
};
