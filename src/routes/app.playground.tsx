import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CodeEditor } from "@/components/app/CodeEditor";
import { DpTable } from "@/components/app/DpTable";
import { RunOutput } from "@/components/app/RunOutput";
import { run, type RunResult } from "@/lib/dyn/interpreter";
import { progress } from "@/lib/progress/store";

export const Route = createFileRoute("/app/playground")({
  head: () => ({
    meta: [
      { title: "Playground · DynamiBot AI" },
      { name: "description", content: "Write, run, and visualize DynamiBot code in the browser." },
    ],
  }),
  component: Playground,
});

const DEFAULT_CODE = `# Try the language. Run it. Watch the table fill.

bot GreetBot {
  memory = dp.cache(size=128)
  on message(msg):
    intent = ai.classify(msg)
    reply = ai.compose(intent, tone="warm")
    return reply
}

x = dp.fib(10)
print(x)

deploy GreetBot to channel("slack")
`;

function Playground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [result, setResult] = useState<RunResult | null>(null);

  function onRun() {
    const r = run(code);
    setResult(r);
    progress.recordRun(r.error ? "Run failed in playground" : "Ran code in playground");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-neon">/ playground</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Live console
          </h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            ~/scratch.dyn · in-browser interpreter · no server roundtrip
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCode(DEFAULT_CODE)}
            className="rounded-md border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest hover:border-magenta hover:text-magenta"
          >
            Reset
          </button>
          <button
            onClick={onRun}
            className="rounded-md bg-neon px-5 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground border-glow"
          >
            ▶ Run
          </button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <CodeEditor value={code} onChange={setCode} errorLine={result?.error?.line} />
        <div className="flex flex-col gap-4">
          <RunOutput result={result} />
          <div className="min-h-[280px]">
            <DpTable result={result?.dp} />
          </div>
        </div>
      </div>

      <aside className="rounded-lg border border-border bg-card/40 p-5 font-mono text-xs text-muted-foreground">
        <p className="mb-2 text-[11px] uppercase tracking-widest text-magenta">cheat sheet</p>
        <ul className="grid gap-1 md:grid-cols-2">
          <li><span className="text-neon">bot</span> Name {"{ ... }"}</li>
          <li><span className="text-neon">deploy</span> Name <span className="text-neon">to</span> channel("slack")</li>
          <li>memory = <span className="text-neon">dp</span>.cache(size=128)</li>
          <li><span className="text-neon">on</span> message(msg): ... <span className="text-neon">return</span> reply</li>
          <li>x = <span className="text-neon">dp</span>.fib(10)</li>
          <li>y = <span className="text-neon">dp</span>.knapsack([2,3,4],[3,4,5],5)</li>
          <li>z = <span className="text-neon">dp</span>.coinChange([1,2,5],11)</li>
          <li>r = <span className="text-neon">ai</span>.classify("hello")</li>
        </ul>
      </aside>
    </div>
  );
}
