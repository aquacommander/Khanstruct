# Khanstruct

Production-quality website for Zain Khan / Khanstruct — Design. Data. AI Implementation.

## Stack

- **Next.js 14** (App Router)
- **React 18** + TypeScript (strict)
- **Zustand** — typed global experience state
- **CSS Modules** + **Tailwind CSS** — design token system
- **Vitest** — unit tests
- **Playwright** — E2E browser tests

---

## Setup

```bash
npm install
npm run dev       # http://localhost:3000
```

Copy `.env.example` to `.env.local` and fill in the keys you need. Every
variable is optional in development — the contact form and lead funnel
degrade gracefully when their keys are absent.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run type-check` | TypeScript validation |
| `npm run lint` | ESLint check |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright e2e tests (requires running dev server) |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Khanstruct homepage |
| `/work` | Media gallery / showreel |
| `/projects` | Project index |
| `/projects/[slug]` | Individual project detail |
| `/domains` | Domain index |
| `/domains/ai-agents` | AI agents directory |
| `/domains/aerospace` | Aerospace domain page |
| `/domains/neuroscience` | Neuroscience domain page |
| `POST /api/lead` | Funnel lead → Notion CRM (see below) |

---

## Architecture

### Experience state (`src/components/canvas/`, `src/store/experience.ts`)

The site originally shipped a persistent WebGL canvas with an Earth particle
system. That renderer was **removed** in favor of static SVG and CSS visuals.
What remains is `ExperienceProvider`, a lightweight client provider that syncs
the user's `prefers-reduced-motion` preference into the Zustand store.

```ts
type ExperienceSection = 'hero' | 'services' | 'metrics' | 'projects' | 'gdg' | 'about' | 'contact';
type QualityTier = 'high' | 'medium' | 'low';
```

Some fields on the store (`quality`, `webglAvailable`, `earthFormed`) are
vestigial from the WebGL era and are kept only so existing components compile.

### Lead funnel (`src/lib/funnel.ts`, `src/app/api/lead/route.ts`)

`QualifierModal` collects answers, scores them into a priority tier, and
delivers the lead twice:

1. **Email** — client-side via Web3Forms (their free tier rejects server-side
   submissions), using `NEXT_PUBLIC_WEB3FORMS_KEY`.
2. **Notion CRM** — server-side via `POST /api/lead`, dormant until
   `NOTION_TOKEN` and `NOTION_DB_ID` are set. Failures are logged with the full
   lead summary so nothing is lost. The route is rate limited to 5 submissions
   per IP per hour (in-memory, per instance).

To change the CRM column mapping, edit `notionProperties()` in the route.

### Design Tokens (`src/app/globals.css`)

Dark, card-driven landing aesthetic — near-black neutral background, lime accent,
warm amber hero-orb glow. Sections use a centered eyebrow-pill + heading pattern,
rounded card surfaces, and rounded buttons.

```css
--color-bg: #07070a
--color-bg-elevated: #0c0c11
--color-panel: #0e0e13
--color-accent: #d7ff3f        /* lime */
--color-warm: #ffb347          /* hero-orb core glow */
--color-text: #f3f3f0
--color-text-muted: #8a8a96
--color-border: rgba(255,255,255,0.07)
--radius: 16px                 /* card radius; --radius-sm 10px, --radius-lg 24px, --radius-pill 100px */
```

### Content (`src/lib/content.ts`)

All site copy lives in a single typed config file. Never fabricated:

- `PROJECTS`, `EXPERIENCE`, `HACKATHONS`, `METRICS`, `SERVICES`, `NAV_ITEMS`
- Unverified metrics flagged with `verified: false`

### Media (`src/lib/generated/media.ts`, `scripts/`)

Gallery media lives in Cloudflare R2, not in the repo. `scripts/ingest.mjs`
uploads files to R2; `scripts/gen-manifest.mjs` regenerates the committed
`src/lib/generated/media.ts` manifest. See `scripts/README.md`.

---

## Content Editing

### Adding a Project

Edit `src/lib/content.ts` — add to the `PROJECTS` array:

```ts
{
  slug: 'my-project',       // URL: /projects/my-project
  title: 'My Project',
  category: 'AI Agent',
  summary: 'One paragraph summary.',
  problem: '...',
  solution: '...',
  outcome: '...',           // Do not fabricate outcomes
  technologies: ['React', 'Python'],
  coverImage: '/images/project-my-project.jpg',
  visualTheme: 'dark-blue',
  accentColor: '#4a9eff',
  featured: true,           // Show on homepage
  verifiedLinks: [
    { label: 'GitHub', url: 'https://...' }
  ],
}
```

### Updating Metrics

In `src/lib/content.ts`, set `verified: true` only when the metric is
independently verifiable.

---

## Asset Replacement

### Portrait Photo
Replace `public/photo.jpg` — referenced in `src/components/home/About.tsx`.

### Project Covers
Add images to `public/images/` matching each project's `coverImage` field.
The current components use a placeholder initial letter until real images are available.

---

## Accessibility

- Skip-to-content link (focus-visible, styled)
- Semantic landmarks: `header[role="banner"]`, `main`, `footer[role="contentinfo"]`, `nav[aria-label]`
- Heading hierarchy enforced (h1 → h2 → h3)
- All interactive elements keyboard-accessible
- Mobile menu: `aria-expanded`, `aria-controls`, `role="dialog"`, `aria-modal`
- `prefers-reduced-motion`: disables the marquee and scroll cues
- Native system cursor throughout — no custom cursor to obscure pointer affordances

---

## CI

`.github/workflows/ci.yml` runs `type-check`, `lint`, and `npm test` on every
push to `main` and every pull request. E2E tests are not run in CI (they need a
live server) — run them locally before shipping visual changes.

---

## Troubleshooting

**Fonts not loading** — Google Fonts loaded via `next/font/google`. No manual font files needed.

**Build fails on TypeScript** — Run `npm run type-check` for detailed output. Test files are excluded from the main tsconfig, so `npm test` can still surface type errors that `type-check` misses.

**Leads not reaching Notion** — The route is a no-op until both `NOTION_TOKEN` and `NOTION_DB_ID` are set, and logs a warning when they aren't. Check that the Notion integration is connected to the CRM database.

**E2E tests fail** — Playwright requires the dev server running on port 3000. Run `npm run dev` in one terminal, then `npm run test:e2e` in another.
