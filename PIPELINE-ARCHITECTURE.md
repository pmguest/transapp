# transapp — Translation Pipeline Architecture (v1)

Last updated: 2026-09-09. Written to hand to the local build session as the spec for `packages/app`.

## Confirmed stack

- App framework: Next.js (pairs with Supabase auth/RLS, Vercel serverless functions for the pipeline calls)
- Database: **Supabase** — confirmed usable by Mo Bitar (course instructor)
- Deployment: a second, separate Vercel project from `transapp-website`
- File storage: Supabase Storage

## Pipeline stages, in order

**1. Extraction — code, not a prompt**
Pull all text from the uploaded document (DOCX, PDF text-layer for alpha) in correct reading order, including side/marginal content (labels, captions, sidebar figures) that a naive text-only extraction can miss. Verify completeness before proceeding — an LLM comparing the extracted text against a rendered page image is a reasonable spot-check here, but the extraction itself should be a proper parser, not a model guessing at layout.
*Why this is here:* a real client document tested this week had per-property opening-year labels silently missing at exactly this stage — never even reaching the translation step.

**2. Anonymisation — code backbone, LLM as backstop, not the reverse**
Detect personal names, company names, addresses, emails, phone numbers, ID/account numbers in the source text. Replace each with a consistent placeholder (`[PERSON_1]`, `[COMPANY_1]`, `[DATE_1]`, etc.). Store the real-value mapping locally — it is never sent to Gemini, OpenAI, or Anthropic. Restoration happens only at the very end (stage 8).
*Why this is a hard requirement, not optional:* Charley's actual client base includes legal, financial, and pharmaceutical work, bound by confidentiality obligations, and this is the EU (GDPR applies to personal data). Sending unredacted client documents to three external AI vendors is not acceptable for that client base by default.
*Known risk:* entity detection itself can miss things over a long document, the same way the structural check below can (see stage 6) — a proper NER-style detection step, not a single LLM pass, should be the backbone, with an LLM used to double-check rather than as the only line of defence.

**3. Translation** — Gemini, on the anonymised text.

**4. Correction** — ChatGPT, checks the translation against the anonymised source for fidelity (terminology, meaning, omissions).

**5. QA** — Claude, an independent second check on ChatGPT's corrected version.

**6. Structural completeness check — code, not a prompt**
Compare heading/section/numbered-item count and order between the source and the final translated output, mechanically (not by asking a model "does this look complete").
*Why this is here:* tested this week on a real client document — ChatGPT's correction pass mislabeled two numbered items, swapping their content, and its own written review skipped one entire paragraph without noticing (confirmed by checking its review notes directly — the paragraph's actual content, e.g. "TRUST/PASSION/JOY", was never mentioned anywhere in its check). A general "does this look right" prompt did not catch this. A count-and-match check would have.

**7. Figures & formatting check — code, not a prompt**
Normalise dates, decimals, currency, and thousand-separator conventions to the target locale (e.g. Spanish "1.234,56" → English "1,234.56"). Same reasoning as stage 6: exhaustive, mechanical checks belong in code, not in a model's judgment, because models can silently miss instances across a long document.

**8. De-anonymisation — code, exact table lookup, not an AI call**
Restore real names, companies, etc. from the mapping table stored in stage 2. Last step before output.

**9. Mandatory human certified review**
Unchanged existing hard rule: required, not optional, for any contractual or liability-bearing content. Recommended but not mandatory for lower-stakes content (a bar menu, a garage repair estimate).

## What this adds to the original alpha checklist

The local session's pre-build checklist (single-tenant, no auth/billing, text + DOCX/PDF-text-layer input, Next.js + Supabase) still holds. Two things this architecture adds on top of it:
- **Anonymisation** — not on the original checklist at all; added here as a hard requirement given the client base.
- **Structural completeness and figures/formatting as dedicated code checks**, not folded into the AI prompts — direct result of this week's testing showing prompt-based "review" can miss things a mechanical check would catch.

## Evidence behind this design (this week's manual testing)

- A course-module test document showed the translate→correct pipeline catches real meaning errors reliably (e.g. "sobrecargas" wrongly translated as "burnout" instead of "overload").
- A real client document (ARTIEM annual report, "¿Quiénes somos?" section) showed the correction stage can also *introduce* new errors — it swapped two numbered items' content, traced to its own review skipping one paragraph entirely while still reporting full coverage.
- The same document showed extraction can silently drop content (property opening years) before translation ever starts — not a translation error at all, an upstream gap.

## Status / next step

Ready to hand to the local Claude Code + VS Code session to scaffold `packages/app` (Next.js + Supabase) implementing stages 1–9 in order, within the alpha scope already agreed (single tenant, no auth/billing, text + DOCX/PDF-text-layer input only, manually seeded glossary/whitelist/blacklist).
