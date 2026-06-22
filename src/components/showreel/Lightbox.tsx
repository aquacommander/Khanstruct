'use client';

/* ════════════════════════════════════════════════════════════════════════
   LIGHTBOX — full-screen media viewer. Rendered once in the root layout; opened
   from any MediaCard via the useGallery store. Streams video on demand (only
   when opened, never in the grid), supports keyboard nav (Esc / ← / →), traps
   focus, and locks scroll. Fires lightbox_view analytics per item.
   ──────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react';
import { useGallery } from '@/store/gallery';
import { categoryLabel } from '@/lib/showreel';
import { track } from '@/lib/analytics';
import styles from './Lightbox.module.css';

export function Lightbox() {
  const open = useGallery((s) => s.open);
  const items = useGallery((s) => s.items);
  const index = useGallery((s) => s.index);
  const close = useGallery((s) => s.closeLightbox);
  const next = useGallery((s) => s.next);
  const prev = useGallery((s) => s.prev);

  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const item = items[index];

  // Lock scroll + remember/restore focus while open.
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => dialogRef.current?.focus(), 40);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      lastFocused.current?.focus?.();
    };
  }, [open]);

  // Report each viewed item.
  useEffect(() => {
    if (open && item) {
      track('lightbox_view', { id: item.id, category: item.category });
    }
  }, [open, item]);

  // Keyboard: Esc closes, arrows navigate.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close, next, prev]);

  if (!open || !item) return null;

  const multiple = items.length > 1;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        tabIndex={-1}
      >
        <button type="button" className={styles.close} onClick={close} aria-label="Close">
          ×
        </button>

        {multiple && (
          <button
            type="button"
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={prev}
            aria-label="Previous"
          >
            ‹
          </button>
        )}

        <div className={styles.stage}>
          <div className={styles.frame}>
            {item.kind === 'video' ? (
              <video
                key={item.id}
                className={styles.media}
                src={item.src}
                poster={item.poster}
                controls
                autoPlay
                playsInline
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className={styles.media} src={item.src} alt={item.title} />
            )}
          </div>

          <div className={styles.caption}>
            <div className={styles.captionText}>
              <span className={styles.captionCategory}>{categoryLabel(item.category)}</span>
              <h2 className={styles.captionTitle}>{item.title}</h2>
              {item.description && <p className={styles.captionDesc}>{item.description}</p>}
            </div>
            {multiple && (
              <span className={styles.counter}>
                {index + 1} / {items.length}
              </span>
            )}
          </div>
        </div>

        {multiple && (
          <button
            type="button"
            className={`${styles.nav} ${styles.navNext}`}
            onClick={next}
            aria-label="Next"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
