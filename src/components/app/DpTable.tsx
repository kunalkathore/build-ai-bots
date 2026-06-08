import { useEffect, useState } from "react";
import type { DpResult } from "@/lib/dyn/dp";

type Props = {
  result: (DpResult & { kind: "fib" | "knapsack" | "coinChange" }) | undefined;
};

export function DpTable({ result }: Props) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    setStep(0);
    if (!result) return;
    const id = setInterval(() => {
      setStep((s) => {
        const next = s + 1;
        if (next >= result.steps.length) {
          clearInterval(id);
          return result.steps.length;
        }
        return next;
      });
    }, 80);
    return () => clearInterval(id);
  }, [result]);

  if (!result) {
    return (
      <div className="grid h-full place-items-center rounded-lg border border-dashed border-border p-8 text-center font-mono text-xs text-muted-foreground">
        Run code that uses dp.fib, dp.knapsack, or dp.coinChange to see the table fill in.
      </div>
    );
  }

  const filled = new Set<string>();
  for (let s = 0; s < step; s++) {
    const st = result.steps[s];
    filled.add(`${st.i}:${st.j ?? 0}`);
  }
  const current = result.steps[step - 1];

  const isMatrix = Array.isArray(result.table[0]);
  const rows = result.rows;
  const cols = result.cols;

  return (
    <div className="flex h-full flex-col gap-4 rounded-lg border border-border bg-background p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-neon">
          dp.{result.kind} · table
        </p>
        <p className="font-mono text-[11px] text-muted-foreground">
          step {Math.min(step, result.steps.length)} / {result.steps.length} · answer ={" "}
          <span className="text-neon">{result.answer}</span>
        </p>
      </div>
      <div className="overflow-auto">
        <table className="border-separate border-spacing-1 font-mono text-[11px]">
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: cols }).map((_, j) => {
                  const val = isMatrix
                    ? (result.table as number[][])[i][j]
                    : (result.table as number[])[j];
                  const key = isMatrix ? `${i}:${j}` : `${j}:0`;
                  const isFilled = isMatrix ? filled.has(key) : step > j;
                  const isCurrent =
                    current &&
                    (isMatrix
                      ? current.i === i && current.j === j
                      : !isMatrix && current.i === j);
                  return (
                    <td
                      key={j}
                      className={
                        "h-8 w-10 rounded border text-center transition " +
                        (isCurrent
                          ? "border-neon bg-neon/20 text-neon shadow-[0_0_12px_var(--neon)]"
                          : isFilled
                            ? "border-border bg-card text-foreground"
                            : "border-border/40 bg-background text-muted-foreground/40")
                      }
                    >
                      {isFilled ? (val === -1 ? "∞" : val) : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
