import type { PipelineContext, StageResult } from "../types";

/**
 * Stage 6 — Structural completeness check. Code, not a prompt.
 *
 * Compare heading/section/numbered-item count and order between the source
 * and the final translated output, mechanically — not by asking a model
 * "does this look complete".
 *
 * Why this exists: tested this week on a real client document, ChatGPT's
 * correction pass (stage 4) mislabeled two numbered items, swapping their
 * content, and its own written review skipped one entire paragraph without
 * noticing (confirmed by checking its review notes directly — the
 * paragraph's actual content was never mentioned anywhere in its check). A
 * general "does this look right" prompt did not catch this; a count-and-match
 * check would have.
 *
 * TODO: implement heading/section/numbered-item extraction + count/order
 * comparison between `sourceText` and `candidateText`.
 */
export async function runStructuralCheck(
  _sourceText: string,
  _candidateText: string
): Promise<StageResult<Pick<PipelineContext, "structuralCheckPassed">>> {
  throw new Error(
    "Stage 6 (structural check) not implemented yet — scaffold only."
  );
}
