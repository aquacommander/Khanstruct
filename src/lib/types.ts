// ─── Experience & Canvas ───────────────────────────────────────────────────

export type ExperienceSection =
  | 'hero'
  | 'services'
  | 'metrics'
  | 'projects'
  | 'gdg'
  | 'about'
  | 'contact';

export type QualityTier = 'high' | 'medium' | 'low';
export type RouteTransition = 'idle' | 'to-gdg' | 'to-home';

export interface ExperienceState {
  activeSection: ExperienceSection;
  sectionProgress: number;
  pageProgress: number;
  pointer: { x: number; y: number };
  routeTransition: RouteTransition;
  reducedMotion: boolean;
  quality: QualityTier;
  webglAvailable: boolean;
  earthFormed: boolean;
  activeService: 'design' | 'data' | 'ai' | null;
  /** True once the System Initialization loader hands off to the page. Gates the hero entrance. */
  introDone: boolean;
}

// ─── Content ──────────────────────────────────────────────────────────────

export interface Metric {
  value: string;
  label: string;
  numericTarget?: number;
  verified: boolean;
  note?: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
  technologies: string[];
  coverImage: string;
  visualTheme: string;
  accentColor: string;
  featured: boolean;
  verifiedLinks: { label: string; url: string }[];
}

export interface Experience {
  id: string;
  period: string;
  company: string;
  role: string;
  description: string;
  tags: string[];
  location: string;
}

export interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  year: string;
  prizePool?: string;
  participants?: string;
  project: string;
  inPerson?: boolean;
  location?: string;
}

export interface GDGEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location: string;
  description: string;
  registrationUrl: string;
  coordinates?: { lat: number; lng: number };
  status: 'upcoming' | 'past' | 'canceled';
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface ServiceCapability {
  icon: string;
  label: string;
}

export interface Service {
  id: 'design' | 'data' | 'ai';
  title: string;
  description: string;
  capabilities: ServiceCapability[];
  accentColor: string;
}

// ─── Media Gallery (Showreel) ───────────────────────────────────────────────

export interface MediaCategoryDef {
  id: string;
  label: string;
}

export type MediaKind = 'image' | 'video';
export type MediaAspect = 'portrait' | 'landscape' | 'square';

/**
 * One project in the gallery — a dated, categorised entry with a cover and a
 * set of images (its album). The whole gallery is driven by an array of these,
 * generated from the R2 content structure (year/month/date/category/project)
 * by scripts/gen-manifest.mjs, so categories, ordering, and content are data —
 * not code.
 */
export interface MediaItem {
  id: string;
  title: string;
  /** Category slug — the filter id (e.g. 'ai-tooling'). */
  category: string;
  /** Category display name (e.g. 'AI Tooling'). */
  categoryName: string;
  /** ISO date 'YYYY-MM-DD' — drives newest-first ordering + month grouping. */
  date?: string;
  kind: MediaKind;
  /** Cover thumbnail URL (the project's _Preview image). */
  thumb: string;
  /** Ordered full-size image URLs shown in the lightbox (the album). */
  images: string[];
  aspect?: MediaAspect;
  description?: string;
  tags?: string[];
  /** Surfaced in the homepage curated reel when true. */
  featured?: boolean;
}
