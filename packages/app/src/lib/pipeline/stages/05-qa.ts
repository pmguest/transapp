import type { PipelineContext, StageResult } from "../types";

/**
 * Stage 5 — QA. Claude, an independent second check on ChatGPT's corrected
 * version (stage 4 output), against the anonymised source.
 *
 * This is a second model from a different vendor, deliberately — the point
 * is an independent check, not a rubber stamp of stage 4's own opinion of
 * itself.
 *
 * TODO: wire the Anthropic API call (ANTHROPIC_API_KEY, see .env.example).
 */
export async function runQa(
  _anonymizedSourceText: string,
  _correctedText: string
): Promise<StageResult<Pick<PipelineContext, "qaNotes">>> {
  throw new Error("Stage 5 (qa) not implemented yet — scaffold only.");
}
