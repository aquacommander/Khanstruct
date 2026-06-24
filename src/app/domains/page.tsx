import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './domains.module.css';

export const metadata: Metadata = {
  title: 'Domains',
  description:
    'Deep dives into Neuroscience, AI Agents, and Aerospace — the fields shaping the future.',
};

const DOMAINS = [
  {
    href: '/domains/neuroscience',
    label: 'Neuroscience',
    emoji: '🧠',
    description:
      'Exploring cognitive science, neural systems, and the science of human performance and behavior.',
    color: '#c084fc',
    status: 'Coming Soon',
  },
  {
    href: '/domains/ai-agents',
    label: 'AI Agents',
    emoji: '⚡',
    description:
      'A curated directory of leading AI agent platforms and tools spanning every category and use case.',
    color: '#d7ff3f',
    status: 'Live',
  },
  {
    href: '/domains/aerospace',
    label: 'Aerospace',
    emoji: '🚀',
    description:
      'Tracking innovations in aerospace technology, space exploration, and next-generation propulsion.',
    color: '#86efac',
    status: 'Coming Soon',
  },
];

export default function DomainsPage() {
  return (
    <>
      <Header />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className="label">Knowledge Domains</p>
            <h1 className={styles.heading}>Domains</h1>
            <p className={styles.desc}>
              Deep dives into the fields shaping the future — research, tools, and frameworks.
            </p>
          </div>
        </section>

        <section className={styles.grid} aria-label="Domain areas">
          <div className={styles.gridInner}>
            {DOMAINS.map((domain) => (
              <Link
                key={domain.href}
                href={domain.href}
                className={styles.card}
                style={{ '--domain-color': domain.color } as React.CSSProperties}
              >
                <div className={styles.cardTop}>
                  <span className={styles.cardEmoji} aria-hidden="true">
                    {domain.emoji}
                  </span>
                  <span className={styles.cardStatus} style={{ color: domain.color }}>
                    {domain.status}
                  </span>
                </div>
                <h2 className={styles.cardTitle} style={{ color: domain.color }}>
                  {domain.label}
                </h2>
                <p className={styles.cardDesc}>{domain.description}</p>
                <span className={styles.cardArrow} aria-hidden="true">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
