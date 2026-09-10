# transapp — app

React + TypeScript + Vite. Currently a "Hello world!" scaffold with Supabase
client plumbing wired in — no auth or UI built on top of it yet.

```
src/lib/supabase.ts                  client instance (publishable key, reads VITE_* env vars)
src/vite-env.d.ts                    types import.meta.env for the two Supabase vars
supabase/migrations/0001_init.sql    documents / entity_mappings / pipeline_stage_runs
```

## Database

Schema lives in `supabase/migrations/0001_init.sql` — see its header comment
for the full rationale. Every table turns on RLS and gets an explicit
deny-all policy for `anon`/`authenticated` in the same block that creates it
— the app's publishable key can't read or write any of them. Only
server-side code holding the service-role key can, until real per-user
policies replace the deny-all once auth exists.

This migration has **not been applied** to the live Supabase project yet
(checked directly — none of the three tables exist there). Apply it with the
Supabase CLI once you're ready:

```
npx supabase link --project-ref <ref>
npx supabase db push
```

## Env

Copy `.env.example` to `.env` and fill in your project's values (Settings ->
API in the Supabase dashboard for the URL/publishable key). `.env` is
gitignored — never commit real values.

## Dev

```
npm run dev -w app
```
