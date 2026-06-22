'use client';

/* ════════════════════════════════════════════════════════════════════════
   WORK GALLERY — the full /work library. Category filter chips + "Load more"
   pagination so the DOM only ever holds a page of items at a time (the key to
   staying fast at thousands of pieces). Resets the visible count when the
   filter changes. Reports filter changes to analytics.
   ──────────────────────────────────────────────────────────────────────── */

import { useMemo, useState } from 'react';
import {
  categoriesWithCounts,
  filterByCategory,
  GALLERY_PAGE_SIZE,
} from '@/lib/showreel';
import { track } from '@/lib/analytics';
import { MediaCard } from '@/components/showreel/MediaCard';
import styles from './WorkGallery.module.css';

export function WorkGallery() {
  const [activeCat, setActiveCat] = useState('all');
  const [visible, setVisible] = useState(GALLERY_PAGE_SIZE);

  const categories = useMemo(() => categoriesWithCounts(), []);
  const filtered = useMemo(() => filterByCategory(activeCat), [activeCat]);
  const shown = filtered.slice(0, visible);
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
        <div className={styles.grid}>
          {shown.map((item, i) => (
            <MediaCard key={item.id} item={item} list={shown} index={i} />
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
