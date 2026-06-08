// Tiny localStorage-backed reactive store. No external deps.
import { useSyncExternalStore } from "react";

export type SavedBot = {
  id: string;
  name: string;
  archetype: string;
  tone: string;
  intents: string[];
  source: string;
  createdAt: number;
};

export type ActivityEvent = {
  id: string;
  at: number;
  kind: "lesson" | "bot" | "achievement" | "project" | "run";
  text: string;
};

export type ProgressState = {
  completedLessons: string[];
  bots: SavedBot[];
  achievements: string[];
  activity: ActivityEvent[];
  streakDays: number;
  lastActiveDay: string | null;
};

const KEY = "dynamibot.progress.v1";

const initial: ProgressState = {
  completedLessons: [],
  bots: [],
  achievements: [],
  activity: [],
  streakDays: 0,
  lastActiveDay: null,
};

let state: ProgressState = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function notify() {
  for (const l of listeners) l();
}

function set(updater: (s: ProgressState) => ProgressState) {
  state = updater(state);
  persist();
  notify();
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function bumpStreak() {
  const today = todayKey();
  set((s) => {
    if (s.lastActiveDay === today) return s;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const streak = s.lastActiveDay === yesterday ? s.streakDays + 1 : 1;
    return { ...s, lastActiveDay: today, streakDays: streak };
  });
}

function addActivity(kind: ActivityEvent["kind"], text: string) {
  bumpStreak();
  set((s) => ({
    ...s,
    activity: [
      { id: crypto.randomUUID(), at: Date.now(), kind, text },
      ...s.activity,
    ].slice(0, 50),
  }));
}

function unlockAchievement(id: string, label: string) {
  if (state.achievements.includes(id)) return;
  set((s) => ({ ...s, achievements: [...s.achievements, id] }));
  addActivity("achievement", `Unlocked: ${label}`);
}

export const progress = {
  getSnapshot: () => state,
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  ensureLoaded: () => load(),

  completeLesson(id: string, title: string) {
    load();
    if (state.completedLessons.includes(id)) return;
    set((s) => ({ ...s, completedLessons: [...s.completedLessons, id] }));
    addActivity("lesson", `Completed lesson: ${title}`);
    if (state.completedLessons.length >= 1) unlockAchievement("first_lesson", "First lesson done");
    if (state.completedLessons.length >= 5) unlockAchievement("five_lessons", "5 lessons cleared");
    if (state.completedLessons.length >= 12) unlockAchievement("curriculum", "Curriculum complete");
  },

  saveBot(bot: Omit<SavedBot, "id" | "createdAt">) {
    load();
    const id = crypto.randomUUID();
    const full: SavedBot = { ...bot, id, createdAt: Date.now() };
    set((s) => ({ ...s, bots: [full, ...s.bots] }));
    addActivity("bot", `Built bot: ${bot.name}`);
    unlockAchievement("first_bot", "First bot deployed");
    if (state.bots.length >= 3) unlockAchievement("bot_trio", "Built 3 bots");
    return full;
  },

  deleteBot(id: string) {
    set((s) => ({ ...s, bots: s.bots.filter((b) => b.id !== id) }));
  },

  recordRun(text: string) {
    load();
    addActivity("run", text);
    unlockAchievement("first_run", "First code run");
  },

  recordProjectOpen(name: string) {
    load();
    addActivity("project", `Started project: ${name}`);
  },
};

export function useProgress<T>(selector: (s: ProgressState) => T): T {
  load();
  return useSyncExternalStore(
    progress.subscribe,
    () => selector(state),
    () => selector(initial),
  );
}
