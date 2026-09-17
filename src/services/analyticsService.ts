import {
  supabase,
  isSupabaseConfigured,
} from "@/lib/supabase";

import type { Analytics } from "@/data/types";
import type { MarketKey } from "@/data/platformModel";

/**
 * Legacy event names stored by the existing analytics
 * schema and consumed by current dashboard reporting.
 */
export type LegacyEventType =
  | "view"
  | "click_phone"
  | "click_email"
  | "click_website";

/**
 * Canonical application-level attribution actions.
 *
 * These distinguish discovery, profile engagement,
 * contact actions, and an actual consultation conversion.
 */
export type AttributionAction =
  | "listing_impression"
  | "profile_view"
  | "click_phone"
  | "click_email"
  | "click_website"
  | "consultation_submit";

export type EventType =
  | LegacyEventType
  | AttributionAction;

export interface AttributionContext {
  /**
   * Canonical legal market key from platformModel.
   * Example: "personal-injury".
   */
  market?: MarketKey | null;

  /**
   * Canonical PracticeArea.slug value.
   * Example: "car-accidents".
   */
  specialty?: string | null;

  /**
   * Page/path where the event occurred.
   * Example: "/el-paso-car-accident-lawyers".
   */
  page?: string | null;

  /**
   * Original referring URL when available.
   */
  referrer?: string | null;

  /**
   * Traffic-source dimensions.
   */
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;

  /**
   * Reserved for trusted lead/event correlation.
   *
   * Public browser attribution writes intentionally do not
   * persist a lead ID. The attribution_events public INSERT
   * policy requires lead_id to remain null.
   */
  leadId?: string | null;
}

export interface AttributionEvent {
  firmId: string;
  action: AttributionAction;
  market: MarketKey | null;
  specialty: string | null;
  page: string | null;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  referrer: string | null;
  leadId: string | null;
  occurredAt: string;
}

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

const ATTRIBUTION_ACTIONS =
  new Set<AttributionAction>([
    "listing_impression",
    "profile_view",
    "click_phone",
    "click_email",
    "click_website",
    "consultation_submit",
  ]);

function isAttributionAction(
  eventType: EventType
): eventType is AttributionAction {
  return ATTRIBUTION_ACTIONS.has(
    eventType as AttributionAction
  );
}

function getBrowserReferrer(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  return document.referrer || null;
}

function getBrowserUserAgent(): string | null {
  if (typeof navigator === "undefined") {
    return null;
  }

  return navigator.userAgent || null;
}

function getBrowserPage(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    `${window.location.pathname}${window.location.search}` ||
    null
  );
}

function getSearchParams(): URLSearchParams | null {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search);
}

function getTrafficValue(
  explicitValue: string | null | undefined,
  parameterName: string
): string | null {
  if (explicitValue !== undefined) {
    return explicitValue || null;
  }

  return (
    getSearchParams()?.get(parameterName) ||
    null
  );
}

function normalizeContext(
  context?: AttributionContext
): Omit<
  AttributionEvent,
  "firmId" | "action"
> {
  return {
    market: context?.market ?? null,
    specialty: context?.specialty ?? null,
    page:
      context?.page ??
      getBrowserPage(),
    source: getTrafficValue(
      context?.source,
      "utm_source"
    ),
    medium: getTrafficValue(
      context?.medium,
      "utm_medium"
    ),
    campaign: getTrafficValue(
      context?.campaign,
      "utm_campaign"
    ),
    referrer:
      context?.referrer ??
      getBrowserReferrer(),
    leadId: context?.leadId ?? null,
    occurredAt: new Date().toISOString(),
  };
}

export function createAttributionEvent(
  firmId: string,
  action: AttributionAction,
  context?: AttributionContext
): AttributionEvent {
  return {
    firmId,
    action,
    ...normalizeContext(context),
  };
}

/**
 * Map canonical attribution actions onto the legacy
 * analytics schema where a compatible event exists.
 *
 * profile_view continues to dual-write as legacy "view"
 * so existing dashboard reporting remains compatible.
 *
 * listing_impression and consultation_submit have no
 * equivalent legacy representation and therefore write
 * only to attribution_events.
 *
 * A direct legacy "view" remains legacy-only. Existing
 * callers use it for navigation intent rather than a
 * successfully loaded profile, so it must not become a
 * canonical profile_view.
 */
function getLegacyEventType(
  action: EventType
): LegacyEventType | null {
  if (action === "profile_view") {
    return "view";
  }

  if (action === "listing_impression") {
    return null;
  }

  if (action === "consultation_submit") {
    return null;
  }

  return action;
}

/**
 * Track an analytics/attribution event.
 *
 * Canonical actions are persisted to attribution_events.
 * Compatible actions are also written to the legacy
 * analytics table so current dashboard reporting continues
 * to work during the reporting transition.
 *
 * Public browser writes never persist lead_id. Correlating
 * a stored lead to an attribution event requires a trusted
 * server-side path or RPC with appropriate authorization.
 */
export const trackEvent = async (
  firmId: string,
  eventType: EventType,
  context?: AttributionContext
): Promise<{ error: unknown }> => {
  if (
    !isSupabaseConfigured ||
    !supabase
  ) {
    return {
      error: null,
    };
  }

  const normalized =
    normalizeContext(context);

  let attributionError: unknown = null;
  let legacyError: unknown = null;

  if (isAttributionAction(eventType)) {
    const { error } = await supabase
      .from("attribution_events")
      .insert([
        {
          firm_id: firmId,
          action: eventType,
          market: normalized.market,
          specialty: normalized.specialty,
          page: normalized.page,
          source: normalized.source,
          medium: normalized.medium,
          campaign: normalized.campaign,
          referrer: normalized.referrer,

          /*
           * Required by attribution_events_public_insert.
           * Browser clients may not attach arbitrary leads
           * to attribution events.
           */
          lead_id: null,

          occurred_at: normalized.occurredAt,
        },
      ]);

    attributionError = error;

    if (error) {
      console.error(
        "Attribution tracking failed:",
        error
      );
    }
  }

  const legacyEventType =
    getLegacyEventType(eventType);

  if (legacyEventType) {
    const { error } = await supabase
      .from("analytics")
      .insert([
        {
          firm_id: firmId,
          event_type: legacyEventType,
          referrer: normalized.referrer,
          user_agent:
            getBrowserUserAgent(),
        },
      ]);

    legacyError = error;

    if (error) {
      console.error(
        "Legacy analytics tracking failed:",
        error
      );
    }
  }

  return {
    error:
      attributionError ??
      legacyError ??
      null,
  };
};

/**
 * Get analytics events for a firm.
 *
 * This remains on the legacy Analytics shape while the
 * current dashboard continues to use legacy reporting.
 */
export const getFirmAnalytics = async (
  firmId: string,
  startDate?: string,
  endDate?: string
): Promise<{
  data: Analytics[] | null;
  error: unknown;
}> => {
  if (
    !isSupabaseConfigured ||
    !supabase
  ) {
    return {
      data: [],
      error: null,
    };
  }

  let query = supabase
    .from("analytics")
    .select("*")
    .eq("firm_id", firmId)
    .order("created_at", {
      ascending: false,
    });

  if (startDate) {
    query = query.gte(
      "created_at",
      startDate
    );
  }

  if (endDate) {
    query = query.lte(
      "created_at",
      endDate
    );
  }

  const {
    data,
    error,
  } = await query;

  return {
    data: data as Analytics[] | null,
    error,
  };
};

/**
 * Get the existing dashboard analytics summary.
 *
 * Keep this RPC contract unchanged until the attribution
 * reporting/dashboard upgrade is performed separately.
 */
export const getAnalyticsSummary =
  async (
    firmId: string
  ): Promise<{
    data: AnalyticsSummary;
    error: unknown;
  }> => {
    if (
      !isSupabaseConfigured ||
      !supabase
    ) {
      return {
        data: EMPTY_SUMMARY,
        error: null,
      };
    }

    const {
      data,
      error,
    } = await supabase.rpc(
      "get_firm_analytics_summary",
      {
        p_firm_id: firmId,
      }
    );

    if (error) {
      console.error(
        "Analytics summary failed:",
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