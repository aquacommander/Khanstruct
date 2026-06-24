import Image from 'next/image';
import Link from 'next/link';
import { Instrument_Serif } from 'next/font/google';
import styles from './EditorialHero.module.css';

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-editorial-serif',
  display: 'swap',
});

export function EditorialHero() {
  return (
    <section className={`${styles.hero} ${serif.variable}`} aria-label="AI Agents introduction">
      {/* Vertical side nav (rotated) */}
      <span className={styles.sideNav} aria-hidden="true">
        Assistants · Coding · Support · Content
      </span>

      <div className={styles.inner}>
        {/* Top row: brand label + index */}
        <div className={styles.topRow}>
          <Link href="/domains" className={styles.brand}>
            ← Khanstruct / Domains
          </Link>
          <span className={styles.index} aria-hidden="true">
            01<span className={styles.indexTotal}>/07</span>
          </span>
        </div>

        {/* Center stage */}
        <div className={styles.stage}>
          <span className={styles.wordArt} aria-hidden="true">
            AGENTS
          </span>

          {/* Left editorial column */}
          <div className={styles.left}>
            <h1 className={styles.headline}>
              A directory of the
              <br />
              AI agents doing
              <br />
              <em>real work.</em>
            </h1>
            <p className={styles.sub}>
              Curated platforms across assistants, analytics, coding, customer
              service, and content — the tools quietly automating the modern stack.
            </p>
            <a href="#directory" className={styles.cta}>
              <span>Explore the directory</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Portrait */}
          <div className={styles.portraitWrap}>
            <Image
              src="/photo.jpg"
              alt="Zain Khan"
              width={320}
              height={320}
              className={styles.portrait}
              priority
            />
          </div>

          {/* Right caption */}
          <p className={styles.right} aria-hidden="true">
            that actually
            <br />
            <span className={styles.rightAccent}>ship.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
