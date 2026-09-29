import { describe, it, expect } from 'vitest';
import {
  MEDIA_ITEMS,
  compareItems,
  galleryOrder,
  pickDiverse,
  groupByMonth,
  getFeatured,
  categoriesWithCounts,
} from '@/lib/showreel';

const topicsIn = (items: { category: string }[]) => new Set(items.map((i) => i.category));

describe('Showreel ordering', () => {
  describe('compareItems', () => {
    it('puts the newer date first', () => {
      const a = { date: '2026-01-01', images: [1], title: 'a' } as never;
      const b = { date: '2026-06-21', images: [1], title: 'b' } as never;
      expect(compareItems(a, b)).toBeGreaterThan(0);
    });

    it('breaks a date tie by album size, largest first', () => {
      const small = { date: '2026-06-21', images: [1], title: 'a' } as never;
      const big = { date: '2026-06-21', images: [1, 2, 3], title: 'z' } as never;
      expect(compareItems(small, big)).toBeGreaterThan(0);
    });

    it('is stable on title when date and size match', () => {
      const a = { date: '2026-06-21', images: [1], title: 'alpha' } as never;
      const b = { date: '2026-06-21', images: [1], title: 'beta' } as never;
      expect(compareItems(a, b)).toBeLessThan(0);
    });
  });

  describe('galleryOrder', () => {
    const ordered = galleryOrder(MEDIA_ITEMS);

    it('keeps every item exactly once', () => {
      expect(ordered).toHaveLength(MEDIA_ITEMS.length);
      expect(new Set(ordered.map((m) => m.id)).size).toBe(MEDIA_ITEMS.length);
    });

    it('stays newest-first across dates', () => {
      const dates = ordered.map((m) => m.date ?? '');
      expect([...dates].sort().reverse()).toEqual(dates);
    });

    it('does not open the grid with a one-image entry', () => {
      expect(ordered[0]!.images.length).toBeGreaterThan(1);
    });

    it('varies topics inside the big bulk-import date', () => {
      const dump = ordered.filter((m) => m.date === '2026-06-21');
      expect(dump.length).toBeGreaterThan(20);
      // The old order was alphabetical by folder, which ran long same-topic
      // streaks. Interleaving should keep the first few cards distinct.
      expect(topicsIn(dump.slice(0, 5)).size).toBeGreaterThanOrEqual(4);
    });
  });

  describe('pickDiverse', () => {
    it('spans every topic when picking from the full library', () => {
      const picks = pickDiverse(MEDIA_ITEMS, 8);
      expect(picks).toHaveLength(8);
      expect(topicsIn(picks).size).toBe(categoriesWithCounts().length - 1);
    });

    it('never repeats an item', () => {
      const picks = pickDiverse(MEDIA_ITEMS, 8);
      expect(new Set(picks.map((m) => m.id)).size).toBe(picks.length);
    });

    it('prefers substantial albums over lone screenshots', () => {
      expect(pickDiverse(MEDIA_ITEMS, 8).every((m) => m.images.length >= 3)).toBe(true);
    });

    it('spreads across months when only one topic is in play', () => {
      const single = MEDIA_ITEMS.filter((m) => m.category === MEDIA_ITEMS[0]!.category);
      const picks = pickDiverse(single, 5);
      expect(new Set(picks.map((m) => (m.date ?? '').slice(0, 7))).size).toBeGreaterThan(1);
    });

    it('returns everything when the set is smaller than the limit', () => {
      expect(pickDiverse(MEDIA_ITEMS.slice(0, 3), 8)).toHaveLength(3);
    });
  });

  describe('getFeatured', () => {
    it('honours the requested limit and spans topics', () => {
      const featured = getFeatured(6);
      expect(featured).toHaveLength(6);
      expect(topicsIn(featured).size).toBeGreaterThanOrEqual(4);
    });
  });

  describe('groupByMonth', () => {
    it('reports the true month total, not the size of the paged slice', () => {
      const all = galleryOrder(MEDIA_ITEMS);
      const page = all.slice(0, 24);
      const groups = groupByMonth(page, all);
      const june = groups.find((g) => g.key === '2026-06');
      expect(june).toBeDefined();
      expect(june!.total).toBe(MEDIA_ITEMS.filter((m) => m.date?.startsWith('2026-06')).length);
      expect(june!.total).toBeGreaterThan(june!.items.length);
    });

    it('falls back to the visible set when no full set is given', () => {
      const groups = groupByMonth(MEDIA_ITEMS);
      const sum = groups.reduce((n, g) => n + g.total, 0);
      expect(sum).toBe(MEDIA_ITEMS.length);
    });

    it('orders month buckets newest first', () => {
      const keys = groupByMonth(MEDIA_ITEMS).map((g) => g.key);
      expect([...keys].sort().reverse()).toEqual(keys);
    });
  });

  describe('verified topics', () => {
    it('drops the unreadable import artifact from the gallery', () => {
      expect(MEDIA_ITEMS.some((m) => m.id === '2026-06-21-2026-06-21-oq')).toBe(false);
    });

    it('uses the topic read off the artwork, not the scored title', () => {
      const cases: [string, string][] = [
        ['2026-06-21-data-x1440px-stays-device', 'ai-automation'], // Google AI Studio / Gemma on-device
        ['2026-06-21-company-need-brain-map', 'ai-automation'], // "company brain" as AI context layer
        ['2026-06-21-stitch-claude-code-design', 'ai-automation'], // Stitch MCP -> Claude Code design tokens
        ['2026-01-30-top-remote-computer-programmer', 'content-growth'], // Toptal freelance platform
      ];
      for (const [id, topic] of cases) {
        const item = MEDIA_ITEMS.find((m) => m.id === id);
        expect(item, id).toBeDefined();
        expect(item!.category, id).toBe(topic);
      }
    });

    it('leaves no item stranded without a topic', () => {
      const ids = new Set(categoriesWithCounts().map((c) => c.id));
      expect(MEDIA_ITEMS.every((m) => ids.has(m.category))).toBe(true);
    });
  });
});
