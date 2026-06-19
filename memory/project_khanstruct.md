---
name: project-khanstruct
description: Core project context for the Khanstruct website rebuild — client, stack, architecture, dev commands
metadata:
  type: project
---

## Client
Zain Khan — Founder & AI Engineer, Khanstruct. Based in Tulsa, Oklahoma.
Email: zain@thekhanstruct.com

## Project Status (2026-06-18)
Complete rebuild from single index.html → full Next.js 14 production app.
All pages built, TypeScript clean, production build passes, 19 unit tests pass.

**Why:** Client requested complete rebuild into production-quality, animation-driven digital experience with Three.js Earth and GDG Tulsa page.

**How to apply:** Continue from current codebase in src/. Do not suggest returning to single HTML file.

## Tech Stack
- Next.js 14 (App Router), React 18, TypeScript strict
- Custom WebGL canvas renderer (single persistent canvas, no R3F — peer dep conflict with React 18/19)
- GSAP for DOM timelines
- Zustand for experience state
- CSS Modules + Tailwind CSS + CSS custom properties
- Vitest (unit tests), Playwright (e2e specs written, not yet run against live server)

## Dev Commands
- `npm run dev` → http://localhost:3000
- `npm run build` → production build
- `npm run type-check` → TypeScript validation
- `npm test` → 19 Vitest unit tests

## Site Structure
- `/` → Homepage (Hero + Marquee + Services + Metrics + Projects + GDGFeature + About + ContactCTA)
- `/gdg-tulsa` → GDG Tulsa page (Hero + Mission + Events + FocusAreas + GetInvolved + FinalCTA)
- `/projects` → Project index (all 6 projects)
- `/projects/[slug]` → Project detail (6 static routes pre-generated)

## Design Tokens
Dark premium technical palette. Lime accent (#d7ff3f) used selectively.
All tokens in src/app/globals.css as CSS custom properties.

## Content
All content in src/lib/content.ts. Key items:
- 6 projects (3 featured on homepage): Cortana, Blueprint, Gemini Marketing Taskforce, NASA Space Apps, Health EHR Dashboard, Cortana MapLens
- 4 experience entries: Khanstruct, R-Cubed, Trulo Homes, Rose Rock Development
- 8 hackathons (Devpost Level 6, $3M+ prize pools)
- GDG_EVENTS array is empty — client must populate with real event data
- Unverified metrics flagged with verified: false

## Canvas Architecture
One canvas element fixed to viewport, z-index 0, aria-hidden.
WebGLCanvasRenderer class in ExperienceCanvas.tsx handles:
- Background particles (quality-adaptive: 40/70/120)
- Earth particle system with geographic continent approximation (~1000–3000 pts)
- Formation animation (scatter → globe, ~250 frames)
- Section-aware rendering, pause on hidden, DPR cap 1.5×
Experience state in src/store/experience.ts (Zustand)

## Remaining Placeholders
- Project cover images need real photos (currently showing letter placeholders)
- GDG_EVENTS is empty (waiting on client)  
- GDG_METRICS marked verified: false (need independent verification)
- photo.jpg already in repo root (portrait photo)
- LinkedIn URL for GDG Tulsa community page needs verification
- Discord link is placeholder '#' — needs real URL
