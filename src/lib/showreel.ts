import type { MediaItem } from './types';
import { GENERATED_MEDIA } from './generated/media';

/* ════════════════════════════════════════════════════════════════════════
   SHOWREEL — the gallery's data layer.

   Content is GENERATED from R2 by scripts/gen-manifest.mjs (one entry per
   project, with a cover + image album, category + date from the folder names).
   Everything below derives from that array, so categories, ordering, and the
   homepage reel all update automatically when new content is synced + the
   manifest regenerated. No component edits needed.
   ──────────────────────────────────────────────────────────────────────── */

export const MEDIA_ITEMS: MediaItem[] = GENERATED_MEDIA;

export const GALLERY_PAGE_SIZE = 12;

// category slug → display name, learned from the data itself.
const CATEGORY_NAMES = new Map<string, string>();
for (const m of MEDIA_ITEMS) {
  if (!CATEGORY_NAMES.has(m.category)) CATEGORY_NAMES.set(m.category, m.categoryName);
}

export function categoryLabel(id: string): string {
  return CATEGORY_NAMES.get(id) ?? id;
}

/** Lowercased searchable text for an item (title + category + SEO keywords). */
export function itemSearchText(item: MediaItem): string {
  return `${item.title} ${item.categoryName} ${(item.keywords ?? []).join(' ')}`.toLowerCase();
}

/** Curated set for the homepage reel — featured if flagged, else newest. */
export function getFeatured(limit = 8): MediaItem[] {
  const featured = MEDIA_ITEMS.filter((m) => m.featured);
  const base = featured.length ? featured : sortByDateDesc(MEDIA_ITEMS);
  return base.slice(0, limit);
}

/** Filter the full library by category slug; 'all' returns everything. */
export function filterByCategory(categoryId: string): MediaItem[] {
  if (!categoryId || categoryId === 'all') return MEDIA_ITEMS;
  return MEDIA_ITEMS.filter((m) => m.category === categoryId);
}

/** Categories present in the data, with counts (for the filter chips). */
export function categoriesWithCounts(): { id: string; label: string; count: number }[] {
  const seen = new Map<string, { id: string; label: string; count: number }>();
  for (const m of MEDIA_ITEMS) {
    const e = seen.get(m.category) ?? { id: m.category, label: m.categoryName, count: 0 };
    e.count += 1;
    seen.set(m.category, e);
  }
  const rest = [...seen.values()].sort((a, b) => a.label.localeCompare(b.label));
  return [{ id: 'all', label: 'All', count: MEDIA_ITEMS.length }, ...rest];
}

// ── Date helpers (collection / blog-style layout) ───────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Newest-first by date string ('YYYY-MM-DD'); undated sinks last. */
export function sortByDateDesc(items: MediaItem[]): MediaItem[] {
  return [...items].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

/** Human-readable date label, e.g. '2026-01-15' → 'January 15, 2026'. */
export function formatDate(date?: string): string {
  if (!date) return 'Undated';
  const [y, m, d] = date.split('-');
  const mi = Number(m) - 1;
  if (!m || mi < 0 || mi > 11) return y || 'Undated';
  return d ? `${MONTHS[mi]} ${Number(d)}, ${y}` : `${MONTHS[mi]} ${y}`;
}

/** Group items into month buckets (newest month first) for the collection list. */
export function groupByMonth(
  items: MediaItem[],
): { key: string; label: string; items: MediaItem[] }[] {
  const order: string[] = [];
  const map = new Map<string, MediaItem[]>();
  for (const item of sortByDateDesc(items)) {
    const key = (item.date ?? '').slice(0, 7) || 'undated';
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(item);
  }
  return order.map((key) => {
    const [y, m] = key.split('-');
    const mi = Number(m) - 1;
    const label = key === 'undated' || mi < 0 || mi > 11 ? 'Undated' : `${MONTHS[mi]} ${y}`;
    return { key, label, items: map.get(key)! };
  });
}
