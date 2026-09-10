import type { PipelineContext, StageResult } from "../types";

/**
 * Stage 4 — Correction. ChatGPT checks the translation against the
 * anonymised source for fidelity (terminology, meaning, omissions).
 *
 * Evidence this stage can introduce errors, not just fix them: a real client
 * document (ARTIEM annual report) showed the correction stage swap two
 * numbered items' content, traced to its own review skipping one paragraph
 * entirely while still reporting full coverage — which is exactly why stage
 * 6 (structural check) exists as a mechanical, independent check rather than
 * trusting this stage's self-report.
 *
 * TODO: wire the OpenAI API call (OPENAI_API_KEY, see .env.example).
 */
export async function runCorrection(
  _anonymizedSourceText: string,
  _translatedText: string
): Promise<StageResult<Pick<PipelineContext, "correctedText">>> {
  throw new Error("Stage 4 (correction) not implemented yet — scaffold only.");
}
