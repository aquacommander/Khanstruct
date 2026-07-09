'use client';

/* ════════════════════════════════════════════════════════════════════════
   CASCADING SLIDER — the presentation Zain asked for (Miro reference).

   One WIDE active card in the centre with a caption, flanked by progressively
   thin slivers of the neighbouring items. Prev/Next arrows + an "03 / 05"
   counter. Navigating morphs the widths (flex-grow) so the active collapses to
   a sliver as the next expands — the "cascade". Clicking the active card opens
   its album (click-to-view); clicking a sliver brings it to the centre.
   ──────────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useGallery } from '@/store/gallery';
import { categoryLabel, formatDate } from '@/lib/showreel';
import type { MediaItem } from '@/lib/types';
import styles from './CascadingSlider.module.css';

/* eslint-disable @next/next/no-img-element */

const pad = (n: number) => String(n).padStart(2, '0');

export function CascadingSlider({ items }: { items: MediaItem[] }) {
  const openAlbum = useGallery((s) => s.openAlbum);
  // Start centred so slivers fan out on both sides (like the reference).
  const [active, setActive] = useState(() => Math.floor((items.length - 1) / 2));

  if (items.length === 0) return null;
  const n = items.length;
  const go = (dir: number) => setActive((a) => (a + dir + n) % n);

  return (
    <div className={styles.wrap}>
      {/* Counter */}
      <div className={styles.counter} aria-hidden="true">
        <span className={styles.counterActive}>{pad(active + 1)}</span>
        <span className={styles.counterTotal}>{pad(n)}</span>
      </div>

      {/* Panel + cascading track */}
      <div className={styles.panel}>
        <div className={styles.track}>
          {items.map((item, i) => {
            const isActive = i === active;
            const topic = categoryLabel(item.category);
            const date = formatDate(item.date);
            const open = () => openAlbum(item.images, `${topic} · ${date}`);
            const activate = () => (isActive ? open() : setActive(i));
            return (
              <div
                key={item.id}
                className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
                role="button"
                tabIndex={0}
                aria-label={
                  isActive
                    ? `Open ${topic} collection from ${date}`
                    : `Show ${topic} collection from ${date}`
                }
                onClick={activate}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activate();
                  }
                }}
              >
                <img
                  className={styles.img}
                  src={item.thumb}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className={styles.scrim} aria-hidden="true" />
                {isActive && (
                  <span className={styles.caption}>
                    <span className={styles.capTopic}>{topic}</span>
                    <span className={styles.capDate}>{date}</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => go(-1)}
          aria-label="Previous"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m14 6-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => go(1)}
          aria-label="Next"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m10 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
