'use client';

/* ════════════════════════════════════════════════════════════════════════
   PROJECTS EXPLORER — two-level, systematic project navigation.

   Level 1: discipline cards (AI / Frontend / Backend).
   Level 2: click a discipline → that discipline's projects (+ a back link).

   Discipline → project mapping lives here (by slug) so the data file/nav don't
   need touching; swap the slugs for the real projects as they're added.
   ──────────────────────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react';
import { PROJECTS } from '@/lib/content';
import type { Project } from '@/lib/types';
import { ProjectCard } from './ProjectCard';
import styles from './ProjectsExplorer.module.css';

export type Discipline = {
  id: string;
  label: string;
  blurb: string;
  accent: string;
  image: string;
  slugs: string[];
};

/* Single source of truth for the discipline → project mapping. Reused by the
   homepage Projects section so both stay in sync. */
export const DISCIPLINES: Discipline[] = [
  {
    id: 'ai',
    label: 'AI',
    blurb: 'Agents, automation & intelligent systems.',
    accent: '#d7ff3f',
    image: '/AI.png',
    slugs: ['zebracat', 'job-wizard', 'ollama-chatbot', 'multiagent-medical-assistant', 'parasol-finance', 'menaji'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    blurb: 'Interfaces, web apps & product UI.',
    accent: '#4a9eff',
    image: '/Frontend.png',
    slugs: ['cerashealth', 'pickade', 'cbet', 'raffle-famous', 'sportsblog', 'mapbox', 'bloxmoon', 'armory', 'amino-rewards'],
  },
  {
    id: 'backend',
    label: 'Backend',
    blurb: 'APIs, services & data systems.',
    accent: '#a855f7',
    image: '/Backend.png',
    slugs: ['pixora', 'appointy', 'australian-banking-db', 'cerashealth', 'raffle-famous', 'sportsblog', 'bloxmoon', 'armory'],
  },
];

export const projectsFor = (slugs: string[]): Project[] =>
  slugs.map((s) => PROJECTS.find((p) => p.slug === s)).filter((p): p is Project => Boolean(p));

export function ProjectsExplorer() {
  const [active, setActive] = useState<string | null>(null);
  const current = DISCIPLINES.find((d) => d.id === active) ?? null;

  // Deep-link support: /projects?d=frontend opens that discipline directly
  // (e.g. when arriving from a homepage category card).
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get('d');
    if (d && DISCIPLINES.some((x) => x.id === d)) setActive(d);
  }, []);

  // ── Level 1 — pick a discipline ────────────────────────────────────────────
  if (!current) {
    return (
      <div className={styles.disciplines}>
        {DISCIPLINES.map((d) => {
          const count = projectsFor(d.slugs).length;
          return (
            <button
              key={d.id}
              type="button"
              className={styles.discCard}
              style={{ '--accent': d.accent } as React.CSSProperties}
              onClick={() => setActive(d.id)}
            >
              <span className={styles.discMedia}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.discImg} src={d.image} alt="" loading="lazy" />
                <span className={styles.discTint} aria-hidden="true" />
                <span className={styles.discCount}>
                  {count} {count === 1 ? 'Project' : 'Projects'}
                </span>
              </span>

              <span className={styles.discContent}>
                <span className={styles.discLabel}>{d.label}</span>
                <span className={styles.discBlurb}>{d.blurb}</span>
                <span className={styles.discCta}>
                  View projects
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h13" />
                    <path d="m12.5 5.5 6.5 6.5-6.5 6.5" />
                  </svg>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // ── Level 2 — that discipline's projects ──────────────────────────────────
  const items = projectsFor(current.slugs);
  return (
    <div className={styles.detail}>
      <button type="button" className={styles.back} onClick={() => setActive(null)}>
        ← All disciplines
      </button>
      <h2 className={styles.detailTitle} style={{ '--accent': current.accent } as React.CSSProperties}>
        {current.label}
      </h2>

      {items.length === 0 ? (
        <p className={styles.empty}>No projects here yet.</p>
      ) : (
        <div className={styles.grid}>
          {items.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
