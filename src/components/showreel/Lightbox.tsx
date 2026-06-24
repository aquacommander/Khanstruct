'use client';

/* ════════════════════════════════════════════════════════════════════════
   LIGHTBOX — full-screen album viewer. Rendered once in the root layout; opened
   from a card via useGallery.openAlbum(). Pages through one project's image set
   (Esc / ← / →), traps focus, and locks scroll. Reports each viewed slide.
   ──────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react';
import { useGallery } from '@/store/gallery';
import { track } from '@/lib/analytics';
import styles from './Lightbox.module.css';

/* eslint-disable @next/next/no-img-element */

export function Lightbox() {
  const open = useGallery((s) => s.open);
  const images = useGallery((s) => s.images);
  const title = useGallery((s) => s.title);
  const index = useGallery((s) => s.index);
  const dir = useGallery((s) => s.dir);
  const close = useGallery((s) => s.closeLightbox);
  const next = useGallery((s) => s.next);
  const prev = useGallery((s) => s.prev);

  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const src = images[index];

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

  useEffect(() => {
    if (open && src) track('lightbox_view', { title, slide: index + 1 });
  }, [open, src, title, index]);

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

  if (!open || !src) return null;

  const multiple = images.length > 1;

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
        aria-label={title}
        tabIndex={-1}
      >
        <button type="button" className={styles.close} onClick={close} aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        {multiple && (
          <button
            type="button"
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={prev}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div className={styles.stage}>
          <div className={styles.frame}>
            <img
              key={index}
              className={`${styles.media} ${dir > 0 ? styles.slideNext : dir < 0 ? styles.slidePrev : ''}`}
              src={src}
              alt={title}
            />
          </div>

          <div className={styles.caption}>
            <h2 className={styles.captionTitle}>{title}</h2>
            {multiple && (
              <span className={styles.counter}>
                {index + 1} / {images.length}
              </span>
            )}
          </div>
        </div>

        {multiple && (
          <button
            type="button"
            className={`${styles.nav} ${styles.navNext}`}
            onClick={next}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
