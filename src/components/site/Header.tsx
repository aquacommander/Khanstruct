'use client';

/* ════════════════════════════════════════════════════════════════════════
   HEADER — Khanstruct 2.0 service-style top nav.
   Transparent over the hero, solid on scroll, sticky, full-screen mobile menu.
   ──────────────────────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

const NAV = [
  { label: 'Work', href: '/work' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Process', href: '/process' },
  { label: 'Lab', href: '/lab' },
  { label: 'Studio', href: '/studio' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={`${styles.header} ${scrolled ? styles.solid : ''}`} role="banner">
      <div className={`${styles.inner} container`}>
        <Link href="/" className={styles.brand} aria-label="Khanstruct home">
          KHAN<span className={styles.brandSlash}>/</span>STRUCT
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive(item.href) ? styles.linkActive : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <span className={styles.badge}>
            <span className={styles.dot} aria-hidden="true" />
            Available · 2026
          </span>
          <Link href="/start" className={`btn btn-primary ${styles.cta}`}>
            Start a Project
          </Link>
          <button
            type="button"
            className={styles.menuBtn}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`${styles.menuIcon} ${open ? styles.menuIconOpen : ''}`}>
              <span /><span /><span />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobile} ${open ? styles.mobileOpen : ''}`}>
        <nav className={styles.mobileNav} aria-label="Mobile">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={styles.mobileLink}>
              {item.label}
            </Link>
          ))}
          <Link href="/start" className={`btn btn-primary ${styles.mobileCta}`}>
            Start a Project
          </Link>
        </nav>
      </div>
    </header>
  );
}
