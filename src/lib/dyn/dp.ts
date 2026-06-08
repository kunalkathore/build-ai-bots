// Dynamic programming primitives with step recording for visualization.

export type DpStep = {
  i: number;
  j?: number;
  value: number;
  note?: string;
};

export type DpResult = {
  table: number[][] | number[];
  steps: DpStep[];
  answer: number;
  rows: number;
  cols: number;
  labels?: { rows?: string[]; cols?: string[] };
};

export function fib(n: number): DpResult {
  const steps: DpStep[] = [];
  const table: number[] = new Array(Math.max(n + 1, 2)).fill(0);
  table[0] = 0;
  table[1] = 1;
  steps.push({ i: 0, value: 0, note: "base" });
  steps.push({ i: 1, value: 1, note: "base" });
  for (let i = 2; i <= n; i++) {
    table[i] = table[i - 1] + table[i - 2];
    steps.push({ i, value: table[i], note: `f(${i - 1}) + f(${i - 2})` });
  }
  return { table, steps, answer: table[n] ?? 0, rows: 1, cols: table.length };
}

export function knapsack(
  weights: number[],
  values: number[],
  capacity: number,
): DpResult {
  const n = weights.length;
  const table: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0),
  );
  const steps: DpStep[] = [];
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        table[i][w] = Math.max(
          table[i - 1][w],
          table[i - 1][w - weights[i - 1]] + values[i - 1],
        );
      } else {
        table[i][w] = table[i - 1][w];
      }
      steps.push({ i, j: w, value: table[i][w] });
    }
  }
  return {
    table,
    steps,
    answer: table[n][capacity],
    rows: n + 1,
    cols: capacity + 1,
    labels: {
      rows: ["∅", ...weights.map((w, i) => `item${i + 1}(w${w},v${values[i]})`)],
      cols: Array.from({ length: capacity + 1 }, (_, i) => `w=${i}`),
    },
  };
}

export function coinChange(coins: number[], amount: number): DpResult {
  const table: number[] = new Array(amount + 1).fill(Infinity);
  table[0] = 0;
  const steps: DpStep[] = [{ i: 0, value: 0, note: "base" }];
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && table[a - c] + 1 < table[a]) {
        table[a] = table[a - c] + 1;
      }
    }
    steps.push({
      i: a,
      value: Number.isFinite(table[a]) ? table[a] : -1,
      note: `min coins for ${a}`,
    });
  }
  const ans = Number.isFinite(table[amount]) ? table[amount] : -1;
  return {
    table: table.map((v) => (Number.isFinite(v) ? v : -1)),
    steps,
    answer: ans,
    rows: 1,
    cols: table.length,
  };
}
