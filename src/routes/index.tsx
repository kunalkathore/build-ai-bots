import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DynamiBot AI — Learn AI by Building Real Bots" },
      {
        name: "description",
        content:
          "A custom programming language that teaches AI through dynamic programming. Build, train, and deploy intelligent bots from your first line of code.",
      },
      { property: "og:title", content: "DynamiBot AI — Learn AI by Building Real Bots" },
      {
        property: "og:description",
        content:
          "Learn AI by building real bots. A hands-on language for students, bootcampers, and AI enthusiasts.",
      },
    ],
  }),
  component: Index,
});

const codeLines = [
  { p: "bot", t: " GreetBot {" },
  { p: "  memory", t: " = dp.cache(size=128)" },
  { p: "  on", t: " message(msg):" },
  { p: "    intent", t: " = ai.classify(msg)" },
  { p: "    reply", t: " = ai.compose(intent, tone=\"warm\")" },
  { p: "    return", t: " reply" },
  { p: "}", t: "" },
  { p: "deploy", t: " GreetBot to channel(\"slack\")" },
];

function Index() {
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTyped((n) => (n + 1) % (codeLines.length + 1)), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[80vh] bg-radial-glow" />

      {/* NAV */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="#" className="flex items-center gap-2 font-mono text-sm">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-neon bg-background text-neon border-glow">
            ◇
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            DynamiBot<span className="text-neon">.AI</span>
          </span>
        </a>
        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-widest text-muted-foreground md:flex">
          <a href="#language" className="hover:text-foreground">/language</a>
          <a href="#curriculum" className="hover:text-foreground">/curriculum</a>
          <a href="#playground" className="hover:text-foreground">/playground</a>
          <a href="#educators" className="hover:text-foreground">/educators</a>
        </nav>
        <a
          href="#playground"
          className="rounded-md border border-neon bg-neon px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-primary-foreground transition hover:bg-transparent hover:text-neon"
        >
          Launch console
        </a>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-24 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_var(--neon)]" />
              v0.4 · open beta · 12,408 bots deployed
            </div>
            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl lg:text-[88px]">
              Learn AI by{" "}
              <span className="text-neon text-glow">building</span>
              <br />
              real bots.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              DynamiBot AI is a custom programming language that fuses dynamic programming
              with intelligent agents. You don't study AI — you ship it, one bot at a time.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#playground"
                className="group inline-flex items-center gap-3 rounded-md bg-neon px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-primary-foreground border-glow transition hover:translate-y-[-2px]"
              >
                Start building
                <span className="transition group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#curriculum"
                className="inline-flex items-center gap-3 rounded-md border border-border px-6 py-3.5 font-mono text-sm uppercase tracking-wider text-foreground transition hover:border-neon hover:text-neon"
              >
                See the curriculum
              </a>
            </div>

            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["32", "guided missions"],
                ["7", "bot archetypes"],
                ["∞", "deploy targets"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl font-bold text-neon">{n}</dt>
                  <dd className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* code window */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-neon/20 via-magenta/10 to-transparent blur-2xl" />
              <div className="scanlines relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
                <div className="flex items-center gap-2 border-b border-border bg-background/60 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber" />
                  <span className="h-2.5 w-2.5 rounded-full bg-neon" />
                  <span className="ml-3 font-mono text-[11px] text-muted-foreground">
                    ~/missions/greet_bot.dyn
                  </span>
                </div>
                <pre className="px-6 py-6 font-mono text-[13px] leading-relaxed">
                  <code>
                    <span className="text-muted-foreground"># mission 03 — your first agent</span>
                    {"\n"}
                    {codeLines.slice(0, typed).map((l, i) => (
                      <span key={i} className="block animate-float-up">
                        <span className="text-magenta">{l.p}</span>
                        <span className="text-foreground">{l.t}</span>
                      </span>
                    ))}
                    {typed < codeLines.length && (
                      <span className="text-neon cursor-blink">▍</span>
                    )}
                  </code>
                </pre>
                <div className="border-t border-border bg-background/40 px-6 py-3 font-mono text-[11px] text-neon">
                  ✓ compiled · 1 bot · 0 errors · deployed in 240ms
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <section className="relative z-10 border-y border-border bg-card/40 py-4">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-ticker gap-12 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {Array.from({ length: 2 }).flatMap((_, k) =>
              [
                "memoization → smarter agents",
                "tabulation → faster training",
                "policy bots · chat bots · trading bots",
                "deploy to slack · discord · web · cli",
                "built for bootcamps & classrooms",
                "open language · runs anywhere",
              ].map((t, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-12">
                  <span>◆ {t}</span>
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* LANGUAGE */}
      <section id="language" className="relative z-10 mx-auto max-w-7xl px-6 py-28">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-neon">/ the language</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              A syntax built for agents.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            DynamiBot reads like English, compiles to fast bot runtimes, and
            teaches dynamic programming as a side effect of building things you'd
            actually use.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {[
            {
              k: "01",
              t: "bot { } blocks",
              d: "Define an agent like a class — memory, intents, behaviors, all in one place.",
            },
            {
              k: "02",
              t: "dp.* primitives",
              d: "First-class memoization, tabulation, and recurrence relations — DP without the headache.",
            },
            {
              k: "03",
              t: "ai.* primitives",
              d: "Classify, compose, embed, and reason without juggling five different APIs.",
            },
            {
              k: "04",
              t: "deploy targets",
              d: "Ship the same bot to Slack, Discord, web widget, or CLI with one keyword.",
            },
            {
              k: "05",
              t: "live tracing",
              d: "Watch your agent think — every cached state, every decision, in real time.",
            },
            {
              k: "06",
              t: "missions, not lessons",
              d: "Every concept lands in a working bot. No toy examples that die in a notebook.",
            },
          ].map((f) => (
            <div
              key={f.k}
              className="group relative bg-background p-8 transition hover:bg-card"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs text-muted-foreground">{f.k}</span>
                <span className="h-2 w-2 rounded-full bg-border transition group-hover:bg-neon group-hover:shadow-[0_0_12px_var(--neon)]" />
              </div>
              <h3 className="mt-6 font-mono text-lg font-semibold text-foreground">{f.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM */}
      <section id="curriculum" className="relative z-10 border-t border-border bg-card/30 py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14">
            <p className="font-mono text-xs uppercase tracking-widest text-magenta">/ curriculum</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-5xl">
              Four arcs. Thirty-two missions. One language tying it all together.
            </h2>
          </div>

          <ol className="space-y-px overflow-hidden rounded-xl border border-border bg-border">
            {[
              {
                arc: "Arc I",
                title: "First Contact",
                items: ["Hello, bot.", "Memory & state", "Conversations as graphs"],
                mins: "08",
              },
              {
                arc: "Arc II",
                title: "Dynamic Minds",
                items: ["Memoization patterns", "Tabulation in practice", "Optimal policies"],
                mins: "10",
              },
              {
                arc: "Arc III",
                title: "Intelligent Agents",
                items: ["Classification bots", "Tool-using agents", "Multi-bot orchestration"],
                mins: "08",
              },
              {
                arc: "Arc IV",
                title: "Ship It",
                items: ["Deploy to Slack", "Evaluate & iterate", "Capstone: your own bot"],
                mins: "06",
              },
            ].map((a, i) => (
              <li
                key={a.arc}
                className="group grid grid-cols-12 items-center gap-6 bg-background px-8 py-10 transition hover:bg-card"
              >
                <div className="col-span-12 md:col-span-2">
                  <p className="font-mono text-xs uppercase tracking-widest text-neon">{a.arc}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {a.mins} missions
                  </p>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                    {a.title}
                  </h3>
                </div>
                <ul className="col-span-12 space-y-2 md:col-span-4">
                  {a.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-center gap-3 font-mono text-sm text-muted-foreground"
                    >
                      <span className="text-neon">→</span> {it}
                    </li>
                  ))}
                </ul>
                <div className="col-span-12 text-right md:col-span-1">
                  <span className="font-display text-3xl font-bold text-border transition group-hover:text-neon">
                    0{i + 1}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PLAYGROUND */}
      <section id="playground" className="relative z-10 mx-auto max-w-7xl px-6 py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-amber">/ playground</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Your console. <br />
              <span className="text-neon">Your agents.</span> <br />
              Live, in the browser.
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              No setup, no Docker, no "it works on my machine." Open a tab,
              write a bot, watch it think. Share a link, let someone else talk to it.
            </p>
            <ul className="mt-10 space-y-4 font-mono text-sm">
              {[
                "Hot-reload bots in under 100ms",
                "Inspect every cached DP state",
                "Replay conversations frame-by-frame",
                "Fork any mission, remix any bot",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-sm border border-neon text-[10px] text-neon">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* terminal */}
          <div className="scanlines relative overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border bg-background/60 px-4 py-3 font-mono text-[11px] text-muted-foreground">
              <span>● live · trader_bot.dyn</span>
              <span>region: us-east</span>
            </div>
            <div className="space-y-3 px-6 py-6 font-mono text-[13px]">
              <p><span className="text-muted-foreground">user&gt;</span> what's the cheapest path?</p>
              <p className="text-neon">bot.thinking → memo[hit] · 14 states explored</p>
              <p><span className="text-magenta">bot&gt;</span> route via NYC → LIS — saved $214 (DP cache: 92%)</p>
              <p><span className="text-muted-foreground">user&gt;</span> add a layover under 3h</p>
              <p className="text-neon">bot.thinking → recompute · tabulate(constraint)</p>
              <p><span className="text-magenta">bot&gt;</span> updated. LHR layover, total $891.</p>
              <p><span className="text-amber">● deployed to slack #travel — 4 active conversations</span></p>
              <p className="flex items-center">
                <span className="text-muted-foreground">user&gt;</span>
                <span className="ml-2 text-neon cursor-blink">▍</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATORS */}
      <section
        id="educators"
        className="relative z-10 border-t border-border bg-gradient-to-b from-card/30 to-background py-28"
      >
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-magenta">
            / for educators
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl">
            Stop teaching AI in PDFs. Start teaching it in pull requests.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            DynamiBot ships with a classroom dashboard, auto-graded missions, and
            student bot galleries. Built with bootcamp leads, used by AI clubs.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="rounded-md bg-neon px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-primary-foreground border-glow"
            >
              Request a classroom
            </a>
            <a
              href="#"
              className="rounded-md border border-border px-6 py-3.5 font-mono text-sm uppercase tracking-wider hover:border-neon hover:text-neon"
            >
              Read the syllabus →
            </a>
          </div>

          <div className="mt-20 grid gap-6 text-left md:grid-cols-3">
            {[
              {
                q: "My students built deployable Slack bots in week two. That used to be a capstone.",
                a: "M. Okafor",
                r: "Lead, Lagos AI Bootcamp",
              },
              {
                q: "Finally — a language where DP isn't a leetcode trick, it's the engine of the bot.",
                a: "R. Tanaka",
                r: "CS Instructor, Tokyo",
              },
              {
                q: "Our club went from 'how does AI work?' to shipping six bots in a semester.",
                a: "J. Ortiz",
                r: "Founder, Latinx in AI Club",
              },
            ].map((t) => (
              <figure
                key={t.a}
                className="rounded-xl border border-border bg-card/60 p-6 backdrop-blur"
              >
                <blockquote className="font-display text-base leading-relaxed text-foreground">
                  "{t.q}"
                </blockquote>
                <figcaption className="mt-6 font-mono text-xs text-muted-foreground">
                  <span className="text-neon">{t.a}</span> · {t.r}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-28">
        <div className="relative overflow-hidden rounded-2xl border border-neon/50 bg-card p-12 md:p-20 border-glow">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <h3 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                Your first bot is{" "}
                <span className="text-neon">one mission</span> away.
              </h3>
              <p className="mt-4 max-w-md text-muted-foreground">
                Free forever for learners. No credit card, no installs. Just
                open the console and start typing.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                placeholder="you@learning.dev"
                className="flex-1 rounded-md border border-border bg-background px-4 py-3.5 font-mono text-sm placeholder:text-muted-foreground focus:border-neon focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-neon px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-primary-foreground transition hover:opacity-90"
              >
                Get access
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 font-mono text-xs text-muted-foreground md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-md border border-neon text-neon">◇</span>
            <span>© 2026 DynamiBot AI · Learn AI by building real bots.</span>
          </div>
          <div className="flex gap-6 uppercase tracking-widest">
            <a href="#" className="hover:text-foreground">docs</a>
            <a href="#" className="hover:text-foreground">github</a>
            <a href="#" className="hover:text-foreground">discord</a>
            <a href="#" className="hover:text-foreground">changelog</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
