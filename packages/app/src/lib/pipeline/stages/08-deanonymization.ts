import type { EntityMapping, PipelineContext, StageResult } from "../types";

/**
 * Stage 8 — De-anonymisation. Code, exact table lookup, not an AI call.
 *
 * Restore real names, companies, etc. from the mapping table produced by
 * stage 2 (`entity_mappings`). Last step before output.
 *
 * TODO: implement placeholder -> real-value substitution over `candidateText`
 * using `entityMappings`. Should fail loudly (not silently pass through) if
 * a placeholder appears in the text with no matching mapping row.
 */
export async function runDeanonymization(
  _candidateText: string,
  _entityMappings: EntityMapping[]
): Promise<StageResult<Pick<PipelineContext, "finalText">>> {
  throw new Error(
    "Stage 8 (deanonymization) not implemented yet — scaffold only."
  );
}
