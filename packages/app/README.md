# transapp — app (translation pipeline)

Next.js + Supabase implementation of the pipeline described in
[`PIPELINE-ARCHITECTURE.md`](../../PIPELINE-ARCHITECTURE.md) at the repo
root. Alpha scope: single tenant, no auth/billing, text + DOCX/PDF-text-layer
input only, manually seeded glossary/whitelist/blacklist.

This is a scaffold — the folder structure, DB schema, and stage boundaries
are in place; the stage functions themselves are stubs that throw
"not implemented yet". Fill them in one at a time against
`src/lib/pipeline/stages/`.

## Layout

```
src/lib/pipeline/types.ts              shared PipelineContext / stage types
src/lib/pipeline/stages/01-...9-...    one file per pipeline stage
src/lib/pipeline/orchestrator.ts       runs stages 1-8 in order, stops at 9 for human review
src/lib/supabase/server.ts             service-role Supabase client (server-only)
src/lib/supabase/database.types.ts     hand-written types matching supabase/migrations/
src/app/api/pipeline/run/route.ts      POST { documentId } -> kicks off the orchestrator
supabase/migrations/0001_init.sql      documents / entity_mappings / pipeline_stage_runs
```

## Database

Schema lives in `supabase/migrations/0001_init.sql` — three tables:

- **documents** — one row per upload, tracks `status`/`current_stage` and
  holds `extracted_text` (stage 1) and `final_text` (stage 8 output).
- **entity_mappings** — the stage 2 anonymisation lookup (`[PERSON_1]` ->
  real name, etc). This is the one place real client PII lives after stage 2
  runs. Server-only; never sent to Gemini/OpenAI/Anthropic.
- **pipeline_stage_runs** — an audit-trail row per (document, stage), so
  every mechanical check (stages 6-7) and model call (stages 3-5) is
  independently inspectable.

RLS is enabled on all three tables. No policies are defined: the alpha has no
auth, so every DB access goes through Next.js server code using the
service-role key (which bypasses RLS by design). RLS here is a safety
backstop against an anon/authenticated key ever being used against these
tables, not an access-control scheme yet — real per-tenant policies are a
beta-scope item once auth exists.

There is no live Supabase project linked yet. Once one exists:

1. `npx supabase link --project-ref <ref>` (from this directory)
2. `npx supabase db push` to apply `0001_init.sql`
3. Regenerate `src/lib/supabase/database.types.ts` for real:
   `npx supabase gen types typescript --project-id <ref> > src/lib/supabase/database.types.ts`
   (the current file is hand-written to match the migration — say so in the
   file until this is done for real)
4. Fill in `.env.local` from `.env.example`

## Dev

```
npm run dev -w app
```
