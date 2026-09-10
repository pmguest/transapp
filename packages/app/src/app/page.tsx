export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "4rem auto", fontFamily: "sans-serif" }}>
      <h1>transapp pipeline (alpha)</h1>
      <p>
        Scaffold only — no upload UI wired yet. Pipeline stages live in{" "}
        <code>src/lib/pipeline/</code>, per{" "}
        <code>PIPELINE-ARCHITECTURE.md</code> at the repo root.
      </p>
    </main>
  );
}
