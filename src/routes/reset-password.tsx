import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password · DynamiBot AI" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pwd.length < 8) { toast.error("Min 8 characters"); return; }
    if (pwd !== confirm) { toast.error("Passwords don't match"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setBusy(false);
    if (error) { toast.error("Couldn't update", { description: error.message }); return; }
    toast.success("Password updated");
    navigate({ to: "/app/dashboard" });
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-radial-glow" />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2 font-mono text-sm">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-neon bg-background text-neon border-glow">◇</span>
          <span className="font-display text-base font-semibold tracking-tight">DynamiBot<span className="text-neon">.AI</span></span>
        </Link>
      </header>
      <main className="relative z-10 mx-auto max-w-md px-6 py-10">
        <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-card/80 p-8 backdrop-blur">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Set a new password</h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">Choose something you'll remember.</p>
          </div>
          <label className="block">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">New password</span>
            <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 font-mono text-sm focus:border-neon focus:outline-none" />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Confirm</span>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2.5 font-mono text-sm focus:border-neon focus:outline-none" />
          </label>
          <button disabled={busy} className="w-full rounded-md bg-neon px-4 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </main>
    </div>
  );
}
