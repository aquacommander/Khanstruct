'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useRevealAll } from '@/hooks/useScrollReveal';
import { DISCIPLINES, projectsFor } from '@/components/projects/ProjectsExplorer';
import styles from './Projects.module.css';

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealAll(sectionRef);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="projects-heading"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="label reveal">Problems I&apos;ve Solved</p>
          <h2 id="projects-heading" className={`${styles.heading} reveal`} data-delay="0.08">
            Real problems,<br />
            <em>real solutions.</em>
          </h2>
          <p className={`${styles.subheading} reveal`} data-delay="0.12">
            Explore the work by discipline — pick a category to see the problems I&apos;ve solved.
          </p>
        </div>

        <div className={styles.grid} role="list">
          {DISCIPLINES.map((d, i) => {
            const items = projectsFor(d.slugs);
            return (
              <article
                key={d.id}
                className={`${styles.card} reveal`}
                data-delay={`${0.2 + i * 0.12}`}
                role="listitem"
                style={{ '--accent': d.accent } as React.CSSProperties}
              >
                {/* Colored panel layered behind — revealed as the card turns edge-on */}
                <span className={styles.panel} aria-hidden="true" />

                <Link href={`/projects?d=${d.id}`} className={styles.flip}>
                  {/* ── Front face ─────────────────────────────────────────── */}
                  <div className={`${styles.face} ${styles.faceFront}`}>
                    <div className={styles.imageWrapper}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={d.image}
                        alt=""
                        className={styles.cardImage}
                        loading="lazy"
                        aria-hidden="true"
                      />
                      <div className={styles.imageTint} aria-hidden="true" />
                      <div className={styles.imageOverlay} aria-hidden="true" />
                    </div>

                    <div className={styles.cardBody}>
                      <span className={styles.category} style={{ color: d.accent }}>
                        {items.length} {items.length === 1 ? 'Project' : 'Projects'}
                      </span>
                      <h3 className={styles.cardTitle}>{d.label}</h3>
                      <div className={styles.tags}>
                        {items.slice(0, 3).map((p) => (
                          <span key={p.slug} className={styles.tag}>
                            {p.title}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className={styles.iconBtn} aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h13" />
                        <path d="m12.5 5.5 6.5 6.5-6.5 6.5" />
                      </svg>
                    </span>
                  </div>

                  {/* ── Back face (alternate content) ──────────────────────── */}
                  <div className={`${styles.face} ${styles.faceBack}`}>
                    <h3 className={styles.backTitle}>{d.label}</h3>
                    <p className={styles.backDesc}>{d.blurb}</p>
                    <span className={styles.iconBtn} aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h13" />
                        <path d="m12.5 5.5 6.5 6.5-6.5 6.5" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        <div className={`${styles.footer} reveal`} data-delay="0.5">
          <Link href="/projects" className="btn-outline">
            <span>View All Projects</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
