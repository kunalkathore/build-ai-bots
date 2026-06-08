// Small interpreter for the DynamiBot DSL.
// Goal: support the surface area shown in lessons/builder, with helpful errors.
//
// Supported constructs (illustrative):
//   bot Name {
//     memory = dp.cache(size=128)
//     on message(msg):
//       intent = ai.classify(msg)
//       reply = ai.compose(intent, tone="warm")
//       return reply
//   }
//   deploy Name to channel("slack")
//
//   x = dp.fib(10)
//   y = dp.knapsack([2,3,4],[3,4,5],5)
//   z = dp.coinChange([1,2,5],11)
//   print(x)

import { classify, compose } from "./ai-stub";
import { coinChange, fib, knapsack, type DpResult } from "./dp";

export type TraceLine = {
  kind: "info" | "ok" | "warn" | "err" | "out" | "bot" | "user";
  text: string;
};

export type BotDef = {
  name: string;
  memorySize?: number;
  onMessage?: string[]; // raw body lines
  tone?: string;
};

export type RunResult = {
  trace: TraceLine[];
  bots: Record<string, BotDef>;
  deployed: { bot: string; target: string }[];
  dp?: DpResult & { kind: "fib" | "knapsack" | "coinChange" };
  error?: { line: number; message: string; suggestion?: string };
  vars: Record<string, unknown>;
};

const KEYWORDS = ["bot", "on", "message", "return", "deploy", "to", "memory"];

function suggest(word: string): string | undefined {
  let best: string | undefined;
  let bestD = Infinity;
  for (const k of KEYWORDS) {
    const d = levenshtein(word, k);
    if (d < bestD && d <= 2) {
      bestD = d;
      best = k;
    }
  }
  return best;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

function parseArgs(raw: string): unknown[] {
  // Supports numbers, strings "..." or '...', simple [1,2,3] arrays, key=value pairs.
  const args: unknown[] = [];
  let depth = 0;
  let buf = "";
  let inStr: string | null = null;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (inStr) {
      buf += c;
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      buf += c;
      continue;
    }
    if (c === "[" || c === "(") depth++;
    if (c === "]" || c === ")") depth--;
    if (c === "," && depth === 0) {
      args.push(parseValue(buf.trim()));
      buf = "";
      continue;
    }
    buf += c;
  }
  if (buf.trim()) args.push(parseValue(buf.trim()));
  return args;
}

function parseValue(v: string): unknown {
  if (!v) return undefined;
  if (v.includes("=") && !v.startsWith("[")) {
    const [k, ...rest] = v.split("=");
    return { __kv: true, key: k.trim(), value: parseValue(rest.join("=").trim()) };
  }
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  if (v.startsWith("[") && v.endsWith("]")) {
    return parseArgs(v.slice(1, -1));
  }
  if (!isNaN(Number(v))) return Number(v);
  return { __ref: v }; // variable reference
}

function resolve(val: unknown, vars: Record<string, unknown>): unknown {
  if (val && typeof val === "object" && "__ref" in (val as object)) {
    const ref = (val as { __ref: string }).__ref;
    if (ref in vars) return vars[ref];
    return ref;
  }
  if (Array.isArray(val)) return val.map((v) => resolve(v, vars));
  return val;
}

function getKwargs(args: unknown[]): Record<string, unknown> {
  const kw: Record<string, unknown> = {};
  for (const a of args) {
    if (a && typeof a === "object" && "__kv" in (a as object)) {
      const { key, value } = a as { key: string; value: unknown };
      kw[key] = value;
    }
  }
  return kw;
}

function getPositional(args: unknown[]): unknown[] {
  return args.filter((a) => !(a && typeof a === "object" && "__kv" in (a as object)));
}

export function run(source: string): RunResult {
  const trace: TraceLine[] = [];
  const bots: Record<string, BotDef> = {};
  const deployed: { bot: string; target: string }[] = [];
  const vars: Record<string, unknown> = {};
  let dp: RunResult["dp"];

  const rawLines = source.split("\n");
  // strip comments (#) and trailing whitespace; keep line numbers
  const lines = rawLines.map((l) => l.replace(/#.*$/, "").trimEnd());

  let i = 0;
  try {
    while (i < lines.length) {
      const raw = lines[i];
      const line = raw.trim();
      const lineNum = i + 1;
      if (!line) {
        i++;
        continue;
      }

      // bot Name { ... }
      const botMatch = line.match(/^bot\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{?$/);
      if (botMatch) {
        const name = botMatch[1];
        const def: BotDef = { name, onMessage: [], tone: "warm" };
        i++;
        while (i < lines.length && lines[i].trim() !== "}") {
          const body = lines[i].trim();
          if (!body) {
            i++;
            continue;
          }
          const memMatch = body.match(/^memory\s*=\s*dp\.cache\((.*)\)$/);
          if (memMatch) {
            const kw = getKwargs(parseArgs(memMatch[1]));
            def.memorySize = Number(resolve(kw.size, vars) ?? 64);
            i++;
            continue;
          }
          if (body.startsWith("on message(")) {
            // capture indented body until 'return X' or next sibling
            const bodyLines: string[] = [];
            i++;
            while (i < lines.length) {
              const inner = lines[i];
              if (/^\s*\}\s*$/.test(inner)) break;
              if (/^\S/.test(inner) && !inner.startsWith(" ") && !inner.startsWith("\t")) break;
              bodyLines.push(inner.trim());
              if (inner.trim().startsWith("return ")) {
                i++;
                break;
              }
              i++;
            }
            def.onMessage = bodyLines;
            continue;
          }
          // tone shortcut: tone = "warm"
          const toneMatch = body.match(/^tone\s*=\s*["'](.*?)["']$/);
          if (toneMatch) {
            def.tone = toneMatch[1];
            i++;
            continue;
          }
          i++;
        }
        // consume closing brace
        if (i < lines.length && lines[i].trim() === "}") i++;
        bots[name] = def;
        trace.push({ kind: "ok", text: `✓ compiled bot "${name}"` });
        continue;
      }

      // deploy Name to channel("slack")
      const depMatch = line.match(/^deploy\s+([A-Za-z_][A-Za-z0-9_]*)\s+to\s+(.+)$/);
      if (depMatch) {
        const name = depMatch[1];
        if (!bots[name]) throw mkErr(lineNum, `unknown bot "${name}"`);
        const target = depMatch[2].replace(/^channel\(/, "").replace(/\)$/, "").replace(/["']/g, "");
        deployed.push({ bot: name, target });
        trace.push({ kind: "ok", text: `✓ deployed ${name} → ${target} (240ms)` });
        i++;
        continue;
      }

      // x = dp.fib(10) | dp.knapsack(...) | dp.coinChange(...)
      const assign = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
      if (assign) {
        const [, name, expr] = assign;
        const v = evalExpr(expr, vars, (kind, result) => {
          dp = { ...result, kind };
        });
        vars[name] = v;
        if (typeof v === "number" || typeof v === "string") {
          trace.push({ kind: "info", text: `${name} = ${v}` });
        } else {
          trace.push({ kind: "info", text: `${name} computed` });
        }
        i++;
        continue;
      }

      // print(x)
      const printMatch = line.match(/^print\((.*)\)$/);
      if (printMatch) {
        const v = evalExpr(printMatch[1], vars);
        trace.push({ kind: "out", text: String(v) });
        i++;
        continue;
      }

      // unknown — try suggestion
      const firstWord = line.split(/\s|\(/)[0];
      const sug = suggest(firstWord);
      throw mkErr(lineNum, `unexpected: "${firstWord}"`, sug && `did you mean "${sug}"?`);
    }
  } catch (e) {
    const err = e as { __err?: boolean; line: number; message: string; suggestion?: string };
    if (err && err.__err) {
      return {
        trace,
        bots,
        deployed,
        vars,
        dp,
        error: { line: err.line, message: err.message, suggestion: err.suggestion },
      };
    }
    return {
      trace,
      bots,
      deployed,
      vars,
      dp,
      error: { line: 0, message: (e as Error).message },
    };
  }

  return { trace, bots, deployed, vars, dp };
}

function mkErr(line: number, message: string, suggestion?: string) {
  return { __err: true, line, message, suggestion };
}

function evalExpr(
  expr: string,
  vars: Record<string, unknown>,
  onDp?: (kind: "fib" | "knapsack" | "coinChange", r: DpResult) => void,
): unknown {
  const e = expr.trim();
  // dp.fib(n)
  let m = e.match(/^dp\.fib\((.*)\)$/);
  if (m) {
    const args = parseArgs(m[1]).map((a) => resolve(a, vars));
    const r = fib(Number(args[0] ?? 0));
    onDp?.("fib", r);
    return r.answer;
  }
  m = e.match(/^dp\.knapsack\((.*)\)$/);
  if (m) {
    const args = parseArgs(m[1]).map((a) => resolve(a, vars));
    const [w, v, c] = args as [number[], number[], number];
    const r = knapsack(w, v, c);
    onDp?.("knapsack", r);
    return r.answer;
  }
  m = e.match(/^dp\.coinChange\((.*)\)$/);
  if (m) {
    const args = parseArgs(m[1]).map((a) => resolve(a, vars));
    const [coins, amount] = args as [number[], number];
    const r = coinChange(coins, amount);
    onDp?.("coinChange", r);
    return r.answer;
  }
  m = e.match(/^ai\.classify\((.*)\)$/);
  if (m) {
    const args = parseArgs(m[1]).map((a) => resolve(a, vars));
    return classify(String(args[0] ?? ""));
  }
  m = e.match(/^ai\.compose\((.*)\)$/);
  if (m) {
    const args = parseArgs(m[1]).map((a) => resolve(a, vars));
    const kw = getKwargs(parseArgs(m[1]));
    return compose(String(getPositional(args)[0] ?? "other"), { tone: kw.tone as string });
  }
  // literal
  return resolve(parseValue(e), vars);
}

// Run a single bot's on-message body against a message
export function runBotReply(bot: BotDef, msg: string): string {
  if (!bot.onMessage || bot.onMessage.length === 0) {
    return compose(classify(msg), { tone: bot.tone });
  }
  const local: Record<string, unknown> = { msg };
  let reply = "";
  for (const line of bot.onMessage) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("return ")) {
      const expr = t.slice(7);
      const v = evalExpr(expr, local);
      reply = String(v);
      break;
    }
    const assign = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
    if (assign) {
      const [, name, expr] = assign;
      local[name] = evalExpr(expr, local);
    }
  }
  if (!reply) reply = compose(classify(msg), { tone: bot.tone });
  return reply;
}
