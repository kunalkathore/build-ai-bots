import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CodeEditor } from "@/components/app/CodeEditor";
import { run, runBotReply, type BotDef } from "@/lib/dyn/interpreter";
import { progress, useProgress } from "@/lib/progress/store";

export const Route = createFileRoute("/app/builder")({
  head: () => ({
    meta: [
      { title: "Bot Builder · DynamiBot AI" },
      { name: "description", content: "Configure an AI bot visually, preview the generated code, and test it live." },
    ],
  }),
  component: Builder,
});

type Form = {
  name: string;
  archetype: "Greeter" | "Classifier" | "Trader" | "Tutor" | "FAQ";
  tone: "warm" | "formal" | "playful";
  memorySize: number;
  intents: string[];
  target: "slack" | "discord" | "web" | "cli";
};

function generateSource(f: Form): string {
  return `bot ${f.name || "MyBot"} {
  memory = dp.cache(size=${f.memorySize})
  tone = "${f.tone}"
  on message(msg):
    intent = ai.classify(msg)
    reply = ai.compose(intent, tone="${f.tone}")
    return reply
}

deploy ${f.name || "MyBot"} to channel("${f.target}")
`;
}

function Builder() {
  const [form, setForm] = useState<Form>({
    name: "ConciergeBot",
    archetype: "Greeter",
    tone: "warm",
    memorySize: 128,
    intents: ["greet", "help", "thanks", "goodbye"],
    target: "slack",
  });
  const [intentInput, setIntentInput] = useState("");
  const source = useMemo(() => generateSource(form), [form]);
  const [chat, setChat] = useState<{ from: "user" | "bot"; text: string }[]>([]);
  const [msg, setMsg] = useState("");
  const bots = useProgress((s) => s.bots);

  function update<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function send() {
    if (!msg.trim()) return;
    const result = run(source);
    const bot: BotDef | undefined = Object.values(result.bots)[0];
    if (!bot) {
      setChat((c) => [...c, { from: "user", text: msg }, { from: "bot", text: "(bot did not compile)" }]);
    } else {
      const reply = runBotReply({ ...bot, tone: form.tone }, msg);
      setChat((c) => [...c, { from: "user", text: msg }, { from: "bot", text: reply }]);
    }
    setMsg("");
  }

  function save() {
    progress.saveBot({
      name: form.name,
      archetype: form.archetype,
      tone: form.tone,
      intents: form.intents,
      source,
    });
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-widest text-magenta">/ builder</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Compose a bot. Watch the code write itself.
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* form */}
        <div className="space-y-5 rounded-xl border border-border bg-card/60 p-6">
          <Field label="Bot name">
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value.replace(/\s+/g, ""))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm focus:border-neon focus:outline-none"
            />
          </Field>

          <Field label="Archetype">
            <Pills
              value={form.archetype}
              options={["Greeter", "Classifier", "Trader", "Tutor", "FAQ"]}
              onChange={(v) => update("archetype", v as Form["archetype"])}
            />
          </Field>

          <Field label="Tone">
            <Pills
              value={form.tone}
              options={["warm", "formal", "playful"]}
              onChange={(v) => update("tone", v as Form["tone"])}
            />
          </Field>

          <Field label={`Memory size: ${form.memorySize} slots`}>
            <input
              type="range"
              min={16}
              max={512}
              step={16}
              value={form.memorySize}
              onChange={(e) => update("memorySize", Number(e.target.value))}
              className="w-full accent-[color:var(--neon)]"
            />
          </Field>

          <Field label="Intents">
            <div className="flex flex-wrap gap-2">
              {form.intents.map((it) => (
                <span
                  key={it}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 font-mono text-xs"
                >
                  {it}
                  <button
                    onClick={() => update("intents", form.intents.filter((x) => x !== it))}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={intentInput}
                onChange={(e) => setIntentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && intentInput.trim()) {
                    update("intents", [...form.intents, intentInput.trim()]);
                    setIntentInput("");
                  }
                }}
                placeholder="add intent (enter)"
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs focus:border-neon focus:outline-none"
              />
            </div>
          </Field>

          <Field label="Deploy target">
            <Pills
              value={form.target}
              options={["slack", "discord", "web", "cli"]}
              onChange={(v) => update("target", v as Form["target"])}
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button
              onClick={save}
              className="rounded-md bg-neon px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground border-glow"
            >
              Save & deploy
            </button>
          </div>
        </div>

        {/* generated code + chat */}
        <div className="space-y-4">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-neon">
              generated · {form.name || "MyBot"}.dyn
            </p>
            <CodeEditor value={source} onChange={() => undefined} rows={12} />
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-magenta">
              test chat
            </p>
            <div className="mb-3 max-h-48 min-h-[100px] space-y-2 overflow-auto font-mono text-xs">
              {chat.length === 0 && (
                <p className="text-muted-foreground/70">
                  Say hi to your bot. Try "hello", "I need help", or "thanks!"
                </p>
              )}
              {chat.map((c, i) => (
                <p
                  key={i}
                  className={c.from === "user" ? "text-foreground" : "text-magenta"}
                >
                  <span className="text-muted-foreground">{c.from}&gt;</span> {c.text}
                </p>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="message your bot…"
                className="flex-1 rounded-md border border-border bg-card px-3 py-2 font-mono text-xs focus:border-neon focus:outline-none"
              />
              <button
                onClick={send}
                className="rounded-md border border-neon bg-neon/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-neon hover:bg-neon hover:text-primary-foreground"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {bots.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-xl font-semibold">Saved bots</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {bots.map((b) => (
              <div key={b.id} className="rounded-lg border border-border bg-card/60 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-sm font-semibold text-foreground">{b.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {b.archetype} · {b.tone}
                    </p>
                  </div>
                  <button
                    onClick={() => progress.deleteBot(b.id)}
                    className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive"
                  >
                    delete
                  </button>
                </div>
                <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                  {b.intents.length} intents
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Pills({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={
              "rounded-full border px-3 py-1 font-mono text-xs transition " +
              (active
                ? "border-neon bg-neon/10 text-neon"
                : "border-border bg-background text-muted-foreground hover:text-foreground")
            }
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
