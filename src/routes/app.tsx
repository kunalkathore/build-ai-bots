import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Sidebar } from "@/components/app/Sidebar";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <main className="relative mx-auto max-w-6xl px-6 py-10 md:py-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Side-effect: this file owns the layout. /app/ alone redirects via index route below.
export const _ = redirect;
