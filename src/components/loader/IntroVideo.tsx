'use client';

/* ════════════════════════════════════════════════════════════════════════
   INTRO VIDEO — the brand intro that plays when a visitor lands.

   Reuses the loader handoff: it locks scroll on mount (like the old cinematic),
   plays the Gemini intro video full-screen, then on end / skip calls
   setIntroDone(true) → runHeroEntrance() (Hero.tsx) and unlocks the page.

   • Autoplays MUTED (browser policy); an Unmute button turns sound on.
   • Skip is always available. A hard cap guarantees the page can never stick.
   • Reduced motion / load error / autoplay-blocked all hand off gracefully.
   Keeps id="site-loader" so the no-JS <noscript> fallback still hides it.
   ════════════════════════════════════════════════════════════════════════ */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useExperience } from '@/store/experience';
import styles from './IntroVideo.module.css';

const VIDEO_SRC = '/intro.mp4';
const MAX_LOCK_MS = 18000; // safety net: never hold the page past this

export function IntroVideo() {
  const setIntroDone = useExperience((s) => s.setIntroDone);

  const [mounted, setMounted] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [muted, setMuted] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef(false);

  // Lock scroll + park focus before first paint (mirrors the old loader).
  useLayoutEffect(() => {
    document.documentElement.classList.add('loader-active');
    document.body.classList.add('is-loading');
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  /** Hand off to the page: unlock scroll, focus content, fade out, unmount. */
  function finish() {
    if (doneRef.current) return;
    doneRef.current = true;
    setExiting(true);
    setIntroDone(true);
    document.documentElement.classList.remove('loader-active');
    document.body.classList.remove('is-loading');
    const main = document.getElementById('main-content');
    if (main) {
      try {
        main.focus({ preventScroll: true });
      } catch {
        main.focus();
      }
    }
    window.setTimeout(() => setMounted(false), 600); // allow the fade-out
  }

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      finish();
      return;
    }
    // Kick off playback; if the browser blocks autoplay, offer a tap-to-play.
    const v = videoRef.current;
    const p = v?.play();
    if (p && typeof p.then === 'function') p.catch(() => setNeedsTap(true));

    const hardStop = window.setTimeout(finish, MAX_LOCK_MS);
    return () => window.clearTimeout(hardStop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  const manualPlay = () => {
    setNeedsTap(false);
    videoRef.current?.play().catch(() => {});
  };

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      id="site-loader"
      className={`${styles.intro} ${exiting ? styles.exiting : ''}`}
      role="dialog"
      aria-label="Khanstruct intro video"
      tabIndex={-1}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        className={styles.video}
        src={VIDEO_SRC}
        autoPlay
        muted={muted}
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
      />

      {needsTap && (
        <button
          type="button"
          className={styles.play}
          onClick={manualPlay}
          aria-label="Play intro"
        >
          ▶
        </button>
      )}

      <div className={styles.controls}>
        <button type="button" className={styles.ctrlBtn} onClick={toggleMute}>
          {muted ? 'Unmute' : 'Mute'}
        </button>
        <button type="button" className={styles.skip} onClick={finish}>
          Skip intro →
        </button>
      </div>
    </div>
  );
}
