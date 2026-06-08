import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CodeEditor } from "@/components/app/CodeEditor";
import { DpTable } from "@/components/app/DpTable";
import { RunOutput } from "@/components/app/RunOutput";
import { lessonById, nextLesson } from "@/data/lessons";
import { run, type RunResult } from "@/lib/dyn/interpreter";
import { progress, useProgress } from "@/lib/progress/store";

export const Route = createFileRoute("/app/lessons/$lessonId")({
  head: ({ params }) => {
    const l = lessonById(params.lessonId);
    return {
      meta: [
        { title: l ? `${l.title} · DynamiBot Lesson` : "Lesson · DynamiBot AI" },
        { name: "description", content: l?.blurb ?? "DynamiBot lesson" },
      ],
    };
  },
  loader: ({ params }) => {
    const l = lessonById(params.lessonId);
    if (!l) throw notFound();
    return { lesson: l };
  },
  component: LessonDetail,
  notFoundComponent: () => (
    <div className="rounded-lg border border-border bg-card/60 p-8 text-center">
      <p className="font-mono text-sm text-muted-foreground">Lesson not found.</p>
      <Link to="/app/lessons" className="mt-3 inline-block font-mono text-xs text-neon">
        ← back to lessons
      </Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
      <p className="font-mono text-sm text-destructive">Something went wrong loading this lesson.</p>
      <button onClick={reset} className="mt-3 font-mono text-xs text-neon">retry</button>
    </div>
  ),
});

function LessonDetail() {
  const { lesson } = Route.useLoaderData();
  const [code, setCode] = useState(lesson.starter);
  const [result, setResult] = useState<RunResult | null>(null);
  const completed = useProgress((s) => s.completedLessons);
  const isDone = completed.includes(lesson.id);
  const nxt = useMemo(() => nextLesson(lesson.id), [lesson.id]);

  function runCode() {
    const r = run(code);
    setResult(r);
    progress.recordRun(`Ran lesson: ${lesson.title}`);
  }

  function check() {
    const r = run(code);
    setResult(r);
    if (r.error) return;
    const passed =
      lesson.expect.kind === "var"
        ? String(r.vars[lesson.expect.name]) === String(lesson.expect.value)
        : r.trace.some((t) => t.text.includes(lesson.expect.contains));
    if (passed) progress.completeLesson(lesson.id, lesson.title);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Link to="/app/lessons" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-neon">
            ← lessons
          </Link>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            mission {lesson.index.toString().padStart(2, "0")} · arc {lesson.arcIndex + 1}
          </p>
        </div>
        {isDone && (
          <span className="rounded-full border border-neon/50 bg-neon/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-neon">
            ✓ completed
          </span>
        )}
      </header>

      <div className="rounded-xl border border-border bg-card/40 p-5">
        <p className="text-foreground/90">{lesson.body}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <CodeEditor value={code} onChange={setCode} errorLine={result?.error?.line} rows={14} />
          <div className="flex gap-2">
            <button
              onClick={runCode}
              className="rounded-md border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest hover:border-neon hover:text-neon"
            >
              ▶ Run
            </button>
            <button
              onClick={check}
              className="rounded-md bg-neon px-5 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground border-glow"
            >
              Check answer
            </button>
            <button
              onClick={() => setCode(lesson.starter)}
              className="ml-auto rounded-md border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-magenta hover:text-magenta"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <RunOutput result={result} />
          {result?.dp && (
            <div className="min-h-[240px]">
              <DpTable result={result.dp} />
            </div>
          )}
        </div>
      </div>

      {isDone && nxt && (
        <div className="flex items-center justify-between rounded-lg border border-neon/40 bg-neon/5 p-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-neon">next mission</p>
            <p className="font-display text-lg font-semibold">{nxt.title}</p>
          </div>
          <Link
            to="/app/lessons/$lessonId"
            params={{ lessonId: nxt.id }}
            className="rounded-md bg-neon px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground"
          >
            Continue →
          </Link>
        </div>
      )}
    </div>
  );
}
