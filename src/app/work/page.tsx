import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WorkGallery } from '@/components/work/WorkGallery';
import { MEDIA_ITEMS } from '@/lib/showreel';
import styles from './work.module.css';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'A dated collection of content, design, AI video, and brand work by Khanstruct.',
};

export default function WorkPage() {
  return (
    <>
      <Header />
      <main>
        <section className={styles.hero}>
          <div className={styles.inner}>
            <p className={`label ${styles.label}`}>The Collection</p>
            <h1 className={styles.heading}>
              The<br />
              <em>work.</em>
            </h1>
            <p className={styles.meta}>
              {MEDIA_ITEMS.length} pieces · content, design, AI video &amp; brand
            </p>
            <p className={styles.desc}>
              A running collection of the work — newest first, grouped by the
              month it shipped. Click any entry to view it full size.
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
