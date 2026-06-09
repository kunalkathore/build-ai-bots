import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · DynamiBot AI" },
      { name: "description", content: "Log in or create your DynamiBot AI account to start building bots." },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "forgot";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password is required").max(72),
});

const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Tell us your name").max(100),
  username: z.string().trim().min(3, "Min 3 characters").max(30).regex(/^[a-zA-Z0-9_-]+$/, "Letters, numbers, _ and -"),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
  confirm: z.string(),
  learning_goal: z.string().min(1, "Pick a goal"),
  accept: z.literal(true, { errorMap: () => ({ message: "Accept terms to continue" }) }),
}).refine((v) => v.password === v.confirm, { message: "Passwords don't match", path: ["confirm"] });

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/app/dashboard" });
  }, [user, authLoading, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-radial-glow" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2 font-mono text-sm">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-neon bg-background text-neon border-glow">◇</span>
          <span className="font-display text-base font-semibold tracking-tight">
            DynamiBot<span className="text-neon">.AI</span>
          </span>
        </Link>
        <Link to="/" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          ← back home
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid max-w-md px-6 py-10">
        <div className="rounded-2xl border border-border bg-card/80 p-8 backdrop-blur">
          <div className="mb-6 flex gap-1 rounded-md border border-border bg-background p-1 font-mono text-xs uppercase tracking-widest">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={
                  "flex-1 rounded-sm py-2 transition " +
                  ((mode === m || (mode === "forgot" && m === "login"))
                    ? "bg-neon text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          {mode === "login" && <LoginForm onForgot={() => setMode("forgot")} />}
          {mode === "signup" && <SignupForm />}
          {mode === "forgot" && <ForgotForm onBack={() => setMode("login")} />}

          {mode !== "forgot" && (
            <>
              <div className="my-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>
              <GoogleButton />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function GoogleButton() {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/app/dashboard" });
        if (result.error) {
          toast.error("Google sign-in failed", { description: String((result.error as Error).message ?? result.error) });
          setBusy(false);
        }
      }}
      className="flex w-full items-center justify-center gap-3 rounded-md border border-border bg-background px-4 py-3 font-mono text-xs uppercase tracking-widest transition hover:border-neon hover:text-neon disabled:opacity-50"
    >
      <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.3 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.3 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C41.1 35.9 44 30.5 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
      Continue with Google
    </button>
  );
}

function LoginForm({ onForgot }: { onForgot: () => void }) {
  const navigate = useNavigate();
  const [vals, setVals] = useState({ email: "", password: "", remember: true });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse(vals);
    if (!parsed.success) {
      setErrs(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0] as string, i.message])));
      return;
    }
    setErrs({});
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
    setBusy(false);
    if (error) { toast.error("Login failed", { description: error.message }); return; }
    toast.success("Welcome back");
    navigate({ to: "/app/dashboard" });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email" error={errs.email}>
        <input type="email" value={vals.email} onChange={(e) => setVals({ ...vals, email: e.target.value })} className={inputCls} />
      </Field>
      <Field label="Password" error={errs.password}>
        <input type="password" value={vals.password} onChange={(e) => setVals({ ...vals, password: e.target.value })} className={inputCls} />
      </Field>
      <div className="flex items-center justify-between font-mono text-[11px]">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input type="checkbox" checked={vals.remember} onChange={(e) => setVals({ ...vals, remember: e.target.checked })} className="accent-[color:var(--neon)]" />
          Remember me
        </label>
        <button type="button" onClick={onForgot} className="text-neon hover:underline">Forgot password?</button>
      </div>
      <button disabled={busy} className={btnPrimary}>{busy ? "Signing in…" : "Log in →"}</button>
    </form>
  );
}

function SignupForm() {
  const navigate = useNavigate();
  const [vals, setVals] = useState({ full_name: "", username: "", email: "", password: "", confirm: "", learning_goal: "", accept: false });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse(vals);
    if (!parsed.success) {
      setErrs(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0] as string, i.message])));
      return;
    }
    setErrs({});
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/app/dashboard`,
        data: {
          full_name: parsed.data.full_name,
          username: parsed.data.username,
          learning_goal: parsed.data.learning_goal,
        },
      },
    });
    setBusy(false);
    if (error) { toast.error("Sign up failed", { description: error.message }); return; }
    toast.success("Account created", { description: "Check your inbox to verify your email." });
    navigate({ to: "/app/dashboard" });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Full name" error={errs.full_name}>
        <input value={vals.full_name} onChange={(e) => setVals({ ...vals, full_name: e.target.value })} className={inputCls} />
      </Field>
      <Field label="Username" error={errs.username}>
        <input value={vals.username} onChange={(e) => setVals({ ...vals, username: e.target.value })} className={inputCls} />
      </Field>
      <Field label="Email address" error={errs.email}>
        <input type="email" value={vals.email} onChange={(e) => setVals({ ...vals, email: e.target.value })} className={inputCls} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Password" error={errs.password}>
          <input type="password" value={vals.password} onChange={(e) => setVals({ ...vals, password: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Confirm" error={errs.confirm}>
          <input type="password" value={vals.confirm} onChange={(e) => setVals({ ...vals, confirm: e.target.value })} className={inputCls} />
        </Field>
      </div>
      <Field label="Learning goal" error={errs.learning_goal}>
        <select value={vals.learning_goal} onChange={(e) => setVals({ ...vals, learning_goal: e.target.value })} className={inputCls}>
          <option value="">Pick one…</option>
          <option value="beginner">Learn programming from scratch</option>
          <option value="ai">Master AI fundamentals</option>
          <option value="dp">Get great at dynamic programming</option>
          <option value="career">Land a developer job</option>
          <option value="teach">Teach a class or club</option>
        </select>
      </Field>
      <label className="flex items-start gap-2 font-mono text-[11px] text-muted-foreground">
        <input type="checkbox" checked={vals.accept} onChange={(e) => setVals({ ...vals, accept: e.target.checked })} className="mt-0.5 accent-[color:var(--neon)]" />
        I accept the Terms of Service and Privacy Policy.
      </label>
      {errs.accept && <p className="font-mono text-[11px] text-destructive">{errs.accept}</p>}
      <button disabled={busy} className={btnPrimary}>{busy ? "Creating…" : "Create account →"}</button>
    </form>
  );
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const parsed = z.string().email().safeParse(email.trim());
        if (!parsed.success) { toast.error("Enter a valid email"); return; }
        setBusy(true);
        const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        setBusy(false);
        if (error) toast.error("Couldn't send reset link", { description: error.message });
        else toast.success("Check your email for the reset link");
        onBack();
      }}
      className="space-y-4"
    >
      <p className="font-mono text-xs text-muted-foreground">
        Enter your email and we'll send a link to reset your password.
      </p>
      <Field label="Email">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
      </Field>
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="flex-1 rounded-md border border-border px-4 py-3 font-mono text-xs uppercase tracking-widest hover:border-foreground">Cancel</button>
        <button disabled={busy} className={btnPrimary + " flex-1"}>{busy ? "Sending…" : "Send link"}</button>
      </div>
    </form>
  );
}

const inputCls = "w-full rounded-md border border-border bg-background px-3 py-2.5 font-mono text-sm focus:border-neon focus:outline-none";
const btnPrimary = "rounded-md bg-neon px-4 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground transition hover:opacity-90 disabled:opacity-50";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block font-mono text-[11px] text-destructive">{error}</span>}
    </label>
  );
}
