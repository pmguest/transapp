-- transapp pipeline — alpha schema (see PIPELINE-ARCHITECTURE.md at repo root)
-- Single tenant, no auth/billing yet. Every table below turns on RLS and
-- gets an explicit policy in the same statement block that creates it —
-- never a table left policy-less "for now". Until auth exists, that policy
-- is a deliberate deny-all for anon/authenticated: the app's publishable
-- key must never be able to read or write these tables, only server-side
-- code holding the service-role key can (service_role bypasses RLS by
-- design). Real per-user policies replace the deny-all once auth exists —
-- that's a beta-scope item, not this migration.

-- One row per uploaded document, tracking its progress through pipeline
-- stages 1-9.
create table documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  original_filename text not null,
  source_language text,
  target_language text,
  -- path of the original upload in Supabase Storage (bucket managed outside SQL)
  source_storage_path text,
  -- stage 1 output: full extracted plain text, reading-order preserved
  extracted_text text,
  -- stage 9 is a human sign-off, not a pipeline stage the code can mark
  -- complete on its own; current_stage tracks progress through stages 1-8
  current_stage smallint not null default 0,
  status text not null default 'uploaded' check (
    status in (
      'uploaded',
      'extracting',
      'anonymizing',
      'translating',
      'correcting',
      'qa_checking',
      'structural_checking',
      'formatting_checking',
      'deanonymizing',
      'awaiting_human_review',
      'complete',
      'failed'
    )
  ),
  -- stage 8 output: final translated text with real entities restored
  final_text text,
  error text
);

comment on table documents is
  'One row per uploaded source document, tracking status through pipeline stages 1-9.';

alter table documents enable row level security;

create policy "deny all — service role only" on documents
  for all
  to anon, authenticated
  using (false)
  with check (false);

-- Stage 2 anonymisation mapping table. This is the one place real personal/
-- company/identifying data from a client document lives after stage 2 runs.
-- It is populated and read only by server-side code — it must never be sent
-- to Gemini, OpenAI, or Anthropic. Restoration (stage 8) is a plain lookup
-- against this table, not an AI call.
create table entity_mappings (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  -- e.g. '[PERSON_1]', '[COMPANY_1]', '[DATE_1]'
  placeholder text not null,
  -- e.g. 'PERSON', 'COMPANY', 'ADDRESS', 'EMAIL', 'PHONE', 'ID_NUMBER'
  entity_type text not null,
  real_value text not null,
  created_at timestamptz not null default now(),
  unique (document_id, placeholder)
);

comment on table entity_mappings is
  'Real-value lookup for anonymisation placeholders. Sensitive: server-only, never sent to any AI vendor.';

alter table entity_mappings enable row level security;

create policy "deny all — service role only" on entity_mappings
  for all
  to anon, authenticated
  using (false)
  with check (false);

-- Audit trail: one row per (document, stage) run, so every mechanical check
-- (stages 6-7) and every model call (stages 3-5) is independently inspectable
-- rather than trusting a single free-text "status" column on documents.
create table pipeline_stage_runs (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  stage smallint not null check (stage between 1 and 9),
  stage_name text not null,
  status text not null default 'pending' check (
    status in ('pending', 'running', 'passed', 'failed')
  ),
  -- stage-specific structured output, e.g. structural-check counts (stage 6)
  -- or figures/formatting diffs (stage 7)
  output jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

comment on table pipeline_stage_runs is
  'Per-stage audit trail for a document''s run through pipeline stages 1-9.';

create index pipeline_stage_runs_document_id_idx on pipeline_stage_runs (document_id);

alter table pipeline_stage_runs enable row level security;

create policy "deny all — service role only" on pipeline_stage_runs
  for all
  to anon, authenticated
  using (false)
  with check (false);
