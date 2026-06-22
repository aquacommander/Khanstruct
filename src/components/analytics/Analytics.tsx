'use client';

/* ════════════════════════════════════════════════════════════════════════
   ANALYTICS — Google Analytics 4 (gtag.js) loader.

   Renders nothing unless NEXT_PUBLIC_GA_ID is set, so local/dev builds stay
   clean and no script loads without a real property. Loaded afterInteractive
   so it never blocks first paint. The track() helper in lib/analytics.ts uses
   the gtag this installs to record funnel + gallery events.
   ──────────────────────────────────────────────────────────────────────── */

import Script from 'next/script';
import { GA_ID } from '@/lib/analytics';

export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
