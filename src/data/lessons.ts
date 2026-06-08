export type Lesson = {
  id: string;
  arc: string;
  arcIndex: number;
  index: number;
  title: string;
  blurb: string;
  body: string;
  starter: string;
  // success: a function-string predicate against run result vars/trace, or expected printed value
  expect: { kind: "var"; name: string; value: string | number } | { kind: "trace"; contains: string };
};

export const arcs = [
  { id: "first", name: "First Contact", color: "neon" },
  { id: "dp", name: "Dynamic Minds", color: "magenta" },
  { id: "agents", name: "Intelligent Agents", color: "amber" },
  { id: "ship", name: "Ship It", color: "neon" },
];

export const lessons: Lesson[] = [
  {
    id: "hello-bot",
    arc: "first",
    arcIndex: 0,
    index: 1,
    title: "Hello, bot.",
    blurb: "Define your first agent and deploy it.",
    body: "Every DynamiBot program starts with a `bot { }` block. Add a name, then deploy it to a channel. The compiler ships it for you.",
    starter:
      'bot HelloBot {\n  tone = "warm"\n}\n\ndeploy HelloBot to channel("cli")\n',
    expect: { kind: "trace", contains: "deployed HelloBot" },
  },
  {
    id: "memory",
    arc: "first",
    arcIndex: 0,
    index: 2,
    title: "Memory & state",
    blurb: "Give your bot a memory cache.",
    body: "Bots remember conversations through `dp.cache(size=N)`. Give your bot a 64-slot memory and redeploy it.",
    starter:
      'bot Memo {\n  memory = dp.cache(size=64)\n  tone = "warm"\n}\n\ndeploy Memo to channel("cli")\n',
    expect: { kind: "trace", contains: "compiled bot \"Memo\"" },
  },
  {
    id: "first-reply",
    arc: "first",
    arcIndex: 0,
    index: 3,
    title: "Conversations",
    blurb: "Respond to a message.",
    body: "Use `on message(msg)` to react. Classify the intent, compose a reply, return it.",
    starter:
      'bot ChatBot {\n  on message(msg):\n    intent = ai.classify(msg)\n    reply = ai.compose(intent, tone="warm")\n    return reply\n}\n\ndeploy ChatBot to channel("slack")\n',
    expect: { kind: "trace", contains: "deployed ChatBot" },
  },
  {
    id: "fib",
    arc: "dp",
    arcIndex: 1,
    index: 1,
    title: "Memoization: Fibonacci",
    blurb: "Cache subproblems with dp.fib.",
    body: "DP turns slow recursion into fast cached computation. Call `dp.fib(10)` and print the answer (55).",
    starter: "x = dp.fib(10)\nprint(x)\n",
    expect: { kind: "var", name: "x", value: 55 },
  },
  {
    id: "knapsack",
    arc: "dp",
    arcIndex: 1,
    index: 2,
    title: "Tabulation: Knapsack",
    blurb: "Fill a DP table to maximize value.",
    body: "Given weights `[2,3,4]`, values `[3,4,5]`, and capacity 5, find the max value (7).",
    starter: "y = dp.knapsack([2,3,4],[3,4,5],5)\nprint(y)\n",
    expect: { kind: "var", name: "y", value: 7 },
  },
  {
    id: "coins",
    arc: "dp",
    arcIndex: 1,
    index: 3,
    title: "Optimal policies: Coins",
    blurb: "Minimum coins to make change.",
    body: "Using coins `[1,2,5]`, what's the fewest coins to make 11? (3)",
    starter: "z = dp.coinChange([1,2,5],11)\nprint(z)\n",
    expect: { kind: "var", name: "z", value: 3 },
  },
  {
    id: "classify",
    arc: "agents",
    arcIndex: 2,
    index: 1,
    title: "Classification bots",
    blurb: "Route by intent.",
    body: "Build a bot that classifies a hello and replies warmly.",
    starter:
      'bot Greeter {\n  on message(msg):\n    intent = ai.classify(msg)\n    reply = ai.compose(intent, tone="warm")\n    return reply\n}\n\ndeploy Greeter to channel("web")\n',
    expect: { kind: "trace", contains: "compiled bot \"Greeter\"" },
  },
  {
    id: "tools",
    arc: "agents",
    arcIndex: 2,
    index: 2,
    title: "Tool-using agents",
    blurb: "Combine DP + AI in one bot.",
    body: "Compute fib(8) and assign it. Then build a tutor bot that returns a reply.",
    starter:
      'n = dp.fib(8)\n\nbot Tutor {\n  on message(msg):\n    intent = ai.classify(msg)\n    reply = ai.compose(intent, tone="formal")\n    return reply\n}\n\ndeploy Tutor to channel("web")\n',
    expect: { kind: "var", name: "n", value: 21 },
  },
  {
    id: "multi-bot",
    arc: "agents",
    arcIndex: 2,
    index: 3,
    title: "Multi-bot orchestration",
    blurb: "Deploy two bots at once.",
    body: "Compile and deploy both a Greeter and a Closer bot to the cli channel.",
    starter:
      'bot Greeter {\n  tone = "warm"\n}\nbot Closer {\n  tone = "formal"\n}\n\ndeploy Greeter to channel("cli")\ndeploy Closer to channel("cli")\n',
    expect: { kind: "trace", contains: "deployed Closer" },
  },
  {
    id: "deploy-slack",
    arc: "ship",
    arcIndex: 3,
    index: 1,
    title: "Deploy to Slack",
    blurb: "Ship a bot to a real channel.",
    body: "Define a bot, set tone to playful, and deploy it to Slack.",
    starter:
      'bot ShipIt {\n  tone = "playful"\n  on message(msg):\n    intent = ai.classify(msg)\n    return ai.compose(intent, tone="playful")\n}\n\ndeploy ShipIt to channel("slack")\n',
    expect: { kind: "trace", contains: "→ slack" },
  },
  {
    id: "evaluate",
    arc: "ship",
    arcIndex: 3,
    index: 2,
    title: "Evaluate & iterate",
    blurb: "Run, inspect, improve.",
    body: "Compute knapsack with weights `[1,2,3]`, values `[6,10,12]`, capacity 5. Expect 22.",
    starter: "k = dp.knapsack([1,2,3],[6,10,12],5)\nprint(k)\n",
    expect: { kind: "var", name: "k", value: 22 },
  },
  {
    id: "capstone",
    arc: "ship",
    arcIndex: 3,
    index: 3,
    title: "Capstone: your bot",
    blurb: "Build, name, and ship something of your own.",
    body: "Define any bot you like with a memory cache and deploy it anywhere. There are no wrong answers — just ship.",
    starter:
      'bot MyBot {\n  memory = dp.cache(size=128)\n  tone = "warm"\n  on message(msg):\n    return ai.compose(ai.classify(msg), tone="warm")\n}\n\ndeploy MyBot to channel("web")\n',
    expect: { kind: "trace", contains: "deployed" },
  },
];

export function lessonById(id: string) {
  return lessons.find((l) => l.id === id);
}

export function nextLesson(id: string) {
  const idx = lessons.findIndex((l) => l.id === id);
  return idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null;
}
