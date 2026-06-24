/* ════════════════════════════════════════════════════════════════════════
   LEAD QUALIFIER — the data + logic behind the "Start a project" funnel.

   This is the intake funnel Zain asked for: instead of an open-ended contact
   form, a visitor self-selects what they want, how soon they need it, and what
   they can spend. From those answers we compute a PRIORITY (Hot / Warm / Cold)
   so leads arrive pre-qualified and ranked — the whole point being to spend
   time only on the highest-value work.

   The wizard (QualifierModal) is driven entirely by the STEPS array below, so
   questions can be added/reordered without touching component code.
   ──────────────────────────────────────────────────────────────────────── */

// ─── Types ──────────────────────────────────────────────────────────────────

/** A selectable card option within a step. */
export interface FunnelOption {
  id: string;
  label: string;
  /** One-line clarification shown under the label. */
  hint?: string;
  /** Optional emoji/glyph rendered in the option's icon slot. */
  glyph?: string;
  /** Weight added to the lead score when chosen (budget/urgency steps). */
  score?: number;
}

export type StepKind = 'single' | 'multi' | 'details';

export interface FunnelStep {
  id: string;
  /** Short eyebrow label (mono, uppercase). */
  eyebrow: string;
  title: string;
  subtitle?: string;
  kind: StepKind;
  /** Options for single/multi steps. `details` steps render the contact form. */
  options?: FunnelOption[];
  /** Whether the visitor must answer before advancing (default true). */
  required?: boolean;
}

/** The accumulating answer set, keyed by step id. */
export interface FunnelAnswers {
  // single-select steps store the chosen option id; multi store an id array.
  [stepId: string]: string | string[] | undefined;
}

/** The lead contact payload captured on the final step. */
export interface LeadDetails {
  company?: string;
  name: string;
  email: string;
  phone?: string;
}

export type LeadPriority = 'hot' | 'warm' | 'cold';

// ─── Funnel definition ──────────────────────────────────────────────────────

export const SERVICE_OPTIONS: FunnelOption[] = [
  {
    id: 'content',
    label: 'Content Creation',
    hint: 'AI video, social, YouTube & brand reels',
    glyph: '🎬',
  },
  {
    id: 'ai',
    label: 'AI Implementation',
    hint: 'Agents, automation & custom models',
    glyph: '🤖',
  },
  {
    id: 'design',
    label: 'Design & Web',
    hint: 'Sites, product UI & brand systems',
    glyph: '✷',
  },
  {
    id: 'data',
    label: 'Data Systems',
    hint: 'Pipelines, dashboards & structured data',
    glyph: '◫',
  },
];

/** Scope sub-options, namespaced by the service chosen in step 1. */
export const SCOPE_OPTIONS: Record<string, FunnelOption[]> = {
  content: [
    { id: 'youtube', label: 'YouTube channel', glyph: '▶' },
    { id: 'social', label: 'Instagram / Reels', glyph: '◎' },
    { id: 'ai-video', label: 'AI-generated video', glyph: '✦' },
    { id: 'brand-content', label: 'Brand & campaign content', glyph: '◈' },
  ],
  ai: [
    { id: 'agent', label: 'AI agent / assistant', glyph: '◆' },
    { id: 'automation', label: 'Workflow automation', glyph: '⟳' },
    { id: 'rag', label: 'Knowledge / RAG system', glyph: '◇' },
    { id: 'integration', label: 'AI into existing product', glyph: '⊹' },
  ],
  design: [
    { id: 'website', label: 'Marketing website', glyph: '▤' },
    { id: 'product-ui', label: 'Product UI / app', glyph: '▥' },
    { id: 'landing', label: 'Landing / funnel page', glyph: '▦' },
    { id: 'brand', label: 'Brand & design system', glyph: '◐' },
  ],
  data: [
    { id: 'pipeline', label: 'Data pipeline', glyph: '⇄' },
    { id: 'dashboard', label: 'Dashboard & reporting', glyph: '▧' },
    { id: 'crm', label: 'CRM / normalization', glyph: '⊞' },
    { id: 'architecture', label: 'Data architecture', glyph: '▨' },
  ],
};

export const TIMELINE_OPTIONS: FunnelOption[] = [
  { id: 'now', label: 'Right now', hint: 'Ready to start immediately', glyph: '⚡', score: 3 },
  { id: 'soon', label: 'Within 2 weeks', hint: 'Planning to start shortly', glyph: '◷', score: 2 },
  { id: 'quarter', label: '1–2 months', hint: 'On the near-term roadmap', glyph: '◔', score: 1 },
  { id: 'exploring', label: 'Just exploring', hint: 'Gathering options for later', glyph: '◌', score: 0 },
];

export const BUDGET_OPTIONS: FunnelOption[] = [
  { id: 'under-1k', label: 'Under $1k', glyph: '·', score: 0 },
  { id: '1-5k', label: '$1k – $5k', glyph: '◦', score: 1 },
  { id: '5-15k', label: '$5k – $15k', glyph: '●', score: 2 },
  { id: '15k-plus', label: '$15k+', glyph: '◉', score: 3 },
  { id: 'unsure', label: 'Not sure yet', hint: 'Open to a recommendation', glyph: '?', score: 1 },
];

export const FUNNEL_STEPS: FunnelStep[] = [
  {
    id: 'service',
    eyebrow: 'Step 1',
    title: 'What can we build for you?',
    subtitle: 'Pick the area closest to what you have in mind.',
    kind: 'single',
    options: SERVICE_OPTIONS,
  },
  {
    id: 'scope',
    eyebrow: 'Step 2',
    title: 'What does it involve?',
    subtitle: 'Choose everything that applies — this shapes the proposal.',
    kind: 'multi',
    // options resolved dynamically from the service answer (see scopeOptionsFor)
  },
  {
    id: 'timeline',
    eyebrow: 'Step 3',
    title: 'How soon do you need it?',
    subtitle: 'This helps us prioritise and reserve capacity.',
    kind: 'single',
    options: TIMELINE_OPTIONS,
  },
  {
    id: 'budget',
    eyebrow: 'Step 4',
    title: "What's the budget?",
    subtitle: 'A range is fine — it keeps the scope realistic.',
    kind: 'single',
    options: BUDGET_OPTIONS,
  },
  {
    id: 'details',
    eyebrow: 'Step 5',
    title: 'Where should we reach you?',
    subtitle: 'Add anything else we should know about the project.',
    kind: 'details',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Resolve the scope options for the service the visitor picked. */
export function scopeOptionsFor(serviceId: string | undefined): FunnelOption[] {
  if (!serviceId) return [];
  return SCOPE_OPTIONS[serviceId] ?? [];
}

/** Human label for any option id, searching every option pool. */
export function labelFor(id: string): string {
  const pools = [
    SERVICE_OPTIONS,
    ...Object.values(SCOPE_OPTIONS),
    TIMELINE_OPTIONS,
    BUDGET_OPTIONS,
  ];
  for (const pool of pools) {
    const match = pool.find((o) => o.id === id);
    if (match) return match.label;
  }
  return id;
}

/** Sum the score of a single-select answer against its option pool. */
function scoreOf(pool: FunnelOption[], answer: string | string[] | undefined): number {
  if (typeof answer !== 'string') return 0;
  return pool.find((o) => o.id === answer)?.score ?? 0;
}

/**
 * Rank a lead from its answers. Budget and urgency drive the score; the result
 * maps to a priority Zain can triage on at a glance.
 *   Hot  — strong budget AND ready soon (chase today)
 *   Warm — meaningful budget or urgency (worth a conversation)
 *   Cold — exploratory / low budget (nurture later)
 */
export function scoreLead(answers: FunnelAnswers): { score: number; priority: LeadPriority } {
  const score = scoreOf(BUDGET_OPTIONS, answers.budget) + scoreOf(TIMELINE_OPTIONS, answers.timeline);
  const priority: LeadPriority = score >= 5 ? 'hot' : score >= 3 ? 'warm' : 'cold';
  return { score, priority };
}

export const PRIORITY_META: Record<LeadPriority, { label: string; color: string }> = {
  hot: { label: 'High priority', color: '#ff7849' },
  warm: { label: 'Warm lead', color: '#d7ff3f' },
  cold: { label: 'Exploratory', color: '#6aa9ff' },
};

/** Build a readable, scannable summary of the lead for the notification email. */
export function buildLeadSummary(answers: FunnelAnswers, details: LeadDetails): string {
  const service = typeof answers.service === 'string' ? labelFor(answers.service) : '—';
  const scope = Array.isArray(answers.scope) ? answers.scope.map(labelFor).join(', ') : '—';
  const timeline = typeof answers.timeline === 'string' ? labelFor(answers.timeline) : '—';
  const budget = typeof answers.budget === 'string' ? labelFor(answers.budget) : '—';
  const { score, priority } = scoreLead(answers);

  return [
    `Priority: ${PRIORITY_META[priority].label} (score ${score}/6)`,
    `Service: ${service}`,
    `Scope: ${scope}`,
    `Timeline: ${timeline}`,
    `Budget: ${budget}`,
    '',
    `Company: ${details.company || '—'}`,
    `Name: ${details.name}`,
    `Email: ${details.email}`,
    `Phone: ${details.phone || '—'}`,
  ].join('\n');
}
