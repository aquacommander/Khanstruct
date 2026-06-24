'use client';

/* ════════════════════════════════════════════════════════════════════════
   COLLECTION ROW — one entry in the /work date-collection (Google I/O style):
   cover · category tag · title · image count · date. Clicking opens the
   project's image album in the Lightbox. Lazy-loads its cover.
   ──────────────────────────────────────────────────────────────────────── */

import { useGallery } from '@/store/gallery';
import { categoryLabel, formatDate } from '@/lib/showreel';
import type { MediaItem } from '@/lib/types';
import styles from './CollectionRow.module.css';

/* eslint-disable @next/next/no-img-element */

export function CollectionRow({ item }: { item: MediaItem }) {
  const openAlbum = useGallery((s) => s.openAlbum);
  const count = item.images.length;

  return (
    <button
      type="button"
      className={styles.row}
      onClick={() => openAlbum(item.images, item.title)}
      aria-label={`View ${item.title}`}
    >
      <span className={styles.thumbWrap}>
        <img
          className={styles.thumb}
          src={item.thumb}
          alt={item.title}
          loading="lazy"
          decoding="async"
        />
        {count > 1 && (
          <span className={styles.play} aria-hidden="true">
            {count}
          </span>
        )}
      </span>

      <span className={styles.body}>
        <span className={styles.tag}>{categoryLabel(item.category)}</span>
        <span className={styles.title}>{item.title}</span>
        {item.description && <span className={styles.desc}>{item.description}</span>}
        <span className={styles.date}>
          {formatDate(item.date)}
          {count > 1 ? ` · ${count} images` : ''}
        </span>
      </span>

      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </button>
  );
}
