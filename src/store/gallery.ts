import { create } from 'zustand';

/**
 * Controls the media Lightbox as a per-project ALBUM viewer. A card calls
 * openAlbum() with that project's ordered image URLs + its title; prev/next
 * page within the album. The Lightbox is rendered once in the root layout.
 */
interface GalleryStore {
  open: boolean;
  images: string[];
  title: string;
  index: number;
  openAlbum: (images: string[], title: string, index?: number) => void;
  closeLightbox: () => void;
  next: () => void;
  prev: () => void;
}

export const useGallery = create<GalleryStore>((set) => ({
  open: false,
  images: [],
  title: '',
  index: 0,
  openAlbum: (images, title, index = 0) =>
    set({ open: true, images, title, index: images.length ? index : 0 }),
  closeLightbox: () => set({ open: false }),
  next: () =>
    set((s) => (s.images.length ? { index: (s.index + 1) % s.images.length } : {})),
  prev: () =>
    set((s) =>
      s.images.length ? { index: (s.index - 1 + s.images.length) % s.images.length } : {},
    ),
}));
