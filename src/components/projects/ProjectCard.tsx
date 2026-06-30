import type { Project } from '@/lib/types';
import styles from './ProjectCard.module.css';

/* eslint-disable @next/next/no-img-element */

/* ════════════════════════════════════════════════════════════════════════
   PROJECT CARD — 3D flip on hover (same motion as the work cards).
   Front: cover screenshot + category + title.
   Back:  accent-tinted panel with the summary + the EXACT project link.
   The whole card opens the project's real URL (live site / GitHub / store)
   in a new tab. A crooked accent panel flares in behind on hover.
   ──────────────────────────────────────────────────────────────────────── */

function ArrowIcon() {
  // Up-right arrow — signals the card opens an external link.
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const link = project.verifiedLinks[0];
  const href = link?.url ?? `/projects/${project.slug}`;
  const isExternal = Boolean(link?.url);
  const host = link?.url
    ? link.url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    : '';

  return (
    <a
      href={href}
      className={styles.card}
      style={{ '--accent': project.accentColor } as React.CSSProperties}
      aria-label={`${project.title} — ${project.category}${isExternal ? ' (opens project)' : ''}`}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {/* Crooked accent panel — flares in behind on hover only. */}
      <span className={styles.back} aria-hidden="true" />

      <span className={styles.flip}>
        {/* ── Front face ───────────────────────────────────────────────── */}
        <span className={`${styles.face} ${styles.faceFront}`}>
          <span className={styles.media} aria-hidden="true">
            <img className={styles.cover} src={project.coverImage} alt="" loading="lazy" />
            <span className={styles.scrim} aria-hidden="true" />
          </span>

          <span className={styles.body}>
            <span className={styles.category}>{project.category}</span>
            <span className={styles.heading}>{project.title}</span>
          </span>

          <span className={styles.arrow} aria-hidden="true">
            <ArrowIcon />
          </span>
        </span>

        {/* ── Back face ────────────────────────────────────────────────── */}
        <span className={`${styles.face} ${styles.faceBack}`}>
          <span className={styles.category}>{project.category}</span>
          <span className={styles.backHeading}>{project.title}</span>
          <span className={styles.desc}>{project.summary}</span>

          <span className={styles.backFoot}>
            <span className={styles.backLink}>{host || 'View project'}</span>
            <span className={styles.arrow} aria-hidden="true">
              <ArrowIcon />
            </span>
          </span>
        </span>
      </span>
    </a>
  );
}
