import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../placeholder.module.css';

export const metadata: Metadata = {
  title: 'Neuroscience',
  description:
    'Exploring cognitive science, neural systems, and the science of human performance and behavior.',
};

export default function NeurosciencePage() {
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
            <h1 className={styles.heading} style={{ color: '#c084fc' }}>
              🧠 Neuroscience
            </h1>
            <p className={styles.desc}>
              Deep research into cognitive science, neural systems, and the science of human
              performance, behavior, and learning. This domain is under active development.
            </p>
            <span className={styles.badge}>Content Coming Soon</span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
