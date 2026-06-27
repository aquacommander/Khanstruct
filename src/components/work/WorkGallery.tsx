'use client';

/* ════════════════════════════════════════════════════════════════════════
   WORK GALLERY — the /work collection (Google I/O 2026 style): a single-column
   list of entries grouped under month headers, newest first. Category filter
   chips narrow the set; "Load more" pages in older entries so the DOM only ever
   holds a page at a time. Lightbox prev/next walks the whole shown list.
   ──────────────────────────────────────────────────────────────────────── */

import { useMemo, useState } from 'react';
import {
  categoriesWithCounts,
  filterByCategory,
  sortByDateDesc,
  groupByMonth,
  GALLERY_PAGE_SIZE,
} from '@/lib/showreel';
import { track } from '@/lib/analytics';
import { WorkCard } from '@/components/showreel/WorkCard';
import styles from './WorkGallery.module.css';

export function WorkGallery() {
  const [activeCat, setActiveCat] = useState('all');
  const [visible, setVisible] = useState(GALLERY_PAGE_SIZE);

  const categories = useMemo(() => categoriesWithCounts(), []);
  const filtered = useMemo(() => sortByDateDesc(filterByCategory(activeCat)), [activeCat]);
  const shown = filtered.slice(0, visible);
  const groups = useMemo(() => groupByMonth(shown), [shown]);
  const hasMore = visible < filtered.length;

  const selectCat = (id: string) => {
    setActiveCat(id);
    setVisible(GALLERY_PAGE_SIZE);
    track('gallery_filter', { category: id });
  };

  return (
    <div className={styles.wrap}>
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
        <p className={styles.empty}>Nothing here yet — check back soon.</p>
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
