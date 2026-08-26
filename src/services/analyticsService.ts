import {
  supabase,
  isSupabaseConfigured,
} from '@/lib/supabase';

import { Analytics } from '@/data/types';

export type EventType =
  | 'view'
  | 'click_phone'
  | 'click_email'
  | 'click_website';

export interface AnalyticsSummary {
  total_views: number;
  total_clicks: number;
  phone_clicks: number;
  email_clicks: number;
  website_clicks: number;
}

const EMPTY_SUMMARY: AnalyticsSummary = {
  total_views: 0,
  total_clicks: 0,
  phone_clicks: 0,
  email_clicks: 0,
  website_clicks: 0,
};

// Track an analytics event
export const trackEvent = async (
  firmId: string,
  eventType: EventType,
  metadata?: {
    referrer?: string;
  }
): Promise<{ error: any }> => {
  if (!isSupabaseConfigured) {
    return {
      error: null,
    };
  }

  const { error } = await supabase
    .from('analytics')
    .insert([
      {
        firm_id: firmId,
        event_type: eventType,
        referrer:
          metadata?.referrer ||
          document.referrer ||
          null,
        user_agent:
          navigator.userAgent ||
          null,
      },
    ]);

  if (error) {
    console.error(
      'Analytics tracking failed:',
      error
    );
  }

  return {
    error,
  };
};

// Get analytics events for a firm
export const getFirmAnalytics = async (
  firmId: string,
  startDate?: string,
  endDate?: string
): Promise<{
  data: Analytics[] | null;
  error: any;
}> => {
  if (!isSupabaseConfigured) {
    return {
      data: [],
      error: null,
    };
  }

  let query = supabase
    .from('analytics')
    .select('*')
    .eq('firm_id', firmId)
    .order('created_at', {
      ascending: false,
    });

  if (startDate) {
    query = query.gte(
      'created_at',
      startDate
    );
  }

  if (endDate) {
    query = query.lte(
      'created_at',
      endDate
    );
  }

  const {
    data,
    error,
  } = await query;

  return {
    data,
    error,
  };
};

// Get analytics summary for dashboard
export const getAnalyticsSummary =
  async (
    firmId: string
  ): Promise<{
    data: AnalyticsSummary;
    error: any;
  }> => {
    if (!isSupabaseConfigured) {
      return {
        data: EMPTY_SUMMARY,
        error: null,
      };
    }

    const {
      data,
      error,
    } = await supabase.rpc(
      'get_firm_analytics_summary',
      {
        p_firm_id: firmId,
      }
    );

    if (error) {
      console.error(
        'Analytics summary failed:',
        error
      );

      return {
        data: EMPTY_SUMMARY,
        error,
      };
    }

    /*
     * RETURNS TABLE RPC functions come back
     * from Supabase as an array.
     * The dashboard expects one summary object.
     */
    const row =
      Array.isArray(data)
        ? data[0]
        : data;

    return {
      data: {
        total_views: Number(
          row?.total_views ?? 0
        ),
        total_clicks: Number(
          row?.total_clicks ?? 0
        ),
        phone_clicks: Number(
          row?.phone_clicks ?? 0
        ),
        email_clicks: Number(
          row?.email_clicks ?? 0
        ),
        website_clicks: Number(
          row?.website_clicks ?? 0
        ),
      },
      error: null,
    };
  };