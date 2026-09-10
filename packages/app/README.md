# transapp — app

React + TypeScript + Vite. Currently a bare "Hello world!" scaffold — the
Next.js + Supabase pipeline scaffold that lived here previously (per
[`PIPELINE-ARCHITECTURE.md`](../../PIPELINE-ARCHITECTURE.md)) was replaced;
see the repo's `PROJECT-STATE.md` log for that decision. The database
migration is kept as-is (real schema work, not boilerplate):

```
supabase/migrations/0001_init.sql   documents / entity_mappings / pipeline_stage_runs
```

There is no live Supabase project linked yet. `.env.example` still lists the
env vars that schema implies (Supabase URL/service-role key, Gemini/OpenAI/
Anthropic API keys) for whenever the app code needs them again.

## Dev

```
npm run dev -w app
```
