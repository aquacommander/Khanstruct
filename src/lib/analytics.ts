/* ════════════════════════════════════════════════════════════════════════
   ANALYTICS — a thin wrapper over Google Analytics 4 (gtag).

   The GA script is injected by <Analytics/> only when NEXT_PUBLIC_GA_ID is set,
   so local/dev builds stay clean. track() is a no-op when gtag is absent, which
   means call sites never have to guard. This is how Zain "sees who's visiting"
   and — more importantly — where leads drop off in the funnel.
   ──────────────────────────────────────────────────────────────────────── */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Fire a GA4 event. Safe to call anywhere — no-ops without gtag. */
export function track(event: string, params: GtagParams = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
}

/** Manually record a page_view (used on client-side route changes). */
export function trackPageView(path: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function' || !GA_ID) return;
  window.gtag('config', GA_ID, { page_path: path });
}
