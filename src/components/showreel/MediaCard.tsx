'use client';

/* ════════════════════════════════════════════════════════════════════════
   MEDIA CARD — one tile in the gallery grid. Shared by the homepage reel and
   the /work page. Lazy-loads its thumbnail, plays a muted preview clip on hover
   (video items), and opens the Lightbox at this item's index on click. Kept
   purely presentational + data-driven so both grids stay consistent.
   ──────────────────────────────────────────────────────────────────────── */

import { useRef } from 'react';
import { useGallery } from '@/store/gallery';
import { categoryLabel } from '@/lib/showreel';
import type { MediaItem } from '@/lib/types';
import styles from './MediaCard.module.css';

/* eslint-disable @next/next/no-img-element */

type Props = {
  item: MediaItem;
  /** The full ordered list this card belongs to (for lightbox prev/next). */
  list: MediaItem[];
  index: number;
};

export function MediaCard({ item, list, index }: Props) {
  const openLightbox = useGallery((s) => s.openLightbox);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onEnter = () => {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  };
  const onLeave = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <button
      type="button"
      className={`${styles.card} ${styles[item.aspect ?? 'landscape']}`}
      onClick={() => openLightbox(list, index)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={`View ${item.title}`}
    >
      <span className={styles.media}>
        <img
          className={styles.thumb}
          src={item.thumb}
          alt={item.title}
          loading="lazy"
          decoding="async"
        />
        {item.kind === 'video' && item.preview && (
          <video
            ref={videoRef}
            className={styles.preview}
            src={item.preview}
            poster={item.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        )}
        {item.kind === 'video' && (
          <span className={styles.playBadge} aria-hidden="true">
            ▶
          </span>
        )}
      </span>

      <span className={styles.overlay} aria-hidden="true">
        <span className={styles.category}>{categoryLabel(item.category)}</span>
        <span className={styles.title}>{item.title}</span>
      </span>
    </button>
  );
}
