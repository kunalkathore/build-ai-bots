import { createFileRoute, Link } from "@tanstack/react-router";
import { useProgress } from "@/lib/progress/store";
import { lessons } from "@/data/lessons";
import { achievements } from "@/data/achievements";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · DynamiBot AI" },
      { name: "description", content: "Your DynamiBot AI learning progress, bots, and achievements." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const state = useProgress((s) => s);
  const nextLesson = lessons.find((l) => !state.completedLessons.includes(l.id));
  const lessonPct = Math.round((state.completedLessons.length / lessons.length) * 100);

  const stats = [
    { label: "lessons cleared", value: `${state.completedLessons.length}/${lessons.length}` },
    { label: "bots deployed", value: state.bots.length },
    { label: "day streak", value: state.streakDays },
    { label: "achievements", value: `${state.achievements.length}/${achievements.length}` },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-neon">/ console</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Welcome back, learner.
          </h1>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            {nextLesson ? `Next up: ${nextLesson.title}` : "All lessons cleared. Build something wild."}
          </p>
        </div>
        {nextLesson ? (
          <Link
            to="/app/lessons/$lessonId"
            params={{ lessonId: nextLesson.id }}
            className="rounded-md bg-neon px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground border-glow"
          >
            Continue learning →
          </Link>
        ) : (
          <Link
            to="/app/builder"
            className="rounded-md bg-neon px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground border-glow"
          >
            Build a new bot →
          </Link>
        )}
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card/60 p-5 backdrop-blur">
            <p className="font-display text-3xl font-bold text-neon">{s.value}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card/60 p-6 lg:col-span-2">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold">Curriculum progress</h2>
            <p className="font-mono text-xs text-muted-foreground">{lessonPct}%</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-neon transition-all" style={{ width: `${lessonPct}%` }} />
          </div>
          <ul className="mt-6 space-y-2">
            {lessons.slice(0, 6).map((l) => {
              const done = state.completedLessons.includes(l.id);
              return (
                <li key={l.id} className="flex items-center justify-between font-mono text-xs">
                  <span className="flex items-center gap-3">
                    <span
                      className={
                        "grid h-5 w-5 place-items-center rounded-sm border text-[10px] " +
                        (done ? "border-neon bg-neon/20 text-neon" : "border-border text-muted-foreground")
                      }
                    >
                      {done ? "✓" : ""}
                    </span>
                    <Link
                      to="/app/lessons/$lessonId"
                      params={{ lessonId: l.id }}
                      className="hover:text-neon"
                    >
                      {l.title}
                    </Link>
                  </span>
                  <span className="text-muted-foreground">Arc {l.arcIndex + 1}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card/60 p-6">
          <h2 className="mb-4 font-display text-xl font-semibold">Recent activity</h2>
          {state.activity.length === 0 ? (
            <p className="font-mono text-xs text-muted-foreground">
              No activity yet. Run a lesson or build a bot to see your timeline.
            </p>
          ) : (
            <ul className="space-y-3">
              {state.activity.slice(0, 8).map((a) => (
                <li key={a.id} className="border-l-2 border-neon/40 pl-3 font-mono text-xs">
                  <p className="text-foreground">{a.text}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {timeAgo(a.at)} · {a.kind}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold">Achievements</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {achievements.map((a) => {
            const earned = state.achievements.includes(a.id);
            return (
              <div
                key={a.id}
                className={
                  "rounded-lg border p-4 transition " +
                  (earned
                    ? "border-neon/50 bg-neon/5 border-glow"
                    : "border-border bg-card/40 opacity-60")
                }
              >
                <div
                  className={
                    "mb-2 grid h-10 w-10 place-items-center rounded-md font-display text-lg " +
                    (earned ? "bg-neon text-primary-foreground" : "bg-secondary text-muted-foreground")
                  }
                >
                  {a.glyph}
                </div>
                <p className="font-mono text-xs font-semibold text-foreground">{a.name}</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">{a.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function timeAgo(t: number) {
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}
