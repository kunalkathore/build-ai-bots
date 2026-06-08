import { useMemo } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  errorLine?: number;
};

// Lightweight syntax highlighter for our DSL. Renders a styled <pre> beneath a
// transparent textarea — keystrokes stay smooth, colors track the source.
export function CodeEditor({ value, onChange, rows = 18, errorLine }: Props) {
  const lines = value.split("\n");

  const highlighted = useMemo(
    () =>
      lines.map((line, i) => {
        const isErr = errorLine === i + 1;
        return (
          <div
            key={i}
            className={
              "flex min-h-[1.5em] " + (isErr ? "bg-destructive/15" : "")
            }
          >
            <span className="w-10 shrink-0 select-none pr-3 text-right text-muted-foreground/60">
              {i + 1}
            </span>
            <span className="whitespace-pre">{tokenize(line)}</span>
          </div>
        );
      }),
    [lines, errorLine],
  );

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-background font-mono text-[13px] leading-[1.5em]">
      <div className="pointer-events-none absolute inset-0 overflow-auto px-4 py-4">
        {highlighted}
      </div>
      <textarea
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="relative block w-full resize-none bg-transparent px-4 py-4 pl-[3.25rem] font-mono text-[13px] leading-[1.5em] text-transparent caret-neon outline-none"
        style={{ WebkitTextFillColor: "transparent" }}
      />
    </div>
  );
}

const KEYWORDS = new Set([
  "bot",
  "deploy",
  "to",
  "on",
  "message",
  "return",
  "memory",
  "channel",
  "print",
  "tone",
]);
const NS = new Set(["dp", "ai"]);

function tokenize(line: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  // Pull out comments first
  const commentIdx = line.indexOf("#");
  let code = line;
  let comment = "";
  if (commentIdx >= 0) {
    code = line.slice(0, commentIdx);
    comment = line.slice(commentIdx);
  }
  const re = /("[^"]*"|'[^']*'|[A-Za-z_][A-Za-z0-9_]*|\d+(?:\.\d+)?|\s+|[^\w\s])/g;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(code)) !== null) {
    const t = m[0];
    if (/^\s+$/.test(t)) {
      out.push(t);
      continue;
    }
    if (/^["']/.test(t)) {
      out.push(
        <span key={key++} className="text-amber">
          {t}
        </span>,
      );
      continue;
    }
    if (/^\d/.test(t)) {
      out.push(
        <span key={key++} className="text-amber">
          {t}
        </span>,
      );
      continue;
    }
    if (KEYWORDS.has(t)) {
      out.push(
        <span key={key++} className="text-magenta">
          {t}
        </span>,
      );
      continue;
    }
    if (NS.has(t)) {
      out.push(
        <span key={key++} className="text-neon">
          {t}
        </span>,
      );
      continue;
    }
    if (/^[A-Z]/.test(t)) {
      out.push(
        <span key={key++} className="text-foreground">
          {t}
        </span>,
      );
      continue;
    }
    out.push(
      <span key={key++} className="text-foreground/80">
        {t}
      </span>,
    );
  }
  if (comment) {
    out.push(
      <span key="cmt" className="text-muted-foreground/70">
        {comment}
      </span>,
    );
  }
  return out;
}
