import { Link, useRouterState } from "@tanstack/react-router";

const items = [
  { to: "/app/dashboard", label: "Dashboard", glyph: "▣" },
  { to: "/app/playground", label: "Playground", glyph: "▶" },
  { to: "/app/builder", label: "Bot Builder", glyph: "◇" },
  { to: "/app/lessons", label: "Lessons", glyph: "✦" },
  { to: "/app/projects", label: "Projects", glyph: "◆" },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur md:flex">
      <Link to="/" className="flex items-center gap-2 border-b border-border px-5 py-5">
        <span className="grid h-8 w-8 place-items-center rounded-md border border-neon bg-background text-neon border-glow">◇</span>
        <span className="font-display text-base font-semibold tracking-tight">
          DynamiBot<span className="text-neon">.AI</span>
        </span>
      </Link>
      <nav className="flex-1 space-y-1 px-3 py-6">
        {items.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "flex items-center gap-3 rounded-md px-3 py-2.5 font-mono text-xs uppercase tracking-widest transition " +
                (active
                  ? "bg-neon/10 text-neon border border-neon/30"
                  : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent")
              }
            >
              <span className={active ? "text-neon" : "text-muted-foreground"}>{item.glyph}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-foreground">L</span>
          <div>
            <p className="text-foreground">learner</p>
            <p>v0.4 · beta</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
