'use client';

/* ════════════════════════════════════════════════════════════════════════
   SHOWREEL — homepage curated content reel. Shows a tight set of featured
   pieces (driven by the `featured` flag in the manifest) and links to the full
   /work gallery. Built data-first so it scales to thousands of items without
   touching this component.
   ──────────────────────────────────────────────────────────────────────── */

import { useRef } from 'react';
import Link from 'next/link';
import { getFeatured } from '@/lib/showreel';
import { useRevealAll } from '@/hooks/useScrollReveal';
import { CascadingSlider } from '@/components/showreel/CascadingSlider';
import styles from './Showreel.module.css';

export function Showreel() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealAll(sectionRef);

  const featured = getFeatured(6);
  if (featured.length === 0) return null;

  return (
    <section
      id="work"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="showreel-heading"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="label reveal">Showreel</p>
          <h2 id="showreel-heading" className={`${styles.heading} reveal`} data-delay="0.08">
            Selected work<br />
            <em>across every medium</em>
          </h2>
          <p className={`${styles.subheading} reveal`} data-delay="0.12">
            A glimpse of the content, design, and AI work — hover to preview,
            click to view.
          </p>
        </div>

        <div className="reveal" data-delay="0.16">
          <CascadingSlider items={featured} />
        </div>

        <div className={`${styles.footer} reveal`} data-delay="0.4">
          <Link href="/work" className="btn-outline">
            <span>View all work</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
