# Project State

## Current Facts

| Item | Value | Set on |
| ---- | ----- | ------ |
| Product name | transapp | 2026-09-01 |
| Website framework | Astro 7.2.10 + Tailwind CSS 4 | 2026-09-01 |
| Website package location | packages/website | 2026-09-01 |
| Website dev server | `npm run dev -w website` (default port 4321) | 2026-09-01 |
| Waitlist provider | Buttondown (embed snippet not yet supplied) | 2026-09-01 |
| Homepage design variations | 5 live: Signal `/` (primary, indexable), Ember `/ember`, Cipher `/cipher`, Anchor `/anchor`, Ledger `/ledger` (noindex) — switcher in every footer | 2026-09-05 |
| `/variation` skill | `.claude/skills/variation/SKILL.md` — generates a new homepage variation from a style/brand prompt, append-only to the switcher, never touches existing variations | 2026-09-02 |
| Vercel CLI | Installed globally (`npm i -g vercel`), logged in as `guestpeter7-3331` | 2026-09-05 |
| Website Vercel project | `pmg13/transapp-website`, Root Directory setting = `packages/website` (deploys only the website, not the app); linked (`.vercel/`) both at the monorepo root and inside `packages/website` — manual/CLI deploys must run with cwd at the monorepo **root** (`vercel deploy --prod --cwd <repo root>`) so the Root Directory setting resolves correctly; running the CLI from inside `packages/website` itself double-nests the path and fails | 2026-09-05 |
| Website production URL | https://transapp-website.vercel.app | 2026-09-05 |
| Pipeline architecture doc | `PIPELINE-ARCHITECTURE.md` (repo root) — 9-stage spec for `packages/app` | 2026-09-10 |
| App package framework | React 19 + TypeScript + Vite 8 (replaced Next.js same day — see log) | 2026-09-10 |
| App package location | packages/app | 2026-09-10 |
| App dev server | `npm run dev -w app` (default port 5173) | 2026-09-10 |
| App database | Supabase — schema in `packages/app/supabase/migrations/`; no live project linked yet | 2026-09-10 |
| App Vercel project | `pmg13/transapp-app`, Root Directory setting = `packages/app`, framework preset `vite` — separate project from `transapp-website`, GitHub-connected; linked (`.vercel/`) inside `packages/app` only (root `.vercel/` stays linked to `transapp-website`, untouched) — manual/CLI deploys of the app run from the monorepo **root** with `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` env vars set to the app project's IDs (`vercel project ls`/`packages/app/.vercel/project.json` has them), e.g. `VERCEL_ORG_ID=<id> VERCEL_PROJECT_ID=<id> vercel deploy --prod --cwd <repo root>` — same root-directory-join quirk as the website, but env vars avoid having to relink root away from the website project each time; Production Branch = `main`, confirmed auto-deploying on push (same as the website) | 2026-09-10 |
| Git branch for auto-deploy | `main` — both Vercel projects' Production Branch. As of 2026-09-10 `main` is fast-forwarded to match `website/homepage`; push to `main` to trigger production deploys of both website and app going forward | 2026-09-10 |
| Supabase project | ref `huukyfxnwvytklivafck`; URL/publishable key and a personal access token (`SUPABASE_ACCESS_TOKEN`) live in `packages/app/.env` (gitignored) — no values recorded here per this file's own rule | 2026-09-10 |
| Supabase auth setting | `mailer_autoconfirm: true` — email confirmation is **off** for new signups on the live project (changed via Management API this session) | 2026-09-10 |
| Supabase auth URLs | `site_url` = `https://transapp-app.vercel.app`; `uri_allow_list` includes `http://localhost:5173` and `https://transapp-app.vercel.app` (both bare and `/**`) — fixes redirect-based auth flows (email confirmation links, password resets, any future OAuth) generally, not tied to any one feature | 2026-09-10 |
| App production URL | https://transapp-app.vercel.app | 2026-09-10 |

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

### 2026-09-02 — Homepage design variations + switcher

- Named the original homepage design "Ledger" (stays at `/`, unchanged
  content, `src/pages/index.astro`)
- Added `src/components/VariationSwitcher.astro` — single source of truth
  for the list of variations (slug/label/href); renders a pill-nav that
  highlights the active page via `Astro.url.pathname`
- Added `noindex` prop to `Layout.astro` so draft variation pages emit
  `<meta name="robots" content="noindex, nofollow">` (only Ledger is
  meant to be indexed once one design ships)
- Built 3 new full-page variations, each its own file, own copy, own
  layout — no shared Nav/Footer with Ledger, only the WaitlistForm and
  VariationSwitcher are reused:
  - `src/pages/minimal.astro` — monochrome, hairline dividers, no cards,
    terse copy, single email-capture CTA
  - `src/pages/modern.astro` — dark SaaS look: gradient text, glow blobs,
    glassmorphism cards, stat strip, gradient pill CTAs
  - `src/pages/engaging.astro` — michellebrody.com-style: soft sky-blue
    palette, curved SVG blob shapes, rounded-3xl cards, circular
    avatar/emoji placeholders, warm first-person copy, symmetric
    two-column "For your team / For your clients" section
- Every variation's footer carries the same VariationSwitcher so any page
  can jump to any other
- Verified with `astro build` (4/4 pages built) and confirmed all 4 routes
  return 200 with the switcher present
- STOPPED — waiting on user to review the 3 new variations in-browser and
  pick a direction (or request further iteration)

### 2026-09-02 — Variations removed, Ledger only

- User decided against the variation-switcher approach; removed it
- Deleted `src/pages/minimal.astro`, `src/pages/modern.astro`,
  `src/pages/engaging.astro`, `src/components/VariationSwitcher.astro`
- Reverted `src/components/Footer.astro` and `src/layouts/Layout.astro`
  (`git checkout --`) back to their pre-variation state — no switcher, no
  `noindex` prop
- Verified with `astro build` — only `/index.html` (Ledger) generated
- STOPPED — homepage is back to a single design at `/`, waiting on the
  same items as before: (1) real Buttondown embed snippet, (2) user review
  of improvised testimonials/pricing

### 2026-09-02 — Homepage design variations + switcher, take two

- User asked for the variation-switcher approach again, this time explicitly
  modern/sans-serif/colour-forward; re-built from scratch (nothing from the
  earlier attempt was ever committed, so there was nothing to recover)
- Kept the original homepage as-is, named it "Ledger" (stays at `/`,
  unchanged content, `src/pages/index.astro`)
- Added `src/components/VariationSwitcher.astro` — single source of truth
  for the list of variations (slug/label); self-styled white pill-nav
  (works on any page background), highlights the active page via
  `Astro.url.pathname`. Wired into `src/components/Footer.astro` (so
  Ledger picks it up automatically) and into each new variant's own footer
- Re-added `noindex` prop to `Layout.astro` (`<meta name="robots"
  content="noindex, nofollow">` when true) so draft variants aren't
  indexed; only Ledger is indexable
- Added Manrope, Space Grotesk, and Sora to the Google Fonts link already
  in `Layout.astro` (alongside the existing Source Serif 4 + Inter) so
  each variant could pick its own sans-serif headline face without
  touching the shared layout file
- Built 3 new full-page variations via parallel subagents (each wrote only
  its own new page file — no shared Nav/Footer with Ledger, only
  `WaitlistForm` and `VariationSwitcher` reused, own original copy from a
  shared product-facts brief, own colour palette, own font pairing):
  - `src/pages/meridian.astro` — flat, corporate-serious enterprise-SaaS
    feel; teal/emerald (`#0d9488`/`#065f46`) on near-white, Manrope
    headlines, thin 1px borders, no gradients/shadows/glass
  - `src/pages/vector.astro` — precise, technical dev-tool feel; indigo
    (`#4f46e5`) with a sparing amber highlight accent on white, Space
    Grotesk headlines, dot-grid hero texture, asymmetric off-grid stat
    panel, hairline-divided card grids
  - `src/pages/signal.astro` — bold, editorial "signal vs. noise" feel;
    alternating near-black (`#111114`)/white sections with a single amber
    (`#f59e0b`) accent, Sora headlines, sharp geometric accents only
- Fixed a pre-existing bug in `src/components/WaitlistForm.astro`: the
  email input's `id`/`for` was hardcoded (`bd-email`), which silently
  broke label association whenever a page used the form more than once
  (already true on Ledger; now also true 2-3x per new variant). Now
  generates a unique id per render via `crypto.randomUUID()`
- Verified with `astro build` (4/4 pages built, no errors) and confirmed:
  Ledger has no `noindex` tag, all 3 variants do; the switcher (all 4
  labels) renders on every page; dev server serves all 4 routes
- Could not do a visual/browser check — Claude in Chrome extension wasn't
  connected this session
- STOPPED — waiting on user to review all 4 designs in-browser
  (`npm run dev -w website`, routes `/`, `/meridian`, `/vector`,
  `/signal`) and pick a direction, plus the still-outstanding items: (1)
  real Buttondown embed snippet, (2) user review of improvised
  testimonials/pricing

### 2026-09-02 — `/variation` skill added; narrowed to Signal-family variants

- Added `.claude/skills/variation/SKILL.md` — a reusable skill (triggers on
  "new variation", "another variation", or `/variation`) that generates one
  new homepage variation from a style/brand prompt given at invocation
  time. It reads the live `VariationSwitcher.astro` array as the source of
  truth, writes the new page as its own file (reusing only `Layout`,
  `WaitlistForm`, `VariationSwitcher`), appends one entry to the switcher
  array, and is explicitly forbidden from editing any other page file,
  `Footer.astro`, `Nav.astro`, or `global.css` (a Google Fonts `<link>` add
  in `Layout.astro` is allowed only additively, if a genuinely new typeface
  is needed). Confirmed with the user that the switcher approach is settled
  for now (to be removed later, not yet)
- User decided Meridian and Vector didn't hit the mark; kept Signal and
  asked for 3 more variations riffing on Signal's bold/serious/editorial
  direction, discarding Meridian/Vector but keeping Ledger (confirmed
  explicitly — "discard the others" meant the other *variation* drafts, not
  the original homepage)
- Deleted `src/pages/meridian.astro` and `src/pages/vector.astro`
- Updated `src/components/VariationSwitcher.astro`'s `variations` array to:
  Ledger `/`, Signal `/signal`, Beacon `/beacon`, Pulse `/pulse`, Relay
  `/relay`
- Built 3 new Signal-family variations via parallel subagents (each read
  `signal.astro` first, then wrote only its own new page file — varied
  colour, typeface, and layout from Signal and from each other per the
  user's request):
  - `src/pages/beacon.astro` — warm charcoal `#1c1512` + coral-red
    `#f2495a` accent on cream `#fdf5ee`, Space Grotesk headlines,
    asymmetric split-screen hero with an oversized offset "3×" stat card,
    mostly light with only 2 dark sections (mechanism + final CTA)
  - `src/pages/pulse.astro` — predominantly light/white with a single
    electric-blue `#0ea5e9`/`#0369a1` accent, Manrope headlines, single
    flowing editorial column (no boxed cards) divided by an inline-SVG
    "pulse line" (heartbeat trace) motif instead of Signal's solid-colour
    dividers; only the final CTA is dark (`#0b1220`)
  - `src/pages/relay.astro` — off-white paper `#f4f4f2` + near-black
    `#18181b` with a violet `#7c3aed` accent (lime `#84cc16` on the
    featured pricing tier), Inter extrabold headlines (no display face,
    deliberately utilitarian), brutalist spec-sheet/grid layout with real
    border/divide grid lines, numbered `§01`–`§06` section labels, and a
    ruler-strip revision marker above the header
- Fixed-in-place from the earlier round: `WaitlistForm`'s unique
  per-instance id (all 3 new variants use the form 1-2x per page safely)
- Verified with `astro build` (5/5 pages built, no errors), confirmed no
  leftover references to the deleted Meridian/Vector files anywhere in
  `src`, and confirmed every page's `<meta name="robots">`/switcher-label
  set is correct (Ledger indexable, the 4 others `noindex`; all 5 switcher
  labels present on every page)
- Could not do a visual/browser check again this session — Claude in
  Chrome extension still not connected
- STOPPED — waiting on user to review Ledger + the 4 Signal-family
  variants in-browser (`npm run dev -w website`, routes `/`, `/signal`,
  `/beacon`, `/pulse`, `/relay`) and pick a direction; still-outstanding
  items unchanged: (1) real Buttondown embed snippet, (2) user review of
  improvised testimonials/pricing

### 2026-09-03 — Beacon/Pulse/Relay discarded, replaced with 3 new Signal-family variants

- User asked to "make 3 versions of signal, keep the original signal";
  confirmed with `AskUserQuestion` that this meant discarding
  Beacon/Pulse/Relay and generating 3 fresh takes in their place (not
  adding alongside them)
- Deleted `src/pages/beacon.astro`, `src/pages/pulse.astro`,
  `src/pages/relay.astro`
- Updated `src/components/VariationSwitcher.astro`'s `variations` array to:
  Ledger `/`, Signal `/signal`, Ember `/ember`, Cipher `/cipher`, Anchor
  `/anchor`
- Built 3 new Signal-family variations via parallel subagents (each read
  `signal.astro` first, then wrote only its own new page file; no font
  changes needed — all reused fonts already loaded in `Layout.astro`):
  - `src/pages/ember.astro` — warm editorial riff on Signal: near-black-brown
    `#1a1210` (only the mechanism + final-CTA sections), warm cream
    `#fdf6ee` as the dominant background, burnt-orange `#ea580c`/`#c2410c`
    accent, Space Grotesk headlines, magazine devices (huge faint
    background numerals behind mechanism items, pull-quote testimonial,
    hairline rules instead of boxed cards)
  - `src/pages/cipher.astro` — technical/dev-tool riff on Signal: stays dark
    throughout (`#0a0e14`/`#0d1220`, no light split), neon terminal-green
    `#22d3a8` accent, Space Grotesk uppercase headlines + monospace labels,
    dot-grid hero texture, sharp 1px borders (no rounded corners/shadows),
    terminal-prompt glyphs (`$`, `>`) and bracketed CTAs (`[
    request_access ]`)
  - `src/pages/anchor.astro` — maritime/institutional riff on Signal: navy
    `#0f1b33` + white + a single crimson `#dc2626` accent used sparingly,
    Source Serif 4 headlines (the one serif-display variant, for
    gravitas), thick horizontal rules dividing sections, asymmetric hero
    with a bordered "verification manifest" stat panel, bordered
    grid-table pricing/problem sections instead of floating cards
- Verified with `astro build` (5/5 pages built, no errors); confirmed no
  leftover references to the deleted Beacon/Pulse/Relay files anywhere in
  `src` (one incidental `animate-pulse` Tailwind class in `cipher.astro` is
  unrelated — just a blinking-cursor utility, not a Pulse reference);
  confirmed `noindex` present on Ember/Cipher/Anchor and all 5 switcher
  labels render on the homepage
- Could not do a visual/browser check this session — Claude in Chrome
  extension not connected
- STOPPED — waiting on user to review Ledger + Signal + Ember + Cipher +
  Anchor in-browser (`npm run dev -w website`, routes `/`, `/signal`,
  `/ember`, `/cipher`, `/anchor`) and pick a direction; still-outstanding
  items unchanged: (1) real Buttondown embed snippet, (2) user review of
  improvised testimonials/pricing

### 2026-09-03 — User preference noted: Signal is the front-runner

- User reviewed the live variants and said "signal seems the clearest";
  asked what to do next, user chose "just noting a preference for now — no
  action needed yet, keep all 5 variations live"
- No files changed; all 5 variations (Ledger, Signal, Ember, Cipher,
  Anchor) remain live with no direction finalized
- Also established a new standing instruction (not project-specific,
  applies going forward): after every meaningful change, auto git
  add/commit/push to `origin` without asking first — user wants everything
  saved continuously and will handle any deletions themselves
- STOPPED — same outstanding items as before: (1) pick a final direction
  (Signal currently leading), (2) real Buttondown embed snippet, (3) user
  review of improvised testimonials/pricing

### 2026-09-05 — Vercel CLI installed, logged in, website deployed

- Installed the Vercel CLI globally (`npm i -g vercel`, v59.11.7) and
  completed device-flow login as `guestpeter7-3331`
- Linked only `packages/website` as its own Vercel project
  (`pmg13/transapp-website`) — run from inside that package directory so
  the app package is untouched and will get its own separate Vercel
  project later, as the user specified
- Vercel CLI auto-detected Astro (build `astro build`, output `dist`) and
  added `.vercel` + `.env*` to `packages/website/.gitignore`
  (`.env.local` holds a per-project `VERCEL_OIDC_TOKEN`, not committed)
- GitHub auto-deploy integration could not be connected (Vercel account
  has no GitHub login connection yet — user would need to add one at
  https://vercel.com/docs/accounts/create-an-account#login-methods-and-connections);
  deployed via `vercel deploy --prod` instead, which does not depend on
  that connection
- Verified production deployment: https://transapp-website.vercel.app
  returns 200 with the expected homepage title
- STOPPED — deploy is live and will need a manual `vercel deploy --prod`
  after future changes until GitHub auto-deploy is connected; same
  outstanding items as before (final design direction, Buttondown embed,
  testimonials/pricing review)

### 2026-09-05 — GitHub auto-deploy connected; Signal promoted to `/`

- Connected the Vercel project to GitHub: user added a GitHub Login
  Connection to their Vercel account, then granted the Vercel GitHub App
  access to `pmguest/transapp` (it was scoped to "only selected
  repositories" and didn't include this repo yet)
- Ran `vercel git connect` (confirmed: "pmguest/transapp is already
  connected to your project") and explicitly set the project's Root
  Directory to `packages/website` via `vercel project update` — without
  this a GitHub-triggered build would run from the monorepo root, which
  has no build script, and fail. Pushes to the connected branch now
  trigger an automatic production deploy; manual `vercel deploy --prod`
  is no longer required
- User decided: Signal becomes the primary landing page, Ledger goes
  last. Moved Signal's content into `src/pages/index.astro` (now served
  at `/`, indexable — dropped its `noindex` and its "— Signal" title
  override in favor of the site's default title/description) and moved
  the original Ledger content into a new `src/pages/ledger.astro`
  (added `noindex={true}` and title "transapp — Ledger", matching the
  convention the other variation pages already use). Deleted the old
  `src/pages/signal.astro` (superseded by `index.astro`)
- Updated `VariationSwitcher.astro`'s array order to: Signal `/`, Ember
  `/ember`, Cipher `/cipher`, Anchor `/anchor`, Ledger `/ledger`
- Verified with `astro build` (5/5 pages built) and confirmed in the
  output HTML: `/` has no `noindex` meta tag, `/ledger` does; the
  switcher renders in the new Signal-first/Ledger-last order on every
  page
- Committed and pushed to `origin/website/homepage`
- Pushing to `website/homepage` only triggered a Preview deployment
  (Vercel's Production Branch is `main`, not this branch), so the live
  production URL still served the pre-swap build. Promoted manually with
  `vercel deploy --prod`, but running it from inside `packages/website`
  (where the project was originally linked) failed: `Error: The
  specified Root Directory "packages/website" does not exist` — because
  the Root Directory setting gets joined onto the CLI's cwd, and cwd was
  already inside `packages/website`, doubling the path. Fixed by also
  linking the Vercel project at the monorepo root
  (`vercel link --yes --project transapp-website --cwd <repo root>`,
  which added `.vercel`/`.env*` to the root `.gitignore` automatically)
  and running `vercel deploy --prod --cwd <repo root>` from there
  instead — this is now the required way to manually deploy
- Verified the live production URL: `/` serves Signal (no `noindex`
  meta), `/ledger` serves Ledger (`noindex` present)
- Committed and pushed the root `.gitignore` update separately
- STOPPED — outstanding items unchanged: real Buttondown embed snippet,
  user review of improvised testimonials/pricing

### 2026-09-10 — packages/app scaffolded (Next.js + Supabase, alpha pipeline)

- Read `PIPELINE-ARCHITECTURE.md` (new file at repo root, handed off from
  another session) — a 9-stage spec for the translation pipeline: 1
  extraction, 2 anonymisation, 3 translation (Gemini), 4 correction
  (ChatGPT), 5 QA (Claude), 6 structural completeness check, 7 figures/
  formatting check, 8 de-anonymisation, 9 mandatory human review. Stages
  1, 2, 6, 7, 8 are specified as code/mechanical checks, not prompts —
  stages 3-5 are the only model calls
- Scaffolded `packages/app` as a real Next.js 16 app (App Router,
  TypeScript, ESLint; via `create-next-app` in a scratch dir, then merged
  into the existing `packages/app/package.json` stub — kept its `name:
  "app"`/`version: "0.0.0"`) — replaced default boilerplate homepage with a
  one-line placeholder pointing at the pipeline code
- Added `@supabase/supabase-js` and a server-only service-role client
  (`src/lib/supabase/server.ts`) — alpha has no auth, so every DB access
  goes through this client from Next.js server code, never a
  browser/anon client
- Added `supabase/migrations/0001_init.sql`: three tables —
  **documents** (upload metadata, `status`/`current_stage`,
  `extracted_text`, `final_text`), **entity_mappings** (stage 2's
  placeholder-to-real-value lookup — the one place real client PII lives
  after anonymisation; server-only, never sent to Gemini/OpenAI/
  Anthropic), **pipeline_stage_runs** (audit-trail row per document per
  stage, so stages 3-7 are independently inspectable rather than trusting
  a single status column)
- **RLS confirmed enabled on all three tables** (`alter table ... enable
  row level security` in the migration). No policies are defined yet —
  correct for now, not a gap: the alpha has no auth, so nothing but the
  service-role key (which bypasses RLS) ever touches these tables; an
  accidental anon/authenticated key is blocked from all access by default
  until real per-tenant policies are designed for beta
- No live Supabase project exists yet (checked — no Supabase env vars,
  no CLI installed), so **TypeScript types were hand-written**
  (`src/lib/supabase/database.types.ts`) to match the migration, flagged
  in-file as a stand-in for `supabase gen types typescript` once a real
  project is linked — regenerate for real at that point, don't keep
  hand-editing it
- Built `src/lib/pipeline/`: `types.ts` (shared `PipelineContext`/
  `EntityMapping` types, the `PIPELINE_STAGES` list), one stub file per
  stage under `stages/01-...` through `09-human-review.ts` (each
  documents its stage's spec/rationale from PIPELINE-ARCHITECTURE.md
  inline and throws "not implemented yet" — real logic is deliberately
  left for one stage at a time later), and `orchestrator.ts` (sequences
  stages 1-8, persists progress via Supabase between stages, stops and
  marks `awaiting_human_review` after stage 8 rather than auto-completing
  — stage 9 is a human decision, not code)
- Added a stub API route, `POST /api/pipeline/run` (`{ documentId }` ->
  calls the orchestrator; currently always 501s since every stage is a
  stub) — settles the request/response shape before stages are filled in
- Added `.env.example` (Supabase URL/service-role key, Gemini/OpenAI/
  Anthropic API keys — all blank placeholders) and `packages/app/.gitignore`
  (real `.env*` files ignored, `.env.example` explicitly un-ignored so it's
  trackable)
- Verified with `npm run build -w app` (compiles, 3 routes generated) and
  `npm run lint -w app` (0 problems after adding an
  `argsIgnorePattern: "^_"` ESLint override for the stub stages' currently-
  unused parameters)
- **Schema in plain language:** three new database tables track a
  document's trip through the pipeline. One row per upload
  (`documents`); a private, server-only table holding the real names/
  companies/etc that get swapped out before any text goes to an AI
  vendor (`entity_mappings`); and one row per pipeline stage per
  document as a running audit log (`pipeline_stage_runs`). Nothing in
  this migration has run against a real database yet — no Supabase
  project is linked, so this is schema-as-code only until one exists
- Did not run the "testing" step of AGENTS.md's protocol — no test suite
  exists yet in this package
- STOPPED — scaffold only, nothing in the pipeline actually calls an AI
  API yet. Next steps are the user's call: (1) create/link a real
  Supabase project and push this migration, (2) implement stage
  functions one at a time (extraction is the natural first one — code
  only, no API key needed), (3) a second, separate Vercel project for
  `packages/app` (per PIPELINE-ARCHITECTURE.md — not set up this
  session)

### 2026-09-10 — packages/app: Next.js scaffold replaced with React + TS + Vite

- User asked, same session, to bootstrap a plain React + TypeScript + Vite
  app in "our web app" — this conflicts with the Next.js + Supabase choice
  in `PIPELINE-ARCHITECTURE.md`/the entry above. Flagged the conflict via
  `AskUserQuestion`; user confirmed explicitly: replace the Next.js
  scaffold in `packages/app` with Vite, keep
  `supabase/migrations/0001_init.sql` exactly as-is (real schema work),
  everything else Next.js-specific is disposable
- Deleted `.next/`, `next.config.ts`, `next-env.d.ts`, the Next.js
  `package.json`/`tsconfig.json`/`eslint.config.mjs`, and `src/`/`public/`
  (this also removed last entry's pipeline stage stubs —
  `src/lib/pipeline/*`, `src/lib/supabase/*` — and the stub API route;
  recoverable from git history at commit `45b21b4` if needed later, not
  carried forward)
- Scaffolded fresh via `npm create vite@latest -- --template react-ts` in a
  scratch dir, merged into `packages/app` (kept `package.json`'s `name:
  "app"`; kept `@supabase/supabase-js` as a dependency since the migration
  is still there); rewrote `src/App.tsx` to just `<h1>Hello world!</h1>`,
  removed the template's demo assets/CSS/counter
  (`App.css`, `src/assets/`, `public/icons.svg`)
- Rewrote `.gitignore` (Vite's `dist/` instead of Next's `.next/`/`out/`)
  and `README.md` (drops the Next.js file-layout section, notes the
  migration is kept, points at `.env.example` for when Supabase wiring
  resumes)
- Verified: `npm run build -w app` succeeds (`tsc -b && vite build`);
  started `npm run dev -w app` (port 5173), opened
  `http://localhost:5173/` in the browser via Claude in Chrome, confirmed
  page title "transapp — app" and body text "Hello world!" both render
  (page text extraction + screenshot)
- STOPPED — bare Vite scaffold only, no pipeline/Supabase wiring in the
  app code (that was removed this entry). Dev server was left running in
  the background this session — stop it before the next session if it's
  no longer needed. Same outstanding items as before on the website side
  (Buttondown embed, testimonials/pricing review); app-side next step is
  the user's call on what the React app should actually do

### 2026-09-10 — packages/app deployed to Vercel as its own project

- Created a new Vercel project, `transapp-app` (`vercel project add`),
  separate from `transapp-website` — same pattern as the website's own
  setup, per Vercel's monorepo guidance (one project per deployed
  directory, https://vercel.com/docs/monorepos)
- Set its Root Directory to `packages/app` and framework preset to `vite`
  (`vercel project update transapp-app --root-directory packages/app
  --framework vite --yes`)
- Linked `packages/app` locally to it (`vercel link --yes --project
  transapp-app`, run with cwd inside `packages/app`) — this created
  `packages/app/.vercel/` (gitignored) and a `.env.local` holding a
  per-project `VERCEL_OIDC_TOKEN` (also gitignored). The CLI also
  appended a redundant `.vercel`/`.env*` block to the end of
  `packages/app/.gitignore` — removed it, since it duplicated existing
  rules earlier in the file and, worse, its `.env*` re-ignored
  `.env.example` by appearing after (and so overriding) the `!.env.example`
  exception already in the file
- Connected the same GitHub repo (`pmguest/transapp`) to the new project
  (`vercel git connect --yes`, run from `packages/app`) — pushes now
  trigger deploys for both `transapp-website` and `transapp-app`
  independently, each building only its own Root Directory
- Deployed to production without touching the monorepo root's existing
  `.vercel/` link (which stays pointed at `transapp-website`): ran
  `vercel deploy --prod --cwd <repo root>` with `VERCEL_ORG_ID`/
  `VERCEL_PROJECT_ID` env vars set to `transapp-app`'s IDs instead of
  relinking root — same root-directory-join requirement discovered for
  the website (CLI joins Root Directory onto cwd, so cwd must be the repo
  root), but env vars avoid needing to swap which project root is linked
  to each time
- Verified: build succeeded on Vercel (`npm run build` → `tsc -b && vite
  build`), deployment aliased to https://transapp-app.vercel.app,
  confirmed 200 response and `<title>transapp — app</title>` in the
  served HTML; confirmed the root `.vercel/project.json` still points at
  `transapp-website`, unchanged
- No local file changes were needed beyond the `.gitignore` cleanup above
  — project creation, root-directory/framework settings, and the GitHub
  connection all live in Vercel, not the repo
- STOPPED — app is live but still just the "Hello world!" scaffold; same
  outstanding items as before

### 2026-09-10 — Website: testimonial quotes and pricing figures replaced with placeholders

- Scope: all 5 `packages/website/src/pages/*.astro` files (`index.astro`
  — live Signal homepage, `ledger.astro`, `ember.astro`, `cipher.astro`,
  `anchor.astro`). Checked shared components (`Nav.astro`, `Footer.astro`,
  `VariationSwitcher.astro`, `WaitlistForm.astro`, `Layout.astro`) too —
  none hold testimonial/pricing content directly (each page defines its
  own `testimonials`/`pricing` arrays; the only "pricing" text in the
  shared components is the `#pricing` nav/footer anchor link label,
  untouched)
- In each of the 5 page files: replaced all 3 `testimonials[].quote`
  strings with the same Lorem ipsum filler sentence, and both numeric
  `pricing[].price` values (Starter `$39`, Business `$149`) with
  `$0000`. Left `name`/`role` attributions (e.g. "Operations lead,
  Logistics company") and the Enterprise tier's `price: 'Let's talk'`
  untouched — the former aren't quotes or figures, the latter isn't a
  number
- Nothing else in any of the 5 files was touched — confirmed via `git
  diff --stat`: exactly 10 changed lines per file (5 edits × add+delete),
  matching the 3 quotes + 2 prices in each
- Verified with `npm run build -w website` — 5/5 pages built; spot-checked
  `dist/` output for all 5 routes: 3 "Lorem ipsum" occurrences and 2
  "$0000" occurrences per page, no leftover "$39"/"$149" anywhere
- Flagged for user review (not changed, since neither is a quote or a
  number, per the request's scope): the Enterprise tier's `price:
  'Let's talk'` on all 5 pages, and every testimonial's `name`/`role`
  fields (generic role + industry descriptors, no real named individuals
  or companies, but still fabricated) — say if those should also become
  placeholders
- STOPPED — this was the "user review of improvised testimonials/
  pricing" outstanding item from earlier entries, now addressed by
  placeholdering rather than a content rewrite; real testimonial quotes
  and pricing figures still need to be supplied before this ships
  publicly

### 2026-09-10 — main brought up to date; app's GitHub auto-deploy confirmed on main

- `main` had been sitting at the original initial commit this whole time
  (1 commit) while every session's work — website redesigns, the app
  scaffold, both Vercel projects — only ever lived on `website/homepage`
  (10 commits ahead). Both Vercel projects' Production Branch is `main`
  (confirmed for `transapp-website` in the 2026-09-05 entry; `transapp-app`
  turned out to default to `main` too once GitHub-connected — see below),
  so nothing had ever auto-deployed to production via git push; every
  production deploy so far was a manual `vercel deploy --prod`
- Asked the user how to reconcile this; they chose to fast-forward `main`
  to `website/homepage`'s tip (`git merge --ff-only`) rather than cherry-
  pick just the app, or leave it alone. Pushed to `origin/main` — this
  also brings the website's git-triggered production deploys in sync
  with what manual deploys had already made live, no new content exposed
- Confirmed `transapp-app`'s GitHub connection (set up 2026-09-10, see
  the "deployed to Vercel as its own project" entry above) fires a
  **Production** deployment on a push to `main` with no manual CLI step —
  `vercel ls transapp-app` showed a new Production deployment ready ~20s
  after the `git push origin main`, matching the website's existing
  pattern. Root Directory (`packages/app`) and framework preset (`vite`)
  from that same earlier entry still apply
- Made a small visible change to confirm the pipeline end-to-end: added
  a second line to `packages/app/src/App.tsx` ("Deployed automatically
  via GitHub → Vercel.") under the "Hello world!" heading. Verified
  `npm run build -w app` locally first, then committed directly on
  `main` (per this task's purpose — testing the main-triggered deploy)
  and pushed
- STOPPED — once this push lands, `main` is the branch to work from/push
  to going forward for both projects to auto-deploy; `website/homepage`
  now equals `main` as of the merge and will need re-syncing (merge or
  rebase) if used again after this entry's commit

### 2026-09-10 — Supabase: bootstrap plumbing, RLS policy rule, email confirmation disabled

- Installed `@supabase/supabase-js` for real (was already in
  `package.json` from the deleted Next.js scaffold but never actually
  installed) and added `packages/app/src/lib/supabase.ts` — a single
  client instance reading `VITE_SUPABASE_PROJECT_URL` /
  `VITE_SUPABASE_PUBLISHABLE_KEY`. Not wired into any UI, no auth code —
  plumbing only, per the user's explicit scope ("I'll add authentication
  separately")
- User's real project URL and publishable key are in `packages/app/.env`
  (gitignored, not committed) — connection-verified against the live
  project directly (queried a nonexistent table, got a real API error
  back rather than a connection/auth failure)
- New standing rule (added to `AGENTS.md`'s Database changes section):
  every table creation must turn on RLS and write its policies in the
  same step, never deferred. Applied it immediately to
  `supabase/migrations/0001_init.sql` — confirmed none of its three
  tables exist on the live project yet, but the migration itself had
  exactly the gap the rule targets (RLS enabled, zero explicit policies);
  each table now gets an explicit deny-all policy for
  `anon`/`authenticated` right after its own RLS-enable statement
- User also added a Supabase personal access token (account-level
  Management API credential) — its value lives at
  `packages/app/.env` (`SUPABASE_ACCESS_TOKEN`), gitignored, not
  recorded here per this file's own rule against writing API tokens
- Used that token (Management API `PATCH .../config/auth`) to set
  `mailer_autoconfirm: true` on the live project, disabling email
  confirmation for new signups — read the setting before changing it
  (`mailer_autoconfirm: false`, i.e. confirmation was required),
  applied the change, then re-read it fresh (not just the PATCH
  response echo) to confirm it stuck
- Also noticed and flagged (not fixed, per the harness's "don't revert
  without saying so" guidance): `AGENTS.md` was edited directly on disk
  outside this session mid-task, ending up saved as UTF-16LE (git sees
  it as a binary diff) with a duplicate line at the end repeating the
  RLS/policy rule already added to the Database changes section.
  Committed as found; user hasn't yet said whether to clean it up
- STOPPED — Supabase plumbing exists and is live-verified; no tables
  exist on the live project yet (migration not applied); email
  confirmation is now off for new signups on the live project — worth
  remembering this is a real security-relevant setting change, not a
  local-only one

### 2026-09-10 — Email/password auth: sign up, sign in, sign out, header

- Built on the Supabase client plumbing from earlier this session
  (`src/lib/supabase.ts`) — added `react-router-dom` for `/signup` and
  `/signin` routes, an `AuthProvider`/`useAuth` context tracking session
  state via `supabase.auth.getSession()` + `onAuthStateChange()`, a
  `Header` component (shows "Signed in as `<email>`" + a sign-out button
  when authed, Sign in/Sign up links otherwise), and `SignUpPage`/
  `SignInPage` with email/password forms calling `supabase.auth.signUp()`
  / `signInWithPassword()`
  — the auth-context/hook split into three files (context, provider,
  hook) instead of one, since `oxlint`'s Fast Refresh rule flags a file
  that exports both a component and a non-component
- Sign-up redirects home immediately (no "check your email" step) —
  direct consequence of `mailer_autoconfirm: true`, set earlier this
  session
- Tested the full flow live against the real project, in-browser: signed
  up a test account (`testuser-transapp@example.com`) → header updated
  to show it and a Sign out button → clicked Sign out → redirected to
  `/signin`, header reverted → signed back in with the same credentials →
  worked → hard-reloaded the page → still signed in (session persists via
  Supabase's default localStorage storage) → signed out again to leave a
  clean state
- Verified `npm run build -w app` and `npm run lint -w app` clean
  throughout
- STOPPED — auth is fully working but there's no database row tied to a
  user yet (the `documents`/`entity_mappings`/`pipeline_stage_runs` tables
  from `0001_init.sql` still aren't applied to the live project, and
  their RLS policies are still deny-all for `authenticated` — see the
  earlier entry). No route protection/redirect-if-signed-out exists
  either; `/`, `/signup`, `/signin` are all reachable regardless of auth
  state right now

### 2026-09-10 — Google sign-in added (code); Google Cloud + provider toggle still manual

- Added `src/components/GoogleSignInButton.tsx` (shared by both pages —
  OAuth has no separate sign-up step) calling
  `supabase.auth.signInWithOAuth({ provider: 'google', options: {
  redirectTo: window.location.origin } })`. Wired into `SignInPage.tsx`
  and `SignUpPage.tsx` below the existing email/password form
- Checked the live project's auth config via the Management API before
  touching anything: `external_google_enabled: false` (expected — nobody
  had set this up yet) and, unexpectedly, `site_url: "http://localhost:3000"`
  with an **empty** redirect URL allowlist — neither the dev server
  (`:5173`) nor the deployed app (`transapp-app.vercel.app`) would have
  been an allowed OAuth redirect target. Fixed via the Management API
  (URLs only, no secrets involved): `site_url` →
  `https://transapp-app.vercel.app`, `uri_allow_list` →
  `http://localhost:5173`, `http://localhost:5173/**`,
  `https://transapp-app.vercel.app`, `https://transapp-app.vercel.app/**`
  (bare origins and wildcards both, to avoid any glob-matching ambiguity)
- Did **not** attempt to enable the Google provider itself or generate/
  submit OAuth credentials — that needs a Google Cloud OAuth Client
  ID/Secret, which only the user can create (their own Google account),
  and the secret should go directly into the Supabase dashboard's own
  Auth Providers UI rather than through chat/CLI. Gave the user the exact
  Google Cloud Console steps (OAuth consent screen, Web application OAuth
  Client ID, authorized redirect URI =
  `https://huukyfxnwvytklivafck.supabase.co/auth/v1/callback`) and the
  Supabase dashboard steps (Authentication → Providers → Google → paste
  Client ID/Secret → Save) to do themselves
- Verified `npm run build -w app` and `npm run lint -w app` clean
- STOPPED — code is ready and merged; the feature won't actually work
  until the user completes the Google Cloud + Supabase dashboard steps
  above (not something this session can do on their behalf)

### 2026-09-10 — Google sign-in reverted, at user's request

- User asked to fully revert the previous entry's work: remove the
  Google button and OAuth code from both auth pages, and undo anything
  else added for it
- Code: `git revert` of that entry's commit — removed
  `src/components/GoogleSignInButton.tsx` and its import/usage in
  `SignInPage.tsx`/`SignUpPage.tsx`. Confirmed no "Google" references
  remain anywhere in `packages/app/src`
- Supabase auth URLs: reverted via the Management API back to their
  pre-entry values — `site_url` back to `http://localhost:3000`,
  `uri_allow_list` back to empty. Flagging the consequence rather than
  just doing it silently: this restores the stale/broken default that
  would block redirect-based auth flows generally (not just Google
  OAuth) — email confirmation links, password resets, magic links, any
  future OAuth provider. It's back exactly to how this session found it,
  which is what "undo anything else added for it" asked for, but it's
  worth fixing again the next time any redirect-based auth flow is
  actually needed
- Checked whether anything external had been set up in the meantime,
  before touching anything: `external_google_enabled` was still `false`
  on the live project (exactly as left, never turned on) — told the user
  rather than assuming. Have no way to check Google Cloud Console
  directly (no API access there); never touched it this session either
  way, so nothing on this end suggests a project was created, but only
  the user can confirm that for certain
- Verified `npm run build -w app` and `npm run lint -w app` clean;
  tested live in-browser against the real project: signed up a fresh
  test account, header updated correctly, signed out, signed back in
  with the same credentials — both flows work exactly as they did before
  the Google entry, no Google-related UI on either page
- This log entry restores the previous one verbatim rather than deleting
  it, per this file's own rule ("Never rewrite or delete prior log
  entries") — `git revert` had removed it from `PROJECT-STATE.md` along
  with the code, which doesn't fit that rule even though the user asked
  for a full revert; restored it and recorded the revert as a new entry
  instead. Removed the two Current Facts rows that entry added (Supabase
  auth URLs, Google sign-in) since Current Facts is current-state, not
  history, and neither is true anymore
- STOPPED — back to the state before Google sign-in was attempted

### 2026-09-10 — Supabase redirect URL config fixed (not feature-specific this time)

- Re-applied the `site_url`/`uri_allow_list` fix from the reverted Google
  sign-in entry, but as its own standalone fix rather than tied to any
  feature: `site_url` → `https://transapp-app.vercel.app`,
  `uri_allow_list` → `http://localhost:5173`, `http://localhost:5173/**`,
  `https://transapp-app.vercel.app`, `https://transapp-app.vercel.app/**`
  (bare + wildcard both). Was still the stale `http://localhost:3000`/
  empty default from before this project had a real deployment
- Confirmed with a fresh GET afterward (not just the PATCH response
  echo): both values persisted; `external_google_enabled` and
  `mailer_autoconfirm` unaffected by this scoped change
- This unblocks any redirect-based auth flow whenever it's turned on —
  email confirmation links, password resets, magic links, future OAuth
  providers — not just the Google sign-in that was reverted
- STOPPED — config-only change, no code touched
