import type { PipelineContext, StageResult } from "../types";

/**
 * Stage 1 — Extraction. Code, not a prompt.
 *
 * Pull all text from the uploaded document (DOCX, PDF text-layer for alpha)
 * in correct reading order, including side/marginal content (labels,
 * captions, sidebar figures) that a naive text-only extraction can miss.
 *
 * Alpha scope: text + DOCX + PDF-text-layer input only (no OCR, no
 * PDF-as-image). A real client document this week had per-property
 * opening-year labels silently missing at exactly this stage — verify
 * completeness before proceeding (an LLM comparing extracted text against a
 * rendered page image is a reasonable spot-check, but extraction itself must
 * be a proper parser, not a model guessing at layout).
 *
 * TODO: wire a DOCX parser (e.g. mammoth) and a PDF text-layer parser (e.g.
 * pdf-parse), preserving reading order for multi-column/sidebar content.
 */
export async function runExtraction(
  _fileBuffer: Buffer,
  _fileType: "docx" | "pdf" | "text"
): Promise<StageResult<Pick<PipelineContext, "extractedText">>> {
  throw new Error("Stage 1 (extraction) not implemented yet — scaffold only.");
}
