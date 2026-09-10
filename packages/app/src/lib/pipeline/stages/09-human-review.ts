/**
 * Stage 9 — Mandatory human certified review.
 *
 * Unchanged existing hard rule: required, not optional, for any contractual
 * or liability-bearing content. Recommended but not mandatory for
 * lower-stakes content (a bar menu, a garage repair estimate).
 *
 * This is not a pipeline function that runs code — it's a human decision.
 * The orchestrator's job for this stage is only to stop and set
 * `documents.status = 'awaiting_human_review'` once stage 8 completes; there
 * is no automatic transition to 'complete'.
 *
 * TODO: build the review UI/workflow (approve/reject, edits) once alpha's
 * upload -> stage 1-8 path is working end to end. Out of scope for this
 * scaffold.
 */
export {};
