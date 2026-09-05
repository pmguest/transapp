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
