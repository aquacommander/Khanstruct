export interface Domain {
  href: string;
  label: string;
  /** Roman-ish index shown as oversized type behind the panel. */
  index: string;
  emoji: string;
  description: string;
  /** One-line hook used in the immersive panel. */
  hook: string;
  color: string;
  status: 'Live' | 'Coming Soon';
  field: 'neural' | 'agents' | 'orbital';
}

export const DOMAINS: Domain[] = [
  {
    href: '/domains/neuroscience',
    label: 'Neuroscience',
    index: '01',
    emoji: '🧠',
    description:
      'Exploring cognitive science, neural systems, and the science of human performance and behavior.',
    hook: 'How thinking actually works.',
    color: '#c084fc',
    status: 'Coming Soon',
    field: 'neural',
  },
  {
    href: '/domains/ai-agents',
    label: 'AI Agents',
    index: '02',
    emoji: '⚡',
    description:
      'A curated directory of leading AI agent platforms and tools spanning every category and use case.',
    hook: 'Every agent worth knowing, mapped.',
    color: '#d7ff3f',
    status: 'Live',
    field: 'agents',
  },
  {
    href: '/domains/aerospace',
    label: 'Aerospace',
    index: '03',
    emoji: '🚀',
    description:
      'Tracking innovations in aerospace technology, space exploration, and next-generation propulsion.',
    hook: 'Getting further, for less.',
    color: '#86efac',
    status: 'Coming Soon',
    field: 'orbital',
  },
];
