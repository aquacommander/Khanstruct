'use client';

/* ════════════════════════════════════════════════════════════════════════
   WORK CARD — 3D flip on hover (same motion as the project-category cards,
   but WITHOUT the colored panel underneath — that stays exclusive to the
   category cards).

   Front: cover image, category + title, round accent arrow.
   Back:  accent-tinted panel with the title, description, image count + arrow.
   Clicking opens the project's image album in the Lightbox.
   ──────────────────────────────────────────────────────────────────────── */

import { useGallery } from '@/store/gallery';
import { categoryLabel, formatDate } from '@/lib/showreel';
import type { MediaItem } from '@/lib/types';
import styles from './WorkCard.module.css';

/* eslint-disable @next/next/no-img-element */

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h13" />
      <path d="m12.5 5.5 6.5 6.5-6.5 6.5" />
    </svg>
  );
}

export function WorkCard({ item }: { item: MediaItem }) {
  const openAlbum = useGallery((s) => s.openAlbum);
  const count = item.images.length;

  // Clean, honest labels — the raw R2 folder titles are auto-generated noise, so
  // the card reads as a dated collection: Topic (tag) + date (heading).
  const topic = categoryLabel(item.category);
  const date = formatDate(item.date);
  const albumTitle = `${topic} · ${date}`;

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => openAlbum(item.images, albumTitle)}
      aria-label={`View ${topic} collection from ${date}`}
    >
      {/* Crooked accent panel — flares in behind the card on hover only. */}
      <span className={styles.back} aria-hidden="true" />

      <span className={styles.flip}>
        {/* ── Front face ───────────────────────────────────────────────── */}
        <span className={`${styles.face} ${styles.faceFront}`}>
          <span className={styles.media}>
            <img
              className={styles.thumb}
              src={item.thumb}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className={styles.scrim} aria-hidden="true" />
          </span>

          <span className={styles.body}>
            <span className={styles.category}>{topic}</span>
            <span className={styles.heading}>{date}</span>
          </span>

          <span className={styles.arrow} aria-hidden="true">
            <ArrowIcon />
          </span>
        </span>

        {/* ── Back face (alternate content) ────────────────────────────── */}
        <span className={`${styles.face} ${styles.faceBack}`}>
          <span className={styles.category}>{topic}</span>
          <span className={styles.backHeading}>{date}</span>
          {item.description && <span className={styles.desc}>{item.description}</span>}

          <span className={styles.backFoot}>
            <span className={styles.backCount}>
              {count} image{count > 1 ? 's' : ''}
            </span>
            <span className={styles.arrow} aria-hidden="true">
              <ArrowIcon />
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
