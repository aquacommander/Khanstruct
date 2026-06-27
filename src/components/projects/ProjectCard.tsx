import Link from 'next/link';
import type { Project } from '@/lib/types';
import styles from './ProjectCard.module.css';

/* ════════════════════════════════════════════════════════════════════════
   PROJECT CARD — matches the Work-page card style (stacked-card fan + content
   reveal on hover), but uses Project data and links to the case-study page.
   Each card is themed by the project's accent colour. No cover image — uses an
   accent gradient + the title initial as the visual.
   ──────────────────────────────────────────────────────────────────────── */

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={styles.card}
      style={{ '--accent': project.accentColor } as React.CSSProperties}
      aria-label={`${project.title} — ${project.category}`}
    >
      <span className={styles.back} aria-hidden="true" />

      <span className={styles.front}>
        <span className={styles.media} aria-hidden="true">
          <span className={styles.initial}>{project.title.charAt(0)}</span>
        </span>
        <span className={styles.scrim} aria-hidden="true" />

        <span className={styles.body}>
          <span className={styles.category}>{project.category}</span>
          <span className={styles.heading}>{project.title}</span>
          <span className={styles.desc}>{project.summary}</span>
        </span>

        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  );
}
