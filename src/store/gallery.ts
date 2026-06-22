import { create } from 'zustand';
import type { MediaItem } from '@/lib/types';

/**
 * Controls the media Lightbox. A grid (homepage reel or /work) calls
 * openLightbox() with its current, ordered item list + the clicked index, so
 * prev/next navigate within whatever set the user was browsing. The Lightbox
 * itself is rendered once in the root layout.
 */
interface GalleryStore {
  open: boolean;
  items: MediaItem[];
  index: number;
  openLightbox: (items: MediaItem[], index: number) => void;
  closeLightbox: () => void;
  next: () => void;
  prev: () => void;
}

export const useGallery = create<GalleryStore>((set) => ({
  open: false,
  items: [],
  index: 0,
  openLightbox: (items, index) => set({ open: true, items, index }),
  closeLightbox: () => set({ open: false }),
  next: () =>
    set((s) => (s.items.length ? { index: (s.index + 1) % s.items.length } : {})),
  prev: () =>
    set((s) =>
      s.items.length ? { index: (s.index - 1 + s.items.length) % s.items.length } : {},
    ),
}));
