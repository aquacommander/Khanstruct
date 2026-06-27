'use client';

/* ════════════════════════════════════════════════════════════════════════
   WORK GALLERY — searchable, filterable collection (grouped by month).

   A search bar (matches title + category + SEO keywords) sits above category
   filter chips. "Load more" pages in older entries. Lightbox prev/next walks
   the shown set.
   ──────────────────────────────────────────────────────────────────────── */

import { useMemo, useState } from 'react';
import {
  categoriesWithCounts,
  filterByCategory,
  sortByDateDesc,
  groupByMonth,
  itemSearchText,
  GALLERY_PAGE_SIZE,
} from '@/lib/showreel';
import { track } from '@/lib/analytics';
import { WorkCard } from '@/components/showreel/WorkCard';
import styles from './WorkGallery.module.css';

export function WorkGallery() {
  const [activeCat, setActiveCat] = useState('all');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(GALLERY_PAGE_SIZE);

  const categories = useMemo(() => categoriesWithCounts(), []);

  const filtered = useMemo(() => {
    let res = sortByDateDesc(filterByCategory(activeCat));
    const q = query.trim().toLowerCase();
    if (q) {
      const tokens = q.split(/\s+/);
      res = res.filter((m) => {
        const hay = itemSearchText(m);
        return tokens.every((t) => hay.includes(t));
      });
    }
    return res;
  }, [activeCat, query]);

  const shown = filtered.slice(0, visible);
  const groups = useMemo(() => groupByMonth(shown), [shown]);
  const hasMore = visible < filtered.length;

  const selectCat = (id: string) => {
    setActiveCat(id);
    setVisible(GALLERY_PAGE_SIZE);
    track('gallery_filter', { category: id });
  };

  const onSearch = (v: string) => {
    setQuery(v);
    setVisible(GALLERY_PAGE_SIZE);
  };

  return (
    <div className={styles.wrap}>
      {/* Search */}
      <div className={styles.searchWrap}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          className={styles.search}
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search work — e.g. AI, design, brain, automation…"
          aria-label="Search projects"
        />
        {query && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => onSearch('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className={styles.filters} role="tablist" aria-label="Filter work by category">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCat === cat.id}
            className={`${styles.chip} ${activeCat === cat.id ? styles.chipActive : ''}`}
            onClick={() => selectCat(cat.id)}
          >
            {cat.label}
            <span className={styles.count}>{cat.count}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className={styles.empty}>
          {query ? `No projects match “${query.trim()}”.` : 'Nothing here yet — check back soon.'}
        </p>
      ) : (
        <div className={styles.collection}>
          {groups.map((group) => (
            <section key={group.key} className={styles.group}>
              <h2 className={styles.groupLabel}>
                {group.label}
                <span className={styles.groupCount}>{group.items.length}</span>
              </h2>
              <div className={styles.cards}>
                {group.items.map((item) => (
                  <WorkCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {hasMore && (
        <div className={styles.more}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => setVisible((v) => v + GALLERY_PAGE_SIZE)}
          >
            <span>Load more</span>
            <span aria-hidden="true">↓</span>
          </button>
        </div>
      )}
    </div>
  );
}
