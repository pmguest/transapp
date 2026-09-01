# Project State

## Current Facts

| Item | Value | Set on |
| ---- | ----- | ------ |
| Product name | transapp | 2026-09-01 |
| Website framework | Astro 7.2.10 + Tailwind CSS 4 | 2026-09-01 |
| Website package location | packages/website | 2026-09-01 |
| Website dev server | `npm run dev -w website` (default port 4321) | 2026-09-01 |
| Waitlist provider | Buttondown (embed snippet not yet supplied) | 2026-09-01 |

## Log

### 2026-09-01 — Project initialized

- Created project root at C:\Users\peter\Desktop\transapp
- Added AGENTS.md (project protocol, downloaded from shipacademy.com/AGENTS.md)
- Added CLAUDE.md (points to AGENTS.md)
- Added this PROJECT-STATE.md log
- STOPPED — no tutorial/course step started yet

### 2026-09-01 — Astro website bootstrapped, homepage built

- Scaffolded Astro (minimal template, TypeScript strict) into packages/website
  via `create-astro`, renamed its package.json to `website` to match the
  workspace
- Added Tailwind CSS 4 via `astro add tailwind` (Vite plugin, `src/styles/global.css`)
- Built `src/layouts/Layout.astro` (Source Serif 4 + Inter via Google Fonts)
  and shared `Nav`/`Footer` components
- Wrote homepage copy (`src/pages/index.astro`) adapted from the user's
  "Our Story" About Us draft: problem statement, founder story, beliefs,
  product mechanism (3-model consensus, glossaries, memory, human gateway),
  improvised testimonials and a 3-tier pricing table (all marked as
  placeholders for the user to replace with real figures/quotes), mission
  section, and a waitlist CTA
- Added `src/components/WaitlistForm.astro` — Buttondown-shaped embed form
  (field names match Buttondown's expected `email`/`embed` inputs) with the
  action URL left as `REPLACE_WITH_USERNAME` until the real snippet is
  supplied
- Verified with `astro build` (succeeds) and a local `astro dev` smoke check
  (200 response, hero copy present)
- STOPPED — waiting on: (1) real Buttondown embed snippet, (2) user review
  of improvised testimonials/pricing before anything ships publicly
