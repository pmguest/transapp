import type { PipelineContext, StageResult } from "../types";

/**
 * Stage 2 — Anonymisation. Code backbone, LLM as backstop, not the reverse.
 *
 * Detect personal names, company names, addresses, emails, phone numbers,
 * ID/account numbers in the source text. Replace each with a consistent
 * placeholder (`[PERSON_1]`, `[COMPANY_1]`, `[DATE_1]`, etc). The mapping
 * this produces is stored server-side (`entity_mappings` table) — it is
 * never sent to Gemini, OpenAI, or Anthropic. Restoration happens only at
 * stage 8.
 *
 * Hard requirement, not optional: the client base includes legal, financial,
 * and pharmaceutical work bound by confidentiality obligations, and GDPR
 * applies (EU). Sending unredacted client documents to three external AI
 * vendors is not acceptable by default.
 *
 * Known risk: entity detection can miss things over a long document, same as
 * the structural check (stage 6) — a proper NER-style detection step should
 * be the backbone, with an LLM used to double-check, not as the only line of
 * defence.
 *
 * TODO: wire a real NER backbone (e.g. a dedicated NER model/library) plus an
 * LLM backstop pass that flags anything the backbone may have missed.
 */
export async function runAnonymization(
  _extractedText: string
): Promise<
  StageResult<Pick<PipelineContext, "anonymizedText" | "entityMappings">>
> {
  throw new Error(
    "Stage 2 (anonymization) not implemented yet — scaffold only."
  );
}
