import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Analytics } from '@/data/types';

export type EventType = 'view' | 'click_phone' | 'click_email' | 'click_website';

// Track an analytics event
export const trackEvent = async (
  firmId: string,
  eventType: EventType,
  metadata?: { referrer?: string }
): Promise<{ error: any }> => {
  if (!isSupabaseConfigured) {
    return { error: null }; // Silently skip in demo mode
  }
  
  const { error } = await supabase
    .from('analytics')
    .insert([{
      firm_id: firmId,
      event_type: eventType,
      referrer: metadata?.referrer || document.referrer,
      user_agent: navigator.userAgent
    }]);

  return { error };
};

// Get analytics for a firm
export const getFirmAnalytics = async (
  firmId: string,
  startDate?: string,
  endDate?: string
): Promise<{ data: Analytics[] | null; error: any }> => {
  if (!isSupabaseConfigured) {
    return { data: [], error: null };
  }
  
  let query = supabase
    .from('analytics')
    .select('*')
    .eq('firm_id', firmId)
    .order('created_at', { ascending: false });

  if (startDate) {
    query = query.gte('created_at', startDate);
  }
  if (endDate) {
    query = query.lte('created_at', endDate);
  }

  const { data, error } = await query;
  return { data, error };
};

// Get analytics summary
export const getAnalyticsSummary = async (firmId: string): Promise<{
  data: {
    total_views: number;
    total_clicks: number;
    phone_clicks: number;
    email_clicks: number;
    website_clicks: number;
  } | null;
  error: any;
}> => {
  if (!isSupabaseConfigured) {
    return { 
      data: {
        total_views: 0,
        total_clicks: 0,
        phone_clicks: 0,
        email_clicks: 0,
        website_clicks: 0
      }, 
      error: null 
    };
  }
  
  const { data, error } = await supabase.rpc('get_firm_analytics_summary', {
    p_firm_id: firmId
  });

  return { data, error };
};
