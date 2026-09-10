import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/pipeline/orchestrator";

/**
 * POST /api/pipeline/run
 * Body: { documentId: string }
 *
 * Kicks off stages 1-8 for an already-uploaded document (see
 * `documents` table — uploading a file and creating that row is not wired
 * yet either; this route assumes a documentId that already exists).
 *
 * Scaffold only: `runPipeline` currently always throws, since every stage
 * function under src/lib/pipeline/stages/ is a stub. This route exists so
 * the request/response shape and error handling are settled before the
 * stages themselves are implemented.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const documentId = body?.documentId;

  if (typeof documentId !== "string" || !documentId) {
    return NextResponse.json(
      { error: "Missing documentId in request body." },
      { status: 400 }
    );
  }

  try {
    await runPipeline(documentId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 501 }
    );
  }
}
