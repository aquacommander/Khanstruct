import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WorkGallery } from '@/components/work/WorkGallery';
import styles from './work.module.css';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'A gallery of content, design, AI video, and brand work by Khanstruct — hover to preview, click to view.',
};

export default function WorkPage() {
  return (
    <>
      <Header />
      <main>
        <section className={styles.hero}>
          <div className={styles.inner}>
            <p className={`label ${styles.label}`}>Showreel</p>
            <h1 className={styles.heading}>
              The<br />
              <em>work.</em>
            </h1>
            <p className={styles.desc}>
              Content, design, AI video, and brand work — filter by category,
              hover to preview, click to view full size.
            </p>
          </div>
        </section>

        <section className={styles.gallery} aria-label="Work gallery">
          <WorkGallery />
        </section>
      </main>
      <Footer />
    </>
  );
}
