import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/hooks/use-theme";

const items = [
  { to: "/app/dashboard", label: "Dashboard", glyph: "▣" },
  { to: "/app/playground", label: "Playground", glyph: "▶" },
  { to: "/app/builder", label: "Bot Builder", glyph: "◇" },
  { to: "/app/bots", label: "My Bots", glyph: "◈" },
  { to: "/app/lessons", label: "Lessons", glyph: "✦" },
  { to: "/app/projects", label: "Projects", glyph: "◆" },
  { to: "/app/profile", label: "Profile", glyph: "◉" },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const initial = (user?.user_metadata?.full_name as string | undefined)?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "L";

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur md:flex">
      <Link to="/" className="flex items-center justify-between gap-2 border-b border-border px-5 py-5">
        <span className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-hero text-white shadow-elevate">◇</span>
          <span className="font-display text-base font-semibold tracking-tight">
            DynamiBot<span className="text-gradient">.AI</span>
          </span>
        </span>
      </Link>
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {items.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "flex items-center gap-3 rounded-md px-3 py-2.5 font-mono text-xs uppercase tracking-widest transition " +
                (active
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent")
              }
            >
              <span className={active ? "text-primary" : "text-muted-foreground"}>{item.glyph}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
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
      <div className="border-t border-border p-4">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-neon/20 text-neon font-semibold">{initial}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-foreground">{user.user_metadata?.username ?? user.email}</p>
                <p>signed in</p>
              </div>
            </div>
            <button
              onClick={async () => { await signOut(); navigate({ to: "/" }); }}
              className="w-full rounded-md border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-destructive hover:text-destructive"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link to="/auth" className="block w-full rounded-md border border-neon px-3 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-neon">
            Sign in
          </Link>
        )}
      </div>
    </aside>
  );
}
