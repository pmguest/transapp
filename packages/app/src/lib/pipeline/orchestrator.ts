import { createServiceRoleClient } from "@/lib/supabase/server";
import { PIPELINE_STAGES } from "./types";
import type { DocumentStatus } from "@/lib/supabase/database.types";

/**
 * Runs a document through pipeline stages 1-8 in order (see
 * PIPELINE-ARCHITECTURE.md at the repo root), persisting progress to
 * `documents` / `pipeline_stage_runs` between stages so a crash/restart can
 * resume rather than re-run from scratch. Stage 9 (human review) is not run
 * here — the orchestrator stops and marks the document
 * 'awaiting_human_review' once stage 8 finishes; a human takes it from
 * there.
 *
 * Each stage's real logic lives in ./stages/NN-*.ts and is currently a stub
 * (throws "not implemented yet"). This function wires the sequence and the
 * persistence contract; it is not meant to run successfully end to end until
 * the stage functions are filled in one at a time.
 *
 * TODO: call the real stage functions in order below, mapping
 * PipelineContext fields in and stage output patches back out, updating
 * `documents.current_stage`/`status` and inserting a `pipeline_stage_runs`
 * row before/after each one.
 */
export async function runPipeline(documentId: string): Promise<void> {
  const supabase = createServiceRoleClient();

  const { data: document, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (error || !document) {
    throw new Error(`Document ${documentId} not found: ${error?.message}`);
  }

  throw new Error(
    "Pipeline orchestration not implemented yet — scaffold only. " +
      `Stages defined: ${PIPELINE_STAGES.map((s) => `${s.stage}:${s.name}`).join(", ")}.`
  );
}

/** Maps a completed stage number to the `documents.status` value it produces. */
export function statusAfterStage(stage: number): DocumentStatus {
  const entry = PIPELINE_STAGES.find((s) => s.stage === stage);
  if (!entry) throw new Error(`Unknown stage ${stage}`);

  switch (entry.name) {
    case "extraction":
      return "anonymizing";
    case "anonymization":
      return "translating";
    case "translation":
      return "correcting";
    case "correction":
      return "qa_checking";
    case "qa":
      return "structural_checking";
    case "structural_check":
      return "formatting_checking";
    case "figures_formatting_check":
      return "deanonymizing";
    case "deanonymization":
      return "awaiting_human_review";
    case "human_review":
      return "complete";
  }
}
