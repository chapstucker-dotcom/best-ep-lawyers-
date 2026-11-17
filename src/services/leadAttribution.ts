/** Session-scoped first-touch attribution for consumer inquiries. */
const KEY = 'epbl:lead-attribution:v1';

type LeadAttribution = {
  sourceUrl: string | null;
  landingPage: string | null;
  referrer: string | null;
  source: string | null;
  medium: string | null;
  campaign: string | null;
};

const safeParam = (value: string | null): string | null =>
  value?.trim().slice(0, 200) || null;

function currentAttribution(): LeadAttribution {
  const params = new URLSearchParams(window.location.search);
  return {
    sourceUrl: window.location.href,
    landingPage: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || null,
    source: safeParam(params.get('utm_source')),
    medium: safeParam(params.get('utm_medium')),
    campaign: safeParam(params.get('utm_campaign')),
  };
}

function storedAttribution(): LeadAttribution | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const entry = value as Record<string, unknown>;
    const field = (key: keyof LeadAttribution): string | null =>
      typeof entry[key] === 'string' ? entry[key] as string : null;
    return {
      sourceUrl: field('sourceUrl'),
      landingPage: field('landingPage'),
      referrer: field('referrer'),
      source: field('source'),
      medium: field('medium'),
      campaign: field('campaign'),
    };
  } catch {
    return null; // Storage may be blocked; submissions still work.
  }
}

/** Called once on initial page load, before the router renders. */
export function initializeLeadAttribution(): void {
  if (typeof window === 'undefined') return;
  if (storedAttribution()) return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(currentAttribution()));
  } catch {
    // Non-essential attribution must never block a consumer inquiry.
  }
}

/** Keep the original landing/campaign and the actual submission URL separately. */
export function getLeadAttribution(): LeadAttribution {
  if (typeof window === 'undefined') {
    return { sourceUrl: null, landingPage: null, referrer: null, source: null, medium: null, campaign: null };
  }
  const initial = storedAttribution() ?? currentAttribution();
  return {
    ...initial,
    sourceUrl: window.location.href,
  };
}
