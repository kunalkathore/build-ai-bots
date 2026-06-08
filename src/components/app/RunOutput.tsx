import type { RunResult, TraceLine } from "@/lib/dyn/interpreter";

const kindColor: Record<TraceLine["kind"], string> = {
  info: "text-muted-foreground",
  ok: "text-neon",
  warn: "text-amber",
  err: "text-destructive",
  out: "text-foreground",
  bot: "text-magenta",
  user: "text-foreground/80",
};

export function RunOutput({ result }: { result: RunResult | null }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4 font-mono text-[12px]">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
          output
        </p>
        {result && !result.error && (
          <p className="text-[11px] text-neon">
            ✓ {result.trace.filter((t) => t.kind === "ok").length} ok ·{" "}
            {Object.keys(result.bots).length} bot(s) · {result.deployed.length} deployed
          </p>
        )}
      </div>
      <div className="min-h-[120px] space-y-1">
        {!result && (
          <p className="text-muted-foreground/70">— press Run to see output —</p>
        )}
        {result?.trace.map((t, i) => (
          <p key={i} className={kindColor[t.kind]}>
            {prefix(t.kind)} {t.text}
          </p>
        ))}
        {result?.error && (
          <div className="mt-2 rounded-md border border-destructive/50 bg-destructive/10 p-3">
            <p className="text-destructive">
              ✕ line {result.error.line}: {result.error.message}
            </p>
            {result.error.suggestion && (
              <p className="mt-1 text-amber">↳ {result.error.suggestion}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function prefix(k: TraceLine["kind"]) {
  switch (k) {
    case "ok":
      return "✓";
    case "err":
      return "✕";
    case "warn":
      return "!";
    case "out":
      return "→";
    case "bot":
      return "bot>";
    case "user":
      return "you>";
    default:
      return "·";
  }
}
