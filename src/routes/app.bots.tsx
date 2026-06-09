import { createFileRoute, Link } from "@tanstack/react-router";
import { useProgress, progress } from "@/lib/progress/store";

export const Route = createFileRoute("/app/bots")({
  head: () => ({ meta: [{ title: "My Bots · DynamiBot AI" }] }),
  component: BotsPage,
});

function BotsPage() {
  const bots = useProgress((s) => s.bots);
  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-neon">/ my bots</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Your fleet</h1>
        </div>
        <Link to="/app/builder" className="rounded-md bg-neon px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground">+ New bot</Link>
      </header>

      {bots.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
          <p className="font-mono text-sm text-muted-foreground">No bots yet. Build your first agent in the bot builder.</p>
          <Link to="/app/builder" className="mt-4 inline-block rounded-md border border-neon px-4 py-2 font-mono text-xs uppercase tracking-widest text-neon">Open builder →</Link>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {bots.map((b) => (
            <li key={b.id} className="rounded-xl border border-border bg-card/60 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold">{b.name}</h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{b.archetype} · {b.tone}</p>
                </div>
                <button onClick={() => progress.deleteBot(b.id)} className="font-mono text-[11px] uppercase tracking-widest text-destructive hover:underline">Delete</button>
              </div>
              <pre className="mt-4 max-h-32 overflow-auto rounded-md border border-border bg-background p-3 font-mono text-[11px] text-muted-foreground">{b.source}</pre>
              <div className="mt-4 flex gap-2">
                <Link to="/app/playground" className="flex-1 rounded-md border border-neon px-3 py-2 text-center font-mono text-[11px] uppercase tracking-widest text-neon">Run in playground</Link>
                <Link to="/app/builder" className="rounded-md border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-foreground">Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
