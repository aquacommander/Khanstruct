'use client';

/* ════════════════════════════════════════════════════════════════════════
   WORK CARD — stacked-card rotation + content-reveal hover.

   Initial: a tall dark card with the cover image, the title at the bottom-left,
   and a round accent arrow at the bottom-right. On hover an accent layer fans
   out behind it (clockwise) while the front card tilts the other way, the
   description reveals beneath the title, and the card lifts with an accent glow.

   Dark-themed to match the site (accent lime, not the reference's white/red).
   Clicking opens the project's image album in the Lightbox.
   ──────────────────────────────────────────────────────────────────────── */

import { useGallery } from '@/store/gallery';
import { categoryLabel } from '@/lib/showreel';
import type { MediaItem } from '@/lib/types';
import styles from './WorkCard.module.css';

/* eslint-disable @next/next/no-img-element */

export function WorkCard({ item }: { item: MediaItem }) {
  const openAlbum = useGallery((s) => s.openAlbum);
  const count = item.images.length;

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => openAlbum(item.images, item.title)}
      aria-label={`View ${item.title}`}
    >
      {/* accent layer that fans out behind on hover */}
      <span className={styles.back} aria-hidden="true" />

      <span className={styles.front}>
        <span className={styles.media}>
          <img
            className={styles.thumb}
            src={item.thumb}
            alt={item.title}
            loading="lazy"
            decoding="async"
          />
          <span className={styles.scrim} aria-hidden="true" />
        </span>

        <span className={styles.body}>
          <span className={styles.category}>{categoryLabel(item.category)}</span>
          <span className={styles.heading}>{item.title}</span>
          {item.description && <span className={styles.desc}>{item.description}</span>}
        </span>

        <span className={styles.arrow} aria-hidden="true">
          {count > 1 ? count : '→'}
        </span>
      </span>
    </button>
  );
}
