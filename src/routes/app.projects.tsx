import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { projects } from "@/data/projects";
import { lessonById } from "@/data/lessons";
import { progress, useProgress } from "@/lib/progress/store";

export const Route = createFileRoute("/app/projects")({
  head: () => ({
    meta: [
      { title: "Projects · DynamiBot AI" },
      { name: "description", content: "Guided AI bot projects. Build, ship, and unlock advanced challenges." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const completed = useProgress((s) => s.completedLessons);
  const bots = useProgress((s) => s.bots);
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-widest text-amber">/ projects</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Guided bot projects.
        </h1>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Each project unlocks once you've cleared the prerequisite lessons.
          Open in the builder to ship it.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => {
          const unlocked = p.requires.every((r) => completed.includes(r));
          const built = bots.some((b) => b.name.toLowerCase().includes(p.name.split(" ")[0].toLowerCase()));
          return (
            <article
              key={p.id}
              className={
                "rounded-xl border p-6 transition " +
                (unlocked
                  ? "border-border bg-card/60 hover:border-neon"
                  : "border-border bg-card/30 opacity-60")
              }
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {p.difficulty} · {p.archetype}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
                    {p.name}
                  </h2>
                </div>
                <span
                  className={
                    "grid h-9 w-9 place-items-center rounded-md font-display text-lg " +
                    (unlocked ? "bg-neon/10 text-neon" : "bg-secondary text-muted-foreground")
                  }
                >
                  {unlocked ? "◇" : "🔒"}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.brief}</p>

              <div className="mt-5">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  requires
                </p>
                <ul className="space-y-1.5">
                  {p.requires.map((rid) => {
                    const lesson = lessonById(rid);
                    const done = completed.includes(rid);
                    return (
                      <li key={rid} className="flex items-center gap-2 font-mono text-xs">
                        <span
                          className={
                            "grid h-4 w-4 place-items-center rounded-sm border text-[9px] " +
                            (done
                              ? "border-neon bg-neon/20 text-neon"
                              : "border-border text-muted-foreground")
                          }
                        >
                          {done ? "✓" : ""}
                        </span>
                        <span className={done ? "text-foreground" : "text-muted-foreground"}>
                          {lesson?.title ?? rid}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-5 flex items-center justify-between">
                {built && (
                  <span className="rounded-full border border-neon/40 bg-neon/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-neon">
                    ✓ built
                  </span>
                )}
                <button
                  disabled={!unlocked}
                  onClick={() => {
                    progress.recordProjectOpen(p.name);
                    navigate({ to: "/app/builder" });
                  }}
                  className={
                    "ml-auto rounded-md px-4 py-2 font-mono text-xs uppercase tracking-widest transition " +
                    (unlocked
                      ? "bg-neon text-primary-foreground border-glow"
                      : "border border-border text-muted-foreground")
                  }
                >
                  {unlocked ? "Open in builder →" : "locked"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
