const META_PIXEL_ID = '1071951739171747';

type MetaPixelFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push: MetaPixelFunction;
};

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
  }
}

let initialized = false;

export function initializeMetaPixel(): void {
  if (typeof window === 'undefined' || initialized) {
    return;
  }

  const existingFbq = window.fbq;

  if (!existingFbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
      } else {
        fbq.queue.push(args);
      }
    } as MetaPixelFunction;

    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];

    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';

    const firstScript = document.getElementsByTagName('script')[0];

    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  window.fbq?.('init', META_PIXEL_ID);
  initialized = true;
}

export function trackMetaPageView(): void {
  initializeMetaPixel();
  window.fbq?.('track', 'PageView');
}

export function trackMetaLead(): void {
  initializeMetaPixel();
  window.fbq?.('track', 'Lead');
}
