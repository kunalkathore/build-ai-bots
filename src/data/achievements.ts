export type Achievement = {
  id: string;
  name: string;
  description: string;
  glyph: string;
};

export const achievements: Achievement[] = [
  { id: "first_lesson", name: "Hello, World", description: "Finish your first lesson.", glyph: "✦" },
  { id: "five_lessons", name: "Momentum", description: "Clear 5 lessons.", glyph: "◆" },
  { id: "curriculum", name: "Curriculum Cleared", description: "All 12 lessons done.", glyph: "★" },
  { id: "first_bot", name: "Bot Builder", description: "Deploy your first bot.", glyph: "◇" },
  { id: "bot_trio", name: "Trio", description: "Three bots in the wild.", glyph: "△" },
  { id: "first_run", name: "First Compile", description: "Run code in the playground.", glyph: "▶" },
  { id: "dp_master", name: "DP Master", description: "Solve fib, knapsack, and coins.", glyph: "∑" },
  { id: "shipper", name: "Shipper", description: "Deploy to Slack.", glyph: "🚀" },
];
