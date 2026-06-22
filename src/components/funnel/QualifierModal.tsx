'use client';

/* ════════════════════════════════════════════════════════════════════════
   QUALIFIER MODAL — the "Start a Project" lead funnel.

   A guided, card-based wizard (Service → Scope → Timeline → Budget → Details)
   that replaces the open-ended contact form. Answers are scored into a
   priority (Hot / Warm / Cold) so Zain's CRM rows arrive pre-ranked. Rendered
   once in the root layout; opened from any "Start a project" button via the
   useFunnel store. Reuses the accessibility model (focus trap, Esc, scroll
   lock, restore focus) established by ContactModal.
   ──────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react';
import { useFunnel } from '@/store/funnel';
import {
  FUNNEL_STEPS,
  scopeOptionsFor,
  type FunnelOption,
  type LeadDetails,
} from '@/lib/funnel';
import { track } from '@/lib/analytics';
import styles from './QualifierModal.module.css';

type Status = 'idle' | 'sending' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_DETAILS: LeadDetails = { name: '', email: '', company: '', message: '' };

export function QualifierModal() {
  const open = useFunnel((s) => s.open);
  const step = useFunnel((s) => s.step);
  const answers = useFunnel((s) => s.answers);
  const closeFunnel = useFunnel((s) => s.closeFunnel);
  const next = useFunnel((s) => s.next);
  const back = useFunnel((s) => s.back);
  const setChoice = useFunnel((s) => s.setChoice);
  const toggleChoice = useFunnel((s) => s.toggleChoice);

  const [details, setDetails] = useState<LeadDetails>(EMPTY_DETAILS);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const current = FUNNEL_STEPS[step];
  const isLast = step === FUNNEL_STEPS.length - 1;
  const total = FUNNEL_STEPS.length;

  // Options for the current step — Scope resolves dynamically from the service.
  const options: FunnelOption[] =
    current?.kind === 'multi'
      ? scopeOptionsFor(answers.service as string | undefined)
      : current?.options ?? [];

  // Open side-effects: lock scroll, remember + restore focus, fire funnel_open.
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    track('funnel_open');
    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    }, 40);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      lastFocused.current?.focus?.();
    };
  }, [open]);

  // Reset transient UI when the modal closes.
  useEffect(() => {
    if (!open) {
      setStatus('idle');
      setError('');
      setShowErrors(false);
    }
  }, [open]);

  // Report each step view to analytics (drop-off funnel).
  useEffect(() => {
    if (open && current && status !== 'success') {
      track('funnel_step', { step: step + 1, step_id: current.id });
    }
  }, [open, step, current, status]);

  // Esc to close + focus trap so Tab stays inside the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeFunnel();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeFunnel]);

  if (!open || !current) return null;

  // ── Validation ────────────────────────────────────────────────────────────
  const detailsValid = details.name.trim().length > 0 && EMAIL_RE.test(details.email.trim());
  const stepValid = (() => {
    if (current.kind === 'single') return typeof answers[current.id] === 'string';
    if (current.kind === 'multi') {
      const v = answers[current.id];
      return Array.isArray(v) && v.length > 0;
    }
    return detailsValid;
  })();

  // ── Handlers ──────────────────────────────────────────────────────────────
  const advance = () => {
    if (!stepValid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    next();
  };

  const handleSingle = (optionId: string) => {
    setChoice(current.id, optionId);
    setShowErrors(false);
    // Auto-advance on single-select for a snappy, app-like feel.
    if (!isLast) window.setTimeout(() => next(), 180);
  };

  const submit = async () => {
    if (status === 'sending') return;
    if (!detailsValid) {
      setShowErrors(true);
      return;
    }
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, details }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        track('funnel_submit', {
          priority: json.priority ?? 'unknown',
          service: typeof answers.service === 'string' ? answers.service : '',
          budget: typeof answers.budget === 'string' ? answers.budget : '',
          timeline: typeof answers.timeline === 'string' ? answers.timeline : '',
        });
        setStatus('success');
      } else {
        setStatus('error');
        setError(json.message || 'Could not send right now. Please try again.');
      }
    } catch {
      setStatus('error');
      setError('Network error — please check your connection and try again.');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeFunnel();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="funnel-title"
      >
        <button type="button" className={styles.close} onClick={closeFunnel} aria-label="Close">
          ×
        </button>

        {status === 'success' ? (
          <div className={styles.success} role="status">
            <div className={styles.check} aria-hidden="true">
              ✓
            </div>
            <h2 id="funnel-title" className={styles.title}>
              Request received
            </h2>
            <p className={styles.subtitle}>
              Thanks{details.name ? `, ${details.name.split(' ')[0]}` : ''} — your project
              details are in. We&apos;ll review and reach out shortly.
            </p>
            <div className={styles.navRow}>
              <button type="button" className={styles.primary} onClick={closeFunnel}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className={styles.progress} aria-hidden="true">
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${((step + 1) / total) * 100}%` }}
                />
              </div>
              <span className={styles.progressLabel}>
                {step + 1} / {total}
              </span>
            </div>

            <p className={styles.eyebrow}>{current.eyebrow}</p>
            <h2 id="funnel-title" className={styles.title}>
              {current.title}
            </h2>
            {current.subtitle && <p className={styles.subtitle}>{current.subtitle}</p>}

            {/* Body */}
            {current.kind === 'details' ? (
              <div className={styles.form}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Name *</span>
                  <input
                    data-autofocus
                    className={styles.input}
                    type="text"
                    value={details.name}
                    placeholder="Your name"
                    autoComplete="name"
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Email *</span>
                  <input
                    className={styles.input}
                    type="email"
                    value={details.email}
                    placeholder="you@company.com"
                    autoComplete="email"
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Company</span>
                  <input
                    className={styles.input}
                    type="text"
                    value={details.company}
                    placeholder="Optional"
                    autoComplete="organization"
                    onChange={(e) => setDetails({ ...details, company: e.target.value })}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Anything else?</span>
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    value={details.message}
                    placeholder="A sentence or two about the project…"
                    onChange={(e) => setDetails({ ...details, message: e.target.value })}
                  />
                </label>
                {showErrors && !detailsValid && (
                  <p className={styles.errorMsg} role="alert">
                    Please enter your name and a valid email.
                  </p>
                )}
              </div>
            ) : (
              <div
                className={styles.options}
                role={current.kind === 'single' ? 'radiogroup' : 'group'}
              >
                {options.map((opt) => {
                  const selected =
                    current.kind === 'single'
                      ? answers[current.id] === opt.id
                      : Array.isArray(answers[current.id]) &&
                        (answers[current.id] as string[]).includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role={current.kind === 'single' ? 'radio' : 'checkbox'}
                      aria-checked={selected}
                      className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
                      onClick={() =>
                        current.kind === 'single'
                          ? handleSingle(opt.id)
                          : toggleChoice(current.id, opt.id)
                      }
                    >
                      {opt.glyph && (
                        <span className={styles.optionGlyph} aria-hidden="true">
                          {opt.glyph}
                        </span>
                      )}
                      <span className={styles.optionText}>
                        <span className={styles.optionLabel}>{opt.label}</span>
                        {opt.hint && <span className={styles.optionHint}>{opt.hint}</span>}
                      </span>
                      <span className={styles.optionMark} aria-hidden="true">
                        {selected ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {showErrors && current.kind === 'multi' && !stepValid && (
              <p className={styles.errorMsg} role="alert">
                Pick at least one option to continue.
              </p>
            )}
            {status === 'error' && (
              <p className={styles.errorMsg} role="alert">
                {error}
              </p>
            )}

            {/* Navigation */}
            <div className={styles.navRow}>
              {step > 0 ? (
                <button type="button" className={styles.secondary} onClick={back}>
                  ← Back
                </button>
              ) : (
                <span />
              )}

              {isLast ? (
                <button
                  type="button"
                  className={styles.primary}
                  onClick={submit}
                  disabled={status === 'sending' || !detailsValid}
                >
                  {status === 'sending' ? 'Sending…' : 'Submit request'}
                  <span aria-hidden="true">→</span>
                </button>
              ) : (
                // Single-select auto-advances, so its Next is a fallback;
                // multi-select needs an explicit Continue.
                <button
                  type="button"
                  className={styles.primary}
                  onClick={advance}
                  disabled={!stepValid}
                >
                  Continue
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
