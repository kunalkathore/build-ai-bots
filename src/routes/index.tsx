import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ThemeToggle } from "@/hooks/use-theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DynamiBot AI — Build AI Bots While Learning Programming" },
      {
        name: "description",
        content:
          "Master dynamic programming through a language built specifically for creating intelligent AI agents. Learn AI by shipping real bots.",
      },
      { property: "og:title", content: "DynamiBot AI — Build AI Bots While Learning Programming" },
      {
        property: "og:description",
        content: "A hands-on language for students, bootcampers, and AI enthusiasts.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[80vh] bg-radial-glow" />

      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <Link to="/" className="flex items-center gap-2 font-mono text-sm">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-hero text-white shadow-elevate">◇</span>
        <span className="font-display text-base font-semibold tracking-tight">
          DynamiBot<span className="text-gradient">.AI</span>
        </span>
      </Link>
      <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-widest text-muted-foreground md:flex">
        <a href="#features" className="hover:text-foreground transition">Features</a>
        <a href="#how-it-works" className="hover:text-foreground transition">How it works</a>
        <span className="flex items-center gap-1.5 opacity-60">
          Pricing
          <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 text-[9px] text-primary">soon</span>
        </span>
        <a href="#faq" className="hover:text-foreground transition">FAQ</a>
      </nav>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link to="/auth" className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition sm:inline">
          Log in
        </Link>
        <Link
          to="/auth"
          className="rounded-md bg-gradient-hero px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-elevate transition hover:translate-y-[-1px] hover:opacity-95"
        >
          Get started
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-24 md:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_var(--neon)]" />
            v0.4 · open beta · 12,408 bots deployed
          </div>
          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl lg:text-[84px]">
            Build AI bots while{" "}
            <span className="text-neon text-glow">learning</span> programming.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
            Master dynamic programming through a language built specifically for
            creating intelligent AI agents. You don't study AI — you ship it.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/auth"
              className="group inline-flex items-center gap-3 rounded-md bg-neon px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-primary-foreground border-glow transition hover:translate-y-[-2px]"
            >
              Start learning free
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-3 rounded-md border border-border px-6 py-3.5 font-mono text-sm uppercase tracking-wider transition hover:border-neon hover:text-neon"
            >
              ▶ Watch demo
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
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5">
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-neon/20 via-magenta/10 to-transparent blur-2xl" />
            <div className="scanlines relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              <div className="flex items-center gap-2 border-b border-border bg-background/60 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber" />
                <span className="h-2.5 w-2.5 rounded-full bg-neon" />
                <span className="ml-3 font-mono text-[11px] text-muted-foreground">~/missions/greet_bot.dyn</span>
              </div>
              <pre className="px-6 py-6 font-mono text-[13px] leading-relaxed">
                <code>
                  <span className="text-muted-foreground"># mission 03 — your first agent</span>{"\n"}
                  <span className="text-magenta">bot</span> GreetBot {"{"}
                  {"\n  "}<span className="text-magenta">memory</span> = dp.cache(size=128)
                  {"\n  "}<span className="text-magenta">on</span> message(msg):
                  {"\n    "}<span className="text-magenta">intent</span> = ai.classify(msg)
                  {"\n    "}<span className="text-magenta">reply</span> = ai.compose(intent, tone="warm")
                  {"\n    "}<span className="text-magenta">return</span> reply
                  {"\n"}{"}"}
                  {"\n"}<span className="text-magenta">deploy</span> GreetBot to channel("slack")
                  {"\n"}<span className="text-neon cursor-blink">▍</span>
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
  );
}

function Features() {
  const items = [
    {
      icon: "▶",
      title: "Interactive Coding",
      desc: "Browser-based editor with syntax highlighting, real-time execution, and smart error suggestions. No installs required.",
    },
    {
      icon: "◇",
      title: "AI Bot Creation",
      desc: "Visual bot builder plus a custom language. Configure behavior, intents, and memory — then test live.",
    },
    {
      icon: "▣",
      title: "Dynamic Programming Visualizer",
      desc: "Watch memo tables fill cell-by-cell. See exactly how your agent caches state and reaches decisions.",
    },
    {
      icon: "◆",
      title: "Real-World Projects",
      desc: "Ship FAQ bots, pathfinders, trading agents, and tutors. Unlock advanced challenges as you progress.",
    },
  ];
  return (
    <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-28">
      <div className="mb-16 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-neon">/ features</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Everything you need to learn AI — in one console.
        </h2>
      </div>
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
        {items.map((f) => (
          <div key={f.title} className="group bg-background p-8 transition hover:bg-card">
            <span className="grid h-12 w-12 place-items-center rounded-md border border-neon/40 bg-neon/5 text-2xl text-neon transition group-hover:border-glow">
              {f.icon}
            </span>
            <h3 className="mt-6 font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Learn Concepts", d: "Bite-sized lessons explain dynamic programming and AI primitives with live examples." },
    { n: "02", t: "Build Bots", d: "Use the visual builder or write `.dyn` code to assemble agents with memory and intents." },
    { n: "03", t: "Complete Challenges", d: "Solve guided missions. Every concept lands in a working, deployable bot." },
    { n: "04", t: "Track Progress", d: "Dashboard, streaks, and achievements turn the learning curve into a leaderboard." },
  ];
  return (
    <section id="how-it-works" className="relative z-10 border-t border-border bg-card/30 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-magenta">/ how it works</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Four steps from zero to deployed agent.
          </h2>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="bg-background p-8">
              <p className="font-display text-5xl font-bold text-neon">{s.n}</p>
              <h3 className="mt-5 font-display text-xl font-semibold">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { q: "My students built deployable Slack bots in week two. That used to be a capstone.", a: "M. Okafor", r: "Lead, Lagos AI Bootcamp" },
    { q: "Finally — a language where DP isn't a leetcode trick, it's the engine of the bot.", a: "R. Tanaka", r: "CS Instructor, Tokyo" },
    { q: "Our club went from 'how does AI work?' to shipping six bots in a semester.", a: "J. Ortiz", r: "Founder, Latinx in AI Club" },
  ];
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-28">
      <div className="mb-14 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-amber">/ testimonials</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Built with educators. Loved by learners.
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((t) => (
          <figure key={t.a} className="rounded-xl border border-border bg-card/60 p-6 backdrop-blur">
            <blockquote className="font-display text-base leading-relaxed">"{t.q}"</blockquote>
            <figcaption className="mt-6 font-mono text-xs text-muted-foreground">
              <span className="text-neon">{t.a}</span> · {t.r}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    { q: "Do I need to know how to code already?", a: "No. DynamiBot AI is designed for beginners. The first arc assumes zero programming experience." },
    { q: "Is it really free?", a: "The core curriculum and playground are free forever. Pricing for classroom and team features is coming soon." },
    { q: "What can I actually build?", a: "Chatbots, FAQ bots, trading agents, pathfinders, tutors — anything an agent + a memory cache can do." },
    { q: "Do I need to install anything?", a: "Nothing. Everything runs in your browser. Write code, run it, deploy it, all from one tab." },
    { q: "How is this different from a Python AI course?", a: "DynamiBot is a language built around bots. Dynamic programming and AI primitives are first-class — not bolted on." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative z-10 border-t border-border bg-card/30 py-28">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-magenta">/ faq</p>
        <h2 className="mt-3 mb-12 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Quick answers.
        </h2>
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <li key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-card"
                >
                  <span className="font-display text-base font-semibold">{it.q}</span>
                  <span className={"font-mono text-neon transition " + (isOpen ? "rotate-45" : "")}>+</span>
                </button>
                {isOpen && <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{it.a}</p>}
              </li>
            );
          })}
        </ul>

        <div className="mt-16 rounded-2xl border border-neon/50 bg-card p-10 text-center border-glow">
          <h3 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Your first bot is <span className="text-neon">one mission</span> away.
          </h3>
          <Link to="/auth" className="mt-6 inline-block rounded-md bg-neon px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-primary-foreground">
            Start learning free →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 font-mono text-xs text-muted-foreground md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-neon text-neon">◇</span>
          <span>© 2026 DynamiBot AI · Build AI bots while learning programming.</span>
        </div>
        <div className="flex gap-6 uppercase tracking-widest">
          <a href="#features" className="hover:text-foreground">features</a>
          <a href="#how-it-works" className="hover:text-foreground">how it works</a>
          <a href="#faq" className="hover:text-foreground">faq</a>
          <Link to="/auth" className="hover:text-foreground">sign in</Link>
        </div>
      </div>
    </footer>
  );
}
