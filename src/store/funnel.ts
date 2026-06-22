import { create } from 'zustand';
import type { FunnelAnswers } from '@/lib/funnel';

/**
 * Drives the "Start a project" lead-qualifier funnel. The wizard
 * (QualifierModal) is rendered once in the root layout and opened from any
 * "Start a project" button via openFunnel(). State persists across open/close
 * within a session so a visitor who closes mid-funnel can resume; reset() wipes
 * it after a successful submit.
 */
interface FunnelStore {
  open: boolean;
  /** Zero-based index into FUNNEL_STEPS. */
  step: number;
  answers: FunnelAnswers;
  openFunnel: () => void;
  closeFunnel: () => void;
  setStep: (step: number) => void;
  next: () => void;
  back: () => void;
  /** Set a single-select answer. */
  setChoice: (stepId: string, optionId: string) => void;
  /** Toggle a value within a multi-select answer. */
  toggleChoice: (stepId: string, optionId: string) => void;
  reset: () => void;
}

export const useFunnel = create<FunnelStore>((set) => ({
  open: false,
  step: 0,
  answers: {},
  openFunnel: () => set({ open: true }),
  closeFunnel: () => set({ open: false }),
  setStep: (step) => set({ step }),
  next: () => set((s) => ({ step: s.step + 1 })),
  back: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
  setChoice: (stepId, optionId) =>
    set((s) => ({ answers: { ...s.answers, [stepId]: optionId } })),
  toggleChoice: (stepId, optionId) =>
    set((s) => {
      const current = Array.isArray(s.answers[stepId]) ? (s.answers[stepId] as string[]) : [];
      const nextVal = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { answers: { ...s.answers, [stepId]: nextVal } };
    }),
  reset: () => set({ step: 0, answers: {} }),
}));
