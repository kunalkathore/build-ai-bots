## What we're building

A working MVP of DynamiBot AI on top of the existing landing page. Five connected surfaces, all client-side (no backend yet) so it runs instantly and feels real. Progress saved to localStorage. The custom `.dyn` language runs in a small in-browser interpreter.

## Routes

```
/                  landing (already built — keep)
/app               authenticated-feel shell with sidebar (Outlet)
/app/dashboard     stats, achievements, recent activity
/app/playground    code editor + live runner + DP table visualizer
/app/builder       visual bot config → generates .dyn code → test chat
/app/lessons       lesson list + lesson detail with step-by-step challenges
/app/projects      guided bot projects with unlock progression
```

Landing CTAs ("Launch console", "Start building") will route into `/app/dashboard`.

## Feature breakdown

**1. Playground**
- Lightweight code editor (textarea with syntax-highlighted overlay — no Monaco dependency, keeps bundle small and matches the terminal aesthetic).
- "Run" executes a small interpreter for the DynamiBot DSL: `bot { }`, `memory = dp.cache(...)`, `on message(...)`, `ai.classify`, `ai.compose`, `dp.fib`, `dp.knapsack`, `deploy ... to ...`.
- Output panel shows trace lines (compile, deploy, replies).
- Error panel highlights line numbers and offers suggestions ("did you mean `on message`?").
- DP visualizer: when code uses `dp.fib(n)` or `dp.knapsack(...)`, render the memo table filling cell-by-cell.

**2. Bot Builder**
- Form-based: name, archetype (Greet / Classifier / Trader / Tutor), tone, memory size, intents (add/remove rows), deploy target.
- Live preview of the generated `.dyn` code on the right.
- "Test bot" opens a chat panel that runs the bot against the same interpreter.
- "Save bot" → localStorage, appears in Projects + Dashboard.

**3. Lessons**
- Curriculum mirrors the landing arcs (4 arcs × ~3 lessons each = 12 lessons for MVP).
- Lesson detail page: explanation, embedded mini-playground with starter code, "Check" button validates output against expected result, marks complete.
- Step counter, "Next lesson" CTA.

**4. Projects**
- 4–5 guided bot projects (FAQ bot, Pathfinder bot, Tutor bot, Trader bot).
- Each shows: brief, requirements checklist, "Open in builder" CTA.
- Locked until prerequisite lessons complete (visible but greyed with a lock icon).

**5. Dashboard**
- Stat cards: lessons complete, bots built, current arc, streak.
- Achievement grid (8 badges, unlocked based on milestones).
- Recent activity feed (from localStorage events).
- "Continue learning" CTA jumps to next incomplete lesson.

## Shared infrastructure

- `src/lib/dyn/interpreter.ts` — parser + evaluator for the DSL.
- `src/lib/dyn/dp.ts` — DP primitives (fib, knapsack, coinChange) with step recording for visualization.
- `src/lib/dyn/ai-stub.ts` — deterministic stub for `ai.classify` / `ai.compose` (keyword + template based, no API call) so the MVP runs offline. Clearly marked; can swap for Lovable AI later.
- `src/lib/progress/store.ts` — localStorage-backed Zustand-style store for lessons, bots, achievements, activity.
- `src/components/app/Sidebar.tsx` — persistent left nav for /app routes.
- `src/components/app/CodeEditor.tsx` — textarea + highlighted overlay + line numbers.
- `src/components/app/DpTable.tsx` — animated grid for DP visualization.
- `src/data/lessons.ts`, `src/data/projects.ts`, `src/data/achievements.ts` — content.

## Technical notes

- No backend / no Lovable Cloud for this iteration. Everything runs in the browser; progress in `localStorage`. Easy to upgrade to Cloud later for accounts + sync.
- The DSL interpreter is intentionally small — handles the surface area the lessons + builder need, throws helpful errors elsewhere.
- Visual style stays consistent with the existing terminal/neon design system; no new colors needed.
- All `/app/*` routes share a layout route (`src/routes/app.tsx`) that renders the sidebar + `<Outlet />`.

## Out of scope for this pass

- Real authentication (the sidebar shows a placeholder user; we wire Lovable Cloud + auth in a follow-up if you want).
- Real LLM calls (using deterministic stub so the demo works without spending AI credits — easy swap later).
- Multiplayer / sharing bots via URL.
- Mobile-optimized editor (works, but desktop-first).

Confirm and I'll build it. If you'd rather I cut scope (e.g. ship Playground + Lessons first, defer Builder/Projects/Dashboard), say the word.