import type { MediaItem, MediaCategoryDef } from './types';

/* ════════════════════════════════════════════════════════════════════════
   SHOWREEL — the gallery's data layer.

   The gallery (homepage reel + /work page) renders entirely from MEDIA_ITEMS,
   so structure is DATA: change categories, ordering, or featured picks here and
   the UI follows — no component edits. The ingestion pipeline (scripts/ingest)
   will regenerate MEDIA_ITEMS from Zain's Drive folders + Project Information
   docs, with thumb/src/preview pointing at R2.

   Until real content lands, the items below are placeholders using existing
   public assets so the gallery is fully functional to demo. Swap them out by
   running the pipeline — nothing in the components needs to change.
   ──────────────────────────────────────────────────────────────────────── */

// Filter categories. Order here = order of the filter chips. 'all' is implicit.
export const MEDIA_CATEGORIES: MediaCategoryDef[] = [
  { id: 'ai-video', label: 'AI Video' },
  { id: 'design', label: 'Design' },
  { id: 'web', label: 'Web' },
  { id: 'social', label: 'Social' },
  { id: 'brand', label: 'Brand' },
  { id: 'data', label: 'Data' },
];

export const GALLERY_PAGE_SIZE = 12;

// ── Placeholder assets (replaced by R2 URLs after ingestion) ────────────────
const PH_PHOTO = '/photo.jpg';
const PH_EARTH = '/gdg-tulsa-earth.png';
const PH_LOGO = '/khanstruct-logo.png';
const PH_MARK = '/logo.png';

/** SEED CONTENT — placeholder gallery so the UI is demoable today. */
export const MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'ai-reel-01',
    title: 'Cinematic Brand Reel',
    category: 'ai-video',
    kind: 'image',
    thumb: PH_EARTH,
    src: PH_EARTH,
    aspect: 'landscape',
    description: 'AI-generated cinematic sequence for a product launch.',
    tags: ['Luma', 'AI Video'],
    featured: true,
    date: '2026-01',
  },
  {
    id: 'design-01',
    title: 'Product UI Concept',
    category: 'design',
    kind: 'image',
    thumb: PH_PHOTO,
    src: PH_PHOTO,
    aspect: 'portrait',
    description: 'Dashboard interface concept for a data platform.',
    tags: ['UI', 'Figma'],
    featured: true,
    date: '2025-12',
  },
  {
    id: 'web-01',
    title: 'Online Boutique',
    category: 'web',
    kind: 'image',
    thumb: PH_EARTH,
    src: PH_EARTH,
    aspect: 'landscape',
    description: 'E-commerce storefront with an animated catalog.',
    tags: ['Next.js', 'Commerce'],
    featured: true,
    date: '2025-11',
  },
  {
    id: 'social-01',
    title: 'Campaign Carousel',
    category: 'social',
    kind: 'image',
    thumb: PH_MARK,
    src: PH_MARK,
    aspect: 'square',
    description: 'Instagram campaign set for a developer community.',
    tags: ['Instagram', 'Campaign'],
    featured: true,
    date: '2025-11',
  },
  {
    id: 'brand-01',
    title: 'Identity System',
    category: 'brand',
    kind: 'image',
    thumb: PH_LOGO,
    src: PH_LOGO,
    aspect: 'landscape',
    description: 'Logo suite and brand marks for a studio identity.',
    tags: ['Branding', 'Logo'],
    featured: true,
    date: '2025-10',
  },
  {
    id: 'ai-reel-02',
    title: 'Motion Title Sequence',
    category: 'ai-video',
    kind: 'image',
    thumb: PH_PHOTO,
    src: PH_PHOTO,
    aspect: 'portrait',
    description: 'Generated title animation for a YouTube intro.',
    tags: ['AI Video', 'Motion'],
    featured: true,
    date: '2026-01',
  },
  {
    id: 'data-01',
    title: 'Analytics Dashboard',
    category: 'data',
    kind: 'image',
    thumb: PH_EARTH,
    src: PH_EARTH,
    aspect: 'landscape',
    description: 'Looker-style reporting dashboard for marketing ops.',
    tags: ['Looker', 'Reporting'],
    featured: true,
    date: '2025-09',
  },
  {
    id: 'design-02',
    title: 'Landing Page Hero',
    category: 'design',
    kind: 'image',
    thumb: PH_MARK,
    src: PH_MARK,
    aspect: 'square',
    description: 'Conversion-focused hero for a SaaS landing page.',
    tags: ['Landing', 'UI'],
    featured: true,
    date: '2025-12',
  },
  {
    id: 'social-02',
    title: 'Reels Cover Set',
    category: 'social',
    kind: 'image',
    thumb: PH_PHOTO,
    src: PH_PHOTO,
    aspect: 'portrait',
    description: 'Cohesive cover frames for a short-form series.',
    tags: ['Reels', 'Covers'],
    date: '2025-10',
  },
  {
    id: 'web-02',
    title: 'Portfolio Microsite',
    category: 'web',
    kind: 'image',
    thumb: PH_LOGO,
    src: PH_LOGO,
    aspect: 'landscape',
    description: 'Single-page microsite with scroll-driven motion.',
    tags: ['Web', 'Animation'],
    date: '2025-09',
  },
  {
    id: 'brand-02',
    title: 'Pitch Deck System',
    category: 'brand',
    kind: 'image',
    thumb: PH_EARTH,
    src: PH_EARTH,
    aspect: 'landscape',
    description: 'Investor deck template with a consistent visual language.',
    tags: ['Deck', 'Brand'],
    date: '2025-08',
  },
  {
    id: 'ai-reel-03',
    title: 'Generative Loop',
    category: 'ai-video',
    kind: 'image',
    thumb: PH_MARK,
    src: PH_MARK,
    aspect: 'square',
    description: 'Seamless generative loop for a background visual.',
    tags: ['AI Video', 'Loop'],
    date: '2026-02',
  },
  {
    id: 'data-02',
    title: 'Pipeline Diagram',
    category: 'data',
    kind: 'image',
    thumb: PH_PHOTO,
    src: PH_PHOTO,
    aspect: 'portrait',
    description: 'Architecture diagram for an automation pipeline.',
    tags: ['Architecture', 'Data'],
    date: '2025-07',
  },
  {
    id: 'design-03',
    title: 'Mobile App Screens',
    category: 'design',
    kind: 'image',
    thumb: PH_EARTH,
    src: PH_EARTH,
    aspect: 'landscape',
    description: 'Key screens for a consumer mobile experience.',
    tags: ['Mobile', 'UI'],
    date: '2025-11',
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

export function categoryLabel(id: string): string {
  return MEDIA_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

/** Curated set for the homepage reel. */
export function getFeatured(limit = 8): MediaItem[] {
  const featured = MEDIA_ITEMS.filter((m) => m.featured);
  return (featured.length ? featured : MEDIA_ITEMS).slice(0, limit);
}

/** Filter the full library by category id; 'all' returns everything. */
export function filterByCategory(categoryId: string): MediaItem[] {
  if (!categoryId || categoryId === 'all') return MEDIA_ITEMS;
  return MEDIA_ITEMS.filter((m) => m.category === categoryId);
}

/** Categories that actually have items, with counts (for the filter chips). */
export function categoriesWithCounts(): { id: string; label: string; count: number }[] {
  const all = { id: 'all', label: 'All', count: MEDIA_ITEMS.length };
  const rest = MEDIA_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    count: MEDIA_ITEMS.filter((m) => m.category === c.id).length,
  })).filter((c) => c.count > 0);
  return [all, ...rest];
}
