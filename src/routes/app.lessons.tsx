import { createFileRoute, Link } from "@tanstack/react-router";
import { arcs, lessons } from "@/data/lessons";
import { useProgress } from "@/lib/progress/store";

export const Route = createFileRoute("/app/lessons")({
  head: () => ({
    meta: [
      { title: "Lessons · DynamiBot AI" },
      { name: "description", content: "Interactive DynamiBot lessons across four learning arcs." },
    ],
  }),
  component: LessonsPage,
});

function LessonsPage() {
  const completed = useProgress((s) => s.completedLessons);

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-widest text-neon">/ lessons</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Four arcs. Twelve missions.
        </h1>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Every lesson ends in working code. No notebooks, no toy snippets.
        </p>
      </header>

      <div className="space-y-10">
        {arcs.map((arc, ai) => {
          const arcLessons = lessons.filter((l) => l.arc === arc.id);
          const arcDone = arcLessons.filter((l) => completed.includes(l.id)).length;
          return (
            <section key={arc.id}>
              <div className="mb-4 flex items-baseline justify-between border-b border-border pb-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-magenta">
                    Arc {ai + 1}
                  </p>
                  <h2 className="font-display text-2xl font-semibold">{arc.name}</h2>
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  {arcDone}/{arcLessons.length} cleared
                </p>
              </div>
              <ol className="grid gap-3 md:grid-cols-3">
                {arcLessons.map((l) => {
                  const done = completed.includes(l.id);
                  return (
                    <li key={l.id}>
                      <Link
                        to="/app/lessons/$lessonId"
                        params={{ lessonId: l.id }}
                        className={
                          "group block h-full rounded-lg border p-5 transition " +
                          (done
                            ? "border-neon/50 bg-neon/5"
                            : "border-border bg-card/60 hover:border-neon hover:bg-card")
                        }
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            mission {l.index.toString().padStart(2, "0")}
                          </span>
                          <span
                            className={
                              "grid h-5 w-5 place-items-center rounded-sm border text-[10px] " +
                              (done
                                ? "border-neon bg-neon/20 text-neon"
                                : "border-border text-muted-foreground")
                            }
                          >
                            {done ? "✓" : ""}
                          </span>
                        </div>
                        <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">
                          {l.title}
                        </h3>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">{l.blurb}</p>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
