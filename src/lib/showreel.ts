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

/* ── Topic classification ────────────────────────────────────────────────────
   Collapse the raw R2 folder categories (inconsistent, ~32% "Uncategorized")
   into 5 clean topics so every item lands in exactly one. Applied here at the
   data boundary, so new R2 syncs auto-classify with no manifest/component edits.
   Known topic folders map directly; everything else is scored by the item's
   title + SEO keywords. Zero-signal items default to AI & Automation (the
   dominant theme). */
type Topic = { id: string; label: string; tok: string[]; ph: string[] };

const MEDIA_CATEGORIES: Topic[] = [
  {
    id: 'ai-automation',
    label: 'AI & Automation',
    tok: ['ai', 'llm', 'ml', 'gemini', 'gemma', 'claude', 'openai', 'anthropic', 'gpt', 'gpts', 'agent', 'agents', 'agentic', 'automation', 'prompt', 'prompts', 'rag', 'vector', 'embeddings', 'embedding', 'chatbot', 'genai', 'model', 'models', 'tooling', 'airtable', 'n8n', 'codex', 'workflow', 'workflows', 'multimodal', 'autonomous', 'robotics', 'robot', 'transformer', 'transformers'],
    ph: ['machine learning', 'artificial intelligence', 'ai tooling', 'language model'],
  },
  {
    id: 'design-branding',
    label: 'Design & Branding',
    tok: ['design', 'figma', 'ui', 'ux', 'typography', 'visual', 'branding', 'brand', 'graphic', 'logo', 'packshot', 'mockup', 'dashboard', 'creative', 'studio', 'color', 'colour', 'layout', 'poster', 'aesthetic', 'font', 'fonts', 'illustration', 'render', 'motion'],
    ph: ['design studio', 'pack shots', 'graphic design'],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    tok: ['api', 'apis', 'code', 'coding', 'kafka', 'npm', 'extension', 'frontend', 'backend', 'typescript', 'javascript', 'python', 'ruby', 'database', 'devops', 'git', 'deploy', 'server', 'microservices', 'sdk', 'cli', 'validation', 'dev', 'developer', 'programmer', 'monitoring', 'security', 'penetration', 'pentest', 'testing', 'data', 'pipeline', 'infrastructure', 'saas'],
    ph: ['chrome extension', 'open banking', 'dev tools'],
  },
  {
    id: 'mind-learning',
    label: 'Mind & Learning',
    tok: ['brain', 'neuroscience', 'neural', 'neuron', 'neurons', 'cognition', 'cognitive', 'mind', 'mindset', 'psychology', 'memory', 'focus', 'learning', 'dopamine', 'cortisol', 'consciousness', 'structuralism', 'quantum', 'immune', 'physiology', 'emotion', 'emotions', 'emotionally', 'unconscious', 'neutrophils', 'lymphocytes', 'diaphragm', 'awareness', 'thinking', 'discipline', 'habit', 'habits', 'science', 'wisdom', 'knowledge', 'philosophy'],
    ph: ['deep work', 'self-sabotage'],
  },
  {
    id: 'content-growth',
    label: 'Content & Growth',
    tok: ['content', 'social', 'audience', 'fandom', 'viral', 'growth', 'business', 'marketing', 'smm', 'creator', 'creators', 'sales', 'selling', 'templates', 'template', 'pitch', 'brief', 'revenue', 'monetize', 'reel', 'reels', 'carousel', 'carousels', 'blog', 'publish', 'wealth', 'money', 'startup', 'venture', 'invoice', 'market', 'newsletter'],
    ph: ['social media', 'go to market', 'content creation'],
  },
];

// Raw R2 folder names that already map cleanly onto a topic.
const DIRECT_TOPIC: Record<string, string> = {
  'AI Tooling': 'ai-automation',
  'Design Studio': 'design-branding',
  Neuroscience: 'mind-learning',
  'Fandom Studio': 'content-growth',
  'Tools (learning)': 'engineering',
};

function classifyTopic(item: MediaItem): Topic {
  const direct = DIRECT_TOPIC[item.categoryName];
  if (direct) return MEDIA_CATEGORIES.find((c) => c.id === direct)!;
  const raw = `${item.title} ${(item.keywords ?? []).join(' ')}`.toLowerCase();
  const tokens = new Set(raw.split(/[^a-z0-9]+/).filter(Boolean));
  let best = MEDIA_CATEGORIES[0]; // default: AI & Automation
  let bestScore = 0;
  for (const c of MEDIA_CATEGORIES) {
    let score = 0;
    for (const t of c.tok) if (tokens.has(t)) score += 1;
    for (const p of c.ph) if (raw.includes(p)) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
}

// Re-categorise every item into one of the 5 clean topics. The cover is the
// first real slide of the album (see gen-manifest.mjs) — the `_Preview` files
// are tall auto-generated contact sheets and crop into unreadable fragments.
export const MEDIA_ITEMS: MediaItem[] = GENERATED_MEDIA.map((m) => {
  const topic = classifyTopic(m);
  return {
    ...m,
    category: topic.id,
    categoryName: topic.label,
    thumb: m.thumb || m.images?.[0] || '',
  };
});

export const GALLERY_PAGE_SIZE = 24;

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

/* ── Ordering ────────────────────────────────────────────────────────────────
   Dates in the manifest are INGEST dates, not creation dates, so they cluster
   hard — 39 of 179 items share 2026-06-21. Date alone therefore decides almost
   nothing, and a stable sort just falls back to the manifest's alphabetical
   folder order. That is why the gallery read as random: the featured strip was
   literally the first eight folders alphabetically from one bulk import.

   `compareItems` breaks those ties deliberately: substantial albums first,
   lone screenshots last, then title so the result is stable across builds. */
const MIN_SUBSTANTIAL = 3;

export function compareItems(a: MediaItem, b: MediaItem): number {
  const byDate = (b.date ?? '').localeCompare(a.date ?? '');
  if (byDate) return byDate;
  const byCount = (b.images?.length ?? 0) - (a.images?.length ?? 0);
  if (byCount) return byCount;
  return (a.title ?? '').localeCompare(b.title ?? '');
}

/* Within one date, show the range of the work rather than five neuroscience
   posts in a row: deal the date's items out round-robin across topics, each
   topic keeping its own `compareItems` order. */
function interleaveTopics(items: MediaItem[]): MediaItem[] {
  const byTopic = new Map<string, MediaItem[]>();
  for (const item of items) {
    const bucket = byTopic.get(item.category);
    if (bucket) bucket.push(item);
    else byTopic.set(item.category, [item]);
  }
  if (byTopic.size < 2) return items;

  // Largest topics lead, so the deal stays even as smaller ones run out.
  const queues = [...byTopic.values()].sort((a, b) => b.length - a.length);
  const out: MediaItem[] = [];
  for (let i = 0; out.length < items.length; i += 1) {
    for (const q of queues) if (i < q.length) out.push(q[i]!);
  }
  return out;
}

/** The gallery's display order: newest first, varied within each date. */
export function galleryOrder(items: MediaItem[]): MediaItem[] {
  const sorted = [...items].sort(compareItems);
  const out: MediaItem[] = [];
  let run: MediaItem[] = [];
  let runDate: string | null = null;
  const flush = () => {
    if (run.length) out.push(...interleaveTopics(run));
    run = [];
  };
  for (const item of sorted) {
    const date = item.date ?? '';
    if (date !== runDate) {
      flush();
      runDate = date;
    }
    run.push(item);
  }
  flush();
  return out;
}

/* ── Featured picking ────────────────────────────────────────────────────────
   Shared by the /work cascade and the homepage reel so both showcase the same
   thing: the BREADTH of the work, not whichever folder sorts first. */

/** Round-robin the newest substantial piece from each topic, then go again. */
export function pickDiverse(items: MediaItem[], limit = 8): MediaItem[] {
  if (items.length <= limit) return [...items].sort(compareItems);

  const sorted = [...items].sort(compareItems);
  const substantial = sorted.filter((m) => (m.images?.length ?? 0) >= MIN_SUBSTANTIAL);
  const pool = substantial.length >= limit ? substantial : sorted;

  const byTopic = new Map<string, MediaItem[]>();
  for (const item of pool) {
    const bucket = byTopic.get(item.category);
    if (bucket) bucket.push(item);
    else byTopic.set(item.category, [item]);
  }

  // Only one topic in play (a filtered view): spread the picks across dates
  // instead, so the strip isn't eight cards all stamped with the same day.
  if (byTopic.size < 2) {
    const seen = new Set<string>();
    const spread = pool.filter((m) => {
      const key = (m.date ?? '').slice(0, 7);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return (spread.length >= limit ? spread : pool).slice(0, limit);
  }

  const queues = [...byTopic.values()].sort((a, b) => b.length - a.length);
  const out: MediaItem[] = [];
  for (let i = 0; out.length < limit; i += 1) {
    let advanced = false;
    for (const q of queues) {
      if (i >= q.length) continue;
      advanced = true;
      out.push(q[i]!);
      if (out.length === limit) break;
    }
    if (!advanced) break;
  }
  return out;
}

/** Curated set for the homepage reel — featured if flagged, else a topic spread. */
export function getFeatured(limit = 8): MediaItem[] {
  const featured = MEDIA_ITEMS.filter((m) => m.featured);
  if (featured.length) return [...featured].sort(compareItems).slice(0, limit);
  return pickDiverse(MEDIA_ITEMS, limit);
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

/** Newest-first, ties broken by `compareItems`; undated sinks last. */
export function sortByDateDesc(items: MediaItem[]): MediaItem[] {
  return [...items].sort(compareItems);
}

/** Human-readable date label, e.g. '2026-01-15' → 'January 15, 2026'. */
export function formatDate(date?: string): string {
  if (!date) return 'Undated';
  const [y, m, d] = date.split('-');
  const mi = Number(m) - 1;
  if (!m || mi < 0 || mi > 11) return y || 'Undated';
  return d ? `${MONTHS[mi]} ${Number(d)}, ${y}` : `${MONTHS[mi]} ${y}`;
}

const monthKey = (item: MediaItem) => (item.date ?? '').slice(0, 7) || 'undated';

/* Group the VISIBLE items into month buckets (newest first). `all` is the full
   filtered set, so each header can report how many pieces that month really
   holds — counting the paged slice made June read "12" when it holds 39. */
export function groupByMonth(
  items: MediaItem[],
  all: MediaItem[] = items,
): { key: string; label: string; items: MediaItem[]; total: number }[] {
  const totals = new Map<string, number>();
  for (const item of all) {
    const key = monthKey(item);
    totals.set(key, (totals.get(key) ?? 0) + 1);
  }

  const order: string[] = [];
  const map = new Map<string, MediaItem[]>();
  for (const item of galleryOrder(items)) {
    const key = monthKey(item);
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
    return { key, label, items: map.get(key)!, total: totals.get(key) ?? map.get(key)!.length };
  });
}
