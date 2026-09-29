'use client';

/* ════════════════════════════════════════════════════════════════════════
   SCRUBBER — one rAF loop that turns scroll + pointer into CSS variables.

   Nothing here touches React state: re-rendering at 60fps would be hopeless.
   The loop measures section offsets ONCE (and again on resize), then each
   frame writes custom properties that the stylesheet animates against:

     on the root      --sp        page progress 0..1
                      --px --py   pointer offset -1..1 (eased)
     on [data-scrub]  --p         progress through that section's own range
                      --vis       0..1 how much of it is on screen

   Everything visual is a `transform`/`opacity` driven by those vars, so the
   compositor does the work and the main thread stays free.
   ──────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react';

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

interface Section {
  el: HTMLElement;
  top: number;
  height: number;
}

export function useScrubber(enabled: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sections: Section[] = [];
    const pointer = { tx: 0, ty: 0, x: 0, y: 0 };
    let raf = 0;

    const measure = () => {
      sections.length = 0;
      const scrollY = window.scrollY;
      root.querySelectorAll<HTMLElement>('[data-scrub]').forEach((el) => {
        const box = el.getBoundingClientRect();
        sections.push({ el, top: box.top + scrollY, height: box.height });
      });
    };

    const write = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;

      root.style.setProperty('--sp', (max > 0 ? clamp(scrollY / max) : 0).toFixed(4));

      if (enabled) {
        // Ease the pointer so the parallax trails the cursor instead of snapping.
        pointer.x += (pointer.tx - pointer.x) * 0.075;
        pointer.y += (pointer.ty - pointer.y) * 0.075;
        root.style.setProperty('--px', pointer.x.toFixed(4));
        root.style.setProperty('--py', pointer.y.toFixed(4));
      }

      for (const s of sections) {
        const travel = Math.max(1, s.height - vh);
        s.el.style.setProperty('--p', clamp((scrollY - s.top) / travel).toFixed(4));
        // 0 while fully off screen, 1 while any part is in view.
        const visible = clamp((scrollY + vh - s.top) / vh) * clamp((s.top + s.height - scrollY) / vh);
        s.el.style.setProperty('--vis', visible.toFixed(4));
      }

      raf = requestAnimationFrame(write);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    measure();
    raf = requestAnimationFrame(write);

    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('resize', measure);

    const fine = window.matchMedia('(pointer: fine)').matches;
    if (enabled && fine) window.addEventListener('pointermove', onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [enabled]);

  return rootRef;
}
