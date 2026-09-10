import type { PipelineContext, StageResult } from "../types";

/**
 * Stage 3 — Translation. Gemini, on the anonymised text.
 *
 * Runs only on the output of stage 2 (`anonymizedText`) — never on the raw
 * `extractedText`. This is the first point real document content leaves the
 * process, so it must never see un-anonymised text or the entity mapping.
 *
 * TODO: wire the Gemini API call (GEMINI_API_KEY, see .env.example).
 */
export async function runTranslation(
  _anonymizedText: string,
  _sourceLanguage: string,
  _targetLanguage: string
): Promise<StageResult<Pick<PipelineContext, "translatedText">>> {
  throw new Error("Stage 3 (translation) not implemented yet — scaffold only.");
}
