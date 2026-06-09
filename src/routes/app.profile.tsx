import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Profile · DynamiBot AI" }] }),
  component: ProfilePage,
});

type Profile = {
  full_name: string | null;
  username: string | null;
  email: string | null;
  learning_goal: string | null;
  theme: string | null;
};

function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [newPwd, setNewPwd] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, username, email, learning_goal, theme").eq("id", user.id).maybeSingle().then(({ data, error }) => {
      if (error) { toast.error("Couldn't load profile"); return; }
      setProfile(data ?? { full_name: "", username: "", email: user.email ?? "", learning_goal: "", theme: "dark" });
    });
  }, [user]);

  if (!user || !profile) {
    return <p className="font-mono text-sm text-muted-foreground">Loading profile…</p>;
  }

  async function save() {
    if (!user || !profile) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      username: profile.username,
      learning_goal: profile.learning_goal,
      theme: profile.theme,
    }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error("Couldn't save", { description: error.message });
    else toast.success("Profile updated");
  }

  async function updatePassword() {
    if (newPwd.length < 8) { toast.error("Min 8 characters"); return; }
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    if (error) toast.error("Couldn't update password", { description: error.message });
    else { toast.success("Password updated"); setNewPwd(""); }
  }

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-widest text-neon">/ profile</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Account settings</h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">{profile.email}</p>
      </header>

      <section className="rounded-xl border border-border bg-card/60 p-6">
        <h2 className="mb-5 font-display text-xl font-semibold">Personal information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name">
            <input value={profile.full_name ?? ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Username">
            <input value={profile.username ?? ""} onChange={(e) => setProfile({ ...profile, username: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Learning goal">
            <select value={profile.learning_goal ?? ""} onChange={(e) => setProfile({ ...profile, learning_goal: e.target.value })} className={inputCls}>
              <option value="">Not set</option>
              <option value="beginner">Learn programming from scratch</option>
              <option value="ai">Master AI fundamentals</option>
              <option value="dp">Get great at dynamic programming</option>
              <option value="career">Land a developer job</option>
              <option value="teach">Teach a class or club</option>
            </select>
          </Field>
          <Field label="Theme">
            <select value={profile.theme ?? "dark"} onChange={(e) => setProfile({ ...profile, theme: e.target.value })} className={inputCls}>
              <option value="dark">Dark (default)</option>
              <option value="terminal">Terminal high-contrast</option>
            </select>
          </Field>
        </div>
        <button disabled={saving} onClick={save} className="mt-6 rounded-md bg-neon px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-50">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </section>

      <section className="rounded-xl border border-border bg-card/60 p-6">
        <h2 className="mb-5 font-display text-xl font-semibold">Password</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input type="password" placeholder="New password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className={inputCls + " flex-1"} />
          <button onClick={updatePassword} className="rounded-md border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-widest hover:border-neon hover:text-neon">Update password</button>
        </div>
      </section>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-border bg-background px-3 py-2.5 font-mono text-sm focus:border-neon focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
