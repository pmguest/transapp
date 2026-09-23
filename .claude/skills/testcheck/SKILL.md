---
name: testcheck
description: Run the full test suite, report how many tests pass and fail, and fix failures until everything passes — by fixing the app, never the test, unless the test itself is wrong, in which case ask before changing it. Use when the user says "test health", "check my tests", or invokes /testcheck.
---

# Test health check

Runs `packages/app`'s Playwright suite (the only test suite in this repo — `packages/website` has none), diagnoses any failures, and fixes them.

## 1. Run the full suite

From `packages/app`: `npm run test` (Playwright, hits a real Supabase backend — no mocks).

Record the pass/fail count exactly as reported.

## 2. If everything passes

Report the pass count and stop. Nothing to fix.

## 3. If something fails — confirm it's real before touching anything

This suite talks to a live Supabase project, and test data (signed-up users, edited profiles) can collide across runs. Before treating a failure as a real bug:

- Re-run just the failing test(s) in isolation: `npx playwright test <file>:<line>`.
- If a failure doesn't reproduce on its own, treat it as flaky/data-collision, not a regression — note it in the final report but don't change code for it.
- If a full-suite re-run shows a different set of failures than the first run, say so explicitly rather than treating either run as ground truth.
- Only move to diagnosis for failures that reproduce consistently.

## 4. Diagnose each reproducible failure

Read the failing assertion, the relevant page/component code, and recent git history for that area (`git log -p <file>`) to determine which side is wrong:

- **App bug** — the code doesn't do what the test (correctly) expects.
- **Test bug** — the test asserts something that was never a real requirement, checks stale UI text/selectors after an intentional change, or has its own race condition/timing bug unrelated to Supabase data collisions.

## 5. Fix

- **App bug** → fix the application code. Re-run that specific test to confirm it passes, then re-run the full suite.
- **Test bug** → do not edit the test. Stop, show the user the exact assertion you believe is wrong and why, and wait for their go-ahead before touching anything under `tests/`.

## 6. Repeat until green

Keep iterating (diagnose → fix app code → re-run) until the suite passes. Re-run the *whole* suite, not just the previously-failing tests, before declaring success — a fix can break something else.

## 7. Report

State the final pass/fail count, list what was fixed and why (one line each), and list anything flagged as a possibly-wrong test that's still waiting on the user's decision.
