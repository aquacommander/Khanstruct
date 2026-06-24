import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../placeholder.module.css';

export const metadata: Metadata = {
  title: 'Aerospace',
  description:
    'Tracking innovations in aerospace technology, space exploration, and next-generation propulsion.',
};

export default function AerospacePage() {
  return (
    <>
      <Header />
      <main>
        <section className={styles.page}>
          <div className={styles.inner}>
            <Link href="/domains" className={styles.back}>
              ← Domains
            </Link>
            <p className="label">Domain</p>
            <h1 className={styles.heading} style={{ color: '#86efac' }}>
              🚀 Aerospace
            </h1>
            <p className={styles.desc}>
              Tracking breakthroughs in aerospace technology, space exploration systems,
              next-generation propulsion, and the commercialization of space. Under development.
            </p>
            <span className={styles.badge}>Content Coming Soon</span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
