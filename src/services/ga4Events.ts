/**
 * Record a successful consultation submission in GA4.
 *
 * No names, contact details, legal descriptions, or lead IDs
 * are transmitted as event parameters.
 *
 * Analytics must never interfere with an accepted inquiry.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackGa4Lead(): void {
  if (typeof window === "undefined") return;

  try {
    window.gtag?.("event", "generate_lead");
  } catch {
    // An unavailable analytics service must not affect lead submission.
  }
}
