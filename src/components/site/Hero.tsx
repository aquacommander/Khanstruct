'use client';

import Link from 'next/link';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`${styles.inner} container`}>
        <div className={styles.left}>
          <span className="eyebrow">Independent software &amp; systems studio</span>

          <h1 className={styles.headline}>
            Complex problems.<br />
            <span className={styles.accent}>Working systems.</span>
          </h1>

          <p className={styles.sub}>
            Khanstruct turns tangled business, data, and AI problems into products
            people can actually use — from first principle to production.
          </p>

          <div className={styles.ctas}>
            <Link href="/work" className="btn btn-primary">
              Explore the work →
            </Link>
            <Link href="/start" className="btn btn-ghost">
              Start a project
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>Strategy → build</span>
              <span className={styles.statLabel}>one team, end to end</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>Design · Data · AI</span>
              <span className={styles.statLabel}>implementation, not slides</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>Live systems</span>
              <span className={styles.statLabel}>shipped &amp; maintained</span>
            </div>
          </div>
        </div>

        <div className={styles.right} aria-hidden="true">
          <div className={styles.diagram}>
            <span className={styles.node} data-i="1">Scattered data</span>
            <span className={styles.arrow}>↓</span>
            <span className={styles.node} data-i="2">Mapped workflow</span>
            <span className={styles.arrow}>↓</span>
            <span className={styles.node} data-i="3">Connected systems</span>
            <span className={styles.arrow}>↓</span>
            <span className={`${styles.node} ${styles.nodeOut}`} data-i="4">Usable product</span>
          </div>
        </div>
      </div>
    </section>
  );
}
