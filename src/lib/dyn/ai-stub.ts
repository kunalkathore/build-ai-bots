// Deterministic local AI stub — keyword + template based.
// Swap with a real Lovable AI call later by replacing classify/compose.

const intentKeywords: Record<string, string[]> = {
  greet: ["hi", "hello", "hey", "yo", "morning", "evening"],
  goodbye: ["bye", "goodbye", "later", "see ya"],
  help: ["help", "support", "stuck", "how do"],
  thanks: ["thanks", "thank you", "ty"],
  question: ["what", "when", "where", "why", "how", "?"],
  buy: ["buy", "purchase", "order", "checkout", "price", "cost"],
  status: ["status", "where is", "track", "shipping"],
};

export function classify(msg: string): string {
  const lower = msg.toLowerCase();
  for (const [intent, kws] of Object.entries(intentKeywords)) {
    if (kws.some((k) => lower.includes(k))) return intent;
  }
  return "other";
}

const templates: Record<string, Record<string, string[]>> = {
  warm: {
    greet: ["Hey there! How can I help today?", "Hi! Lovely to see you."],
    goodbye: ["Take care — come back anytime!", "Bye for now 👋"],
    help: ["Of course — tell me what you're stuck on."],
    thanks: ["Anytime!", "Happy to help."],
    question: ["Great question. Let me think on that."],
    buy: ["Let's get you sorted. What are you eyeing?"],
    status: ["Let me check on that for you."],
    other: ["Tell me a bit more?"],
  },
  formal: {
    greet: ["Good day. How may I assist you?"],
    goodbye: ["Goodbye. Have a productive day."],
    help: ["Please describe the issue in detail."],
    thanks: ["You are welcome."],
    question: ["I will look into that."],
    buy: ["Certainly. Please specify the item."],
    status: ["Checking the status now."],
    other: ["Could you elaborate?"],
  },
  playful: {
    greet: ["Ahoy! 🚀"],
    goodbye: ["Catch you on the flip side!"],
    help: ["On it like a bot on a byte!"],
    thanks: ["No sweat 😎"],
    question: ["Ooo, juicy one — let me dig in."],
    buy: ["Wallet warming up! What's the prize?"],
    status: ["Scanning the multiverse…"],
    other: ["Say more, I'm all ears (well, sensors)."],
  },
};

export function compose(
  intent: string,
  opts: { tone?: string } = {},
): string {
  const tone = (opts.tone ?? "warm").toLowerCase();
  const bank = templates[tone] ?? templates.warm;
  const list = bank[intent] ?? bank.other;
  return list[0];
}
