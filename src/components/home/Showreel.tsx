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
import { WorkCard } from '@/components/showreel/WorkCard';
import styles from './Showreel.module.css';

export function Showreel() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealAll(sectionRef);

  const featured = getFeatured(8);
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

        <div className={styles.grid}>
          {featured.map((item, i) => (
            <div
              key={item.id}
              className={`${styles.cell} reveal`}
              data-delay={`${0.16 + i * 0.06}`}
            >
              <WorkCard item={item} />
            </div>
          ))}
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
