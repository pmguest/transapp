import type { PipelineContext, StageResult } from "../types";

/**
 * Stage 7 — Figures & formatting check. Code, not a prompt.
 *
 * Normalise dates, decimals, currency, and thousand-separator conventions to
 * the target locale (e.g. Spanish "1.234,56" -> English "1,234.56").
 *
 * Same reasoning as stage 6: exhaustive, mechanical checks belong in code,
 * not in a model's judgment, because models can silently miss instances
 * across a long document.
 *
 * TODO: implement locale-aware number/date/currency detection + conversion
 * for `candidateText`, keyed off `sourceLocale`/`targetLocale`.
 */
export async function runFiguresFormattingCheck(
  _candidateText: string,
  _sourceLocale: string,
  _targetLocale: string
): Promise<
  StageResult<Pick<PipelineContext, "figuresFormattingCheckPassed">>
> {
  throw new Error(
    "Stage 7 (figures & formatting check) not implemented yet — scaffold only."
  );
}
