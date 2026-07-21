import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ExperienceProvider } from '@/components/canvas/ExperienceProvider';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { IntroVideo } from '@/components/loader/IntroVideo';
import { ContactModal } from '@/components/contact/ContactModal';
import { QualifierModal } from '@/components/funnel/QualifierModal';
import { Lightbox } from '@/components/showreel/Lightbox';
import { Analytics } from '@/components/analytics/Analytics';

// Runs before first paint: lock scroll synchronously so there is no flash or
// scroll jump before React hydrates the loader. The loader removes the class
// once it hands off to the page (and <noscript> below covers JS-disabled).
const NO_FLASH_SCRIPT = `try{document.documentElement.classList.add('loader-active')}catch(e){}`;

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: {
    default: 'Khanstruct — Complex problems. Working systems.',
    template: '%s | Khanstruct',
  },
  description:
    'Khanstruct is a studio that turns complex business, data, and AI problems into working systems — from strategy and design through implementation.',
  keywords: [
    'software studio',
    'AI implementation',
    'data platforms',
    'product development',
    'system design',
    'automation',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Khanstruct',
    title: 'Khanstruct — Complex problems. Working systems.',
    description:
      'A studio that turns complex business, data, and AI problems into working systems people can use.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khanstruct — Complex problems. Working systems.',
    description:
      'A studio that turns complex business, data, and AI problems into working systems people can use.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#d7ff3f" />
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
        <noscript>
          {/* Without JS the loader can't tear itself down — hide it and unlock. */}
          <style>{`#site-loader{display:none!important}html.loader-active{overflow:auto!important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="grain" aria-hidden="true" />
        <CustomCursor />
        <IntroVideo />
        <ExperienceProvider>
          <div id="main-content" className="page-content" tabIndex={-1}>
            {children}
          </div>
        </ExperienceProvider>
        <ContactModal />
        <QualifierModal />
        <Lightbox />
        <Analytics />
      </body>
    </html>
  );
}
