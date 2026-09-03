---
name: variation
description: Create a new transapp homepage design variation, in its own page file, registered in the footer switcher alongside the existing variations — never modifying any variation already there. Use when the user says "new variation", "another variation", or invokes /variation, usually paired with a style or brand to take inspiration from (e.g. "/variation inspired by Stripe", "new variation, feel like a Japanese stationery brand", "another variation — brutalist, black and white").
---

# Homepage variation generator

Adds one new homepage design to `packages/website`, without touching any
variation that already exists. This project already has a switcher pattern
(Ledger at `/`, plus Meridian, Vector, Signal) — follow it exactly.

## 0. Find the style/brand inspiration

The user's invocation carries the creative direction — text after `/variation`,
or whatever they said alongside "new variation" / "another variation" (e.g. a
named brand, a design movement, a mood). Read it from their message.

If no inspiration was given at all, stop and ask before creating anything
(`AskUserQuestion`) — the visual direction is the one thing only the user can
supply; don't invent one unprompted.

## 1. Read the current state — never trust memory

1. Read `PROJECT-STATE.md` in full (per `AGENTS.md` protocol).
2. Read `packages/website/src/components/VariationSwitcher.astro` — its
   `variations` array is the single source of truth for what slugs/labels
   already exist. Do not rely on the log for this; read the live file.
3. Skim one existing variation page (e.g.
   `packages/website/src/pages/vector.astro` or `signal.astro`) to see the
   established technical pattern before writing the new one.

## 2. Pick a name and slug

Choose a short, single-word, evocative brand-style name in the spirit of the
existing ones (Ledger, Meridian, Vector, Signal) — it should suit the
requested inspiration, not just be generic. Lowercase it for the URL slug
(e.g. label `Harbor` → slug `/harbor`). Confirm it doesn't collide with any
slug or label already in `VariationSwitcher.astro`; pick a different word if
it does.

## 3. Product/content brief (reuse for every variation's copy)

Regardless of visual style, every variation pitches the same product — write
**original** copy in the requested style's voice, don't reuse sentences from
other variation files:

- Product: **transapp** — AI document translation that gets independently
  verified before it ships.
- The problem: AI translation is fast but unverified. Businesses ship
  AI-translated contracts, regulatory text, and safety instructions without
  anyone checking the AI's work, and small errors (a mistranslated contract
  clause, a drug interaction warning, a safety instruction) can be costly or
  dangerous.
- The mechanism (4 things — keep the substance, write fresh wording):
  1. Three independent AI models translate, then cross-check each other's
     drafts and converge on a consensus instead of a single guess.
  2. Customer-controlled glossaries — mandated and forbidden terms stay
     locked exactly as the customer needs, every time.
  3. Translation memory — standard phrases stay consistent across every
     document and language pair.
  4. A human review gateway stands between anything contractual, regulated,
     or high-stakes and the moment it reaches the client — nothing ships
     blind.
- Founder story (optional short section): built by a career linguist/
  translator whose own translation business was upended by AI — instead of
  rejecting AI or blindly trusting it, he built the verification layer that
  was missing.
- Target customers: logistics companies, medical device / regulated
  manufacturers, boutique translation agencies — any business that can't
  afford a mistranslated contract or safety notice.
- Testimonials: write 2–3 short original ones in this spirit (don't quote
  verbatim) — an operations lead at a logistics company relieved the
  consensus pass catches clause-level mismatches; a regulatory affairs
  manager glad mandated terms finally stay locked; a translation agency
  founder who finally trusts an AI workflow because a human still stands
  behind it.
- Pricing (3 tiers, keep the numbers, restate features in the variation's
  voice):
  - Starter — $39/mo — up to 20,000 words/month, consensus on every draft,
    one glossary, email support.
  - Business — $149/mo — up to 150,000 words/month, unlimited glossaries &
    shared memory, human gateway review on flagged content, priority
    support. Mark this one "most popular" / featured.
  - Enterprise — custom pricing ("Let's talk") — custom volume, dedicated
    human reviewers, compliance & audit trail, SSO.

## 4. Build the page

Create `packages/website/src/pages/<slug>.astro` as a **new file** — this is
the only page file you create or touch.

- Import and use:
  - `../layouts/Layout.astro` — pass `noindex={true}` (drafts aren't
    indexed; only Ledger at `/` is) plus your own `title`/`description`.
  - `../components/WaitlistForm.astro` (`align="left" | "center"`) for every
    email-capture CTA — don't build a new form.
  - `../components/VariationSwitcher.astro` — render `<VariationSwitcher />`
    centered in your page's own footer.
- Write your own header/nav and footer inline (don't import `Nav.astro` /
  `Footer.astro` — those belong to Ledger only).
- Cover the same section beats the other variations use — header/nav, hero,
  problem statement, how-it-works/mechanism, (optional founder story),
  testimonials, pricing, final CTA, footer with the switcher — but the
  *visual* execution (palette, type, layout, motifs, imagery, rhythm)
  should genuinely come from the requested inspiration. Make real,
  specific choices (exact hex values, an actual type pairing, a real
  layout idea) rather than a generic modern-SaaS default.
- Fonts already loaded in `Layout.astro`: Source Serif 4, Inter, Manrope,
  Space Grotesk, Sora. Prefer these (via Tailwind arbitrary-value classes
  like `font-['Manrope',sans-serif]`). Only if the requested inspiration
  genuinely needs a different typeface, add it to the existing combined
  Google Fonts `<link>` in `Layout.astro` — **additively only**: extend the
  `family=` list, never remove or alter the families already there.
- Use Tailwind CSS v4 utility classes with arbitrary values for colour
  (e.g. `bg-[#0f1115]`) rather than touching the shared theme tokens in
  `global.css`. Keep it responsive (mobile-first) and accessible (semantic
  HTML, real contrast, don't strip focus outlines). If you use
  `<WaitlistForm />` more than once on the page, that's fine — it already
  generates a unique id per instance.

## 5. Register it — append only

Edit `packages/website/src/components/VariationSwitcher.astro`: add one new
entry to the end of the `variations` array — `{ slug: '/<slug>', label:
'<Name>' }`. Do not reorder, rename, restyle, or remove any existing entry.
Do not touch anything else in that file.

## 6. Hard constraint: never modify existing variations

Do not edit any other file under `packages/website/src/pages/` (Ledger's
`index.astro`, or any other already-built variation). Do not edit
`Footer.astro`, `Nav.astro`, or `global.css`. The only files this skill may
change are: the new page file, `VariationSwitcher.astro` (append-only), and
— only if a new font is genuinely required — an additive edit to the Google
Fonts `<link>` in `Layout.astro`.

## 7. Verify

Run `npm run build -w website` from the repo root. Confirm:

- The new route builds with no errors.
- The new page's HTML has `<meta name="robots" content="noindex, nofollow">`.
- The switcher lists every prior variation's label unchanged, plus the new
  one.
- No other page's build output changed in ways you didn't intend (a diff of
  `dist/` against the pre-change build is a good sanity check if unsure).

## 8. Update PROJECT-STATE.md

Per `AGENTS.md` protocol: append a new dated log entry (never rewrite or
delete prior entries) describing the name, slug, inspiration, and the
concrete design choices made (palette hex values, fonts, layout ideas), plus
which files were touched. Update the "Homepage design variations" row in the
Current Facts table to include the new one.

## 9. Report back

Tell the user the new route (e.g. `/<slug>`), remind them the dev server
serves it live, and confirm no existing variation was changed.
