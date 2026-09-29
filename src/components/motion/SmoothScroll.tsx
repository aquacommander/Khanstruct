'use client';

/* ════════════════════════════════════════════════════════════════════════
   SMOOTH SCROLL — Lenis, scoped to whichever page mounts it.

   Deliberately NOT in the root layout: it changes the feel of every scroll on
   the page, and it is destroyed on unmount so navigating away restores native
   scrolling. It also stands down entirely for prefers-reduced-motion, and
   pauses while a modal is open so the wheel doesn't scroll the page behind it.
   ──────────────────────────────────────────────────────────────────────── */

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useContactModal } from '@/store/contact';
import { useFunnel } from '@/store/funnel';
import { useGallery } from '@/store/gallery';

let lenis: Lenis | null = null;

/** Let other components pause/resume the smooth scroll (modals, overlays). */
export function setSmoothScrollPaused(paused: boolean) {
  if (!lenis) return;
  if (paused) lenis.stop();
  else lenis.start();
}

export function SmoothScroll({ reducedMotion }: { reducedMotion: boolean }) {
  const contactOpen = useContactModal((s) => s.open);
  const funnelOpen = useFunnel((s) => s.open);
  const galleryOpen = useGallery((s) => s.open);
  const blocked = contactOpen || funnelOpen || galleryOpen;

  useEffect(() => {
    if (reducedMotion) return;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenis = instance;

    let raf = 0;
    const loop = (time: number) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      lenis = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    setSmoothScrollPaused(blocked);
  }, [blocked]);

  return null;
}
