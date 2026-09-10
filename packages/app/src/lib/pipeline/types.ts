import type { Database } from "@/lib/supabase/database.types";

export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];

export const PIPELINE_STAGES = [
  { stage: 1, name: "extraction" },
  { stage: 2, name: "anonymization" },
  { stage: 3, name: "translation" },
  { stage: 4, name: "correction" },
  { stage: 5, name: "qa" },
  { stage: 6, name: "structural_check" },
  { stage: 7, name: "figures_formatting_check" },
  { stage: 8, name: "deanonymization" },
  { stage: 9, name: "human_review" },
] as const;

export type StageName = (typeof PIPELINE_STAGES)[number]["name"];

/** One [PLACEHOLDER] -> real-value pair produced by stage 2, consumed by stage 8. */
export interface EntityMapping {
  placeholder: string;
  entityType:
    | "PERSON"
    | "COMPANY"
    | "ADDRESS"
    | "EMAIL"
    | "PHONE"
    | "ID_NUMBER"
    | "DATE";
  realValue: string;
}

/**
 * State threaded through the pipeline as it moves stage to stage. Each stage
 * function takes a context and an document id, and returns the fields it
 * changed — the orchestrator persists those to `documents` /
 * `pipeline_stage_runs` between stages so progress survives a crash/restart.
 */
export interface PipelineContext {
  documentId: string;
  sourceLanguage: string | null;
  targetLanguage: string | null;
  /** Real text — only ever held in memory / this table, never sent past stage 1. */
  extractedText: string | null;
  /** Text with entities replaced by placeholders — this is what leaves the process to Gemini/ChatGPT/Claude. */
  anonymizedText: string | null;
  entityMappings: EntityMapping[];
  translatedText: string | null;
  correctedText: string | null;
  qaNotes: string | null;
  structuralCheckPassed: boolean | null;
  figuresFormattingCheckPassed: boolean | null;
  /** Stage 8 output: corrected translation with real entities restored. */
  finalText: string | null;
}

export interface StageResult<TPatch extends Partial<PipelineContext>> {
  patch: TPatch;
  /** Structured detail for pipeline_stage_runs.output, e.g. counts for stage 6. */
  output?: Record<string, unknown>;
}
