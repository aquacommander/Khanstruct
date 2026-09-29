'use client';

/* ════════════════════════════════════════════════════════════════════════
   DOMAINS — an immersive, scroll-driven index.

   Each domain owns a tall section whose inner panel is `position: sticky`, so
   scrolling SCRUBS through the panel instead of pushing past it. `useScrubber`
   publishes --p / --vis per section and --px/--py for the pointer; every
   transform below reads those, so no layout happens per frame.

   Clicking a domain expands its colour over the viewport and then navigates,
   so the card becomes the next page rather than blinking to it.

   The whole thing degrades to a plain stacked list under reduced motion.
   ──────────────────────────────────────────────────────────────────────── */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DOMAINS, type Domain } from '@/lib/domains';
import { useExperience } from '@/store/experience';
import { useScrubber } from '@/hooks/useScrubber';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { DomainField } from './DomainField';
import styles from './DomainsExperience.module.css';

const MORPH_MS = 620;

export function DomainsExperience() {
  const router = useRouter();
  const reducedMotion = useExperience((s) => s.reducedMotion);
  const rootRef = useScrubber(!reducedMotion);
  const [morphing, setMorphing] = useState<Domain | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Prefetch so the push after the morph is instant, and clear any stale
  // overlay — returning via the back button must not land on a covered screen.
  useEffect(() => {
    DOMAINS.forEach((d) => router.prefetch(d.href));
    setMorphing(null);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [router]);

  /* ── Click feedback ──────────────────────────────────────────────────────
     One delegated listener rather than a handler per element. The ripple is
     positioned at the actual pointer, so it reads as the surface responding
     to you rather than a canned animation. */
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const host = (e.target as HTMLElement).closest<HTMLElement>('[data-ripple]');
      if (!host) return;
      const box = host.getBoundingClientRect();
      const ink = document.createElement('span');
      ink.className = styles.ripple;
      ink.style.left = `${e.clientX - box.left}px`;
      ink.style.top = `${e.clientY - box.top}px`;
      host.appendChild(ink);
      setTimeout(() => ink.remove(), 700);
    },
    [reducedMotion],
  );

  const onCardClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, domain: Domain) => {
      // Leave new-tab / new-window intents completely alone.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (reducedMotion) return;
      e.preventDefault();
      setMorphing(domain);
      timer.current = setTimeout(() => router.push(domain.href), MORPH_MS);
    },
    [reducedMotion, router],
  );

  return (
    <div className={styles.root} ref={rootRef} onPointerDown={onPointerDown}>
      <SmoothScroll reducedMotion={reducedMotion} />

      {/* Scroll progress rail */}
      <div className={styles.rail} aria-hidden="true">
        <span className={styles.railFill} />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className={styles.hero} data-scrub>
        <div className={styles.starfield} aria-hidden="true">
          <span className={styles.layerA} />
          <span className={styles.layerB} />
          <span className={styles.layerC} />
        </div>
        <div className={styles.heroInner}>
          <p className={`label ${styles.heroLabel}`}>Knowledge Domains</p>
          <h1 className={styles.heading}>
            {'Domains'.split('').map((ch, i) => (
              <span key={i} className={styles.char} style={{ '--i': i } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </h1>
          <p className={styles.desc}>
            Deep dives into the fields shaping the future — research, tools, and frameworks.
          </p>
          <span className={styles.cue} aria-hidden="true">
            <span className={styles.cueLine} />
            Scroll
          </span>
        </div>
      </section>

      {/* ── One scrubbed panel per domain ────────────────────────────────── */}
      {DOMAINS.map((domain, i) => (
        <section
          key={domain.href}
          className={styles.panel}
          data-scrub
          style={{ '--domain-color': domain.color, '--z': i + 1 } as React.CSSProperties}
          aria-label={domain.label}
        >
          <div className={styles.sticky}>
            <span className={styles.ordinal} aria-hidden="true">
              {domain.index}
            </span>
            <DomainField domain={domain} />

            <div className={styles.panelInner}>
              <span className={styles.status}>{domain.status}</span>
              <h2 className={styles.panelTitle}>{domain.label}</h2>
              <p className={styles.hook}>{domain.hook}</p>
              <p className={styles.panelDesc}>{domain.description}</p>
              <Link
                href={domain.href}
                className={styles.enter}
                data-ripple
                onClick={(e) => onCardClick(e, domain)}
              >
                <span className={styles.enterEmoji} aria-hidden="true">
                  {domain.emoji}
                </span>
                <span>Enter {domain.label}</span>
                <span className={styles.enterArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* ── Morph overlay: the panel's colour swallows the screen ─────────── */}
      {morphing && (
        <div
          className={styles.morph}
          style={{ '--domain-color': morphing.color } as React.CSSProperties}
          aria-hidden="true"
        >
          <span className={styles.morphLabel}>{morphing.label}</span>
        </div>
      )}
    </div>
  );
}
