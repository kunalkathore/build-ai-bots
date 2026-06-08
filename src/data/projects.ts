export type Project = {
  id: string;
  name: string;
  brief: string;
  archetype: "Greeter" | "Classifier" | "Trader" | "Tutor" | "FAQ";
  tone: string;
  intents: string[];
  requires: string[]; // lesson ids
  difficulty: "Starter" | "Intermediate" | "Advanced";
};

export const projects: Project[] = [
  {
    id: "faq-bot",
    name: "FAQ Bot",
    brief: "Answer common product questions with warmth.",
    archetype: "FAQ",
    tone: "warm",
    intents: ["greet", "question", "thanks", "goodbye"],
    requires: ["hello-bot", "first-reply"],
    difficulty: "Starter",
  },
  {
    id: "pathfinder-bot",
    name: "Pathfinder Bot",
    brief: "Use DP to find the cheapest travel routes.",
    archetype: "Trader",
    tone: "formal",
    intents: ["greet", "question", "buy"],
    requires: ["fib", "knapsack"],
    difficulty: "Intermediate",
  },
  {
    id: "tutor-bot",
    name: "Tutor Bot",
    brief: "Teach DP concepts with patient, formal replies.",
    archetype: "Tutor",
    tone: "formal",
    intents: ["greet", "help", "question", "thanks"],
    requires: ["fib", "coins", "classify"],
    difficulty: "Intermediate",
  },
  {
    id: "trader-bot",
    name: "Trader Bot",
    brief: "Optimize a portfolio with knapsack-style decisions.",
    archetype: "Trader",
    tone: "playful",
    intents: ["greet", "buy", "status", "question"],
    requires: ["knapsack", "coins", "tools"],
    difficulty: "Advanced",
  },
  {
    id: "concierge-bot",
    name: "Concierge Bot",
    brief: "A multi-channel bot that ships to Slack and web.",
    archetype: "Greeter",
    tone: "warm",
    intents: ["greet", "help", "status", "thanks", "goodbye"],
    requires: ["multi-bot", "deploy-slack"],
    difficulty: "Advanced",
  },
];

export function projectById(id: string) {
  return projects.find((p) => p.id === id);
}
