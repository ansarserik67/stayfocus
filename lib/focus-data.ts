/**
 * StayFocus demo dataset.
 *
 * Everything here is clearly-labelled demonstration data (`IS_DEMO = true`) for
 * a front-end prototype — the UI repeats that notice wherever numbers appear.
 * Components never invent numbers; they read them from this module so that
 * swapping in a real backend means changing this file only.
 */

import type { HabitId, SavedActivity, ScreenTimeDay } from "@/types/focus";

export const IS_DEMO = true;

/** Last seven days of feed usage, in hours, plus the pre-StayFocus baseline. */
export const SCREEN_TIME: ScreenTimeDay[] = [
  { dayKey: "dash.day.mon", instagram: 2.4, tiktok: 1.6, youtube: 1.1, baseline: 5.4 },
  { dayKey: "dash.day.tue", instagram: 2.1, tiktok: 1.4, youtube: 1.0, baseline: 5.2 },
  { dayKey: "dash.day.wed", instagram: 1.7, tiktok: 1.1, youtube: 0.9, baseline: 5.0 },
  { dayKey: "dash.day.thu", instagram: 1.3, tiktok: 0.8, youtube: 0.7, baseline: 5.1 },
  { dayKey: "dash.day.fri", instagram: 1.0, tiktok: 0.6, youtube: 0.5, baseline: 5.3 },
  { dayKey: "dash.day.sat", instagram: 0.7, tiktok: 0.4, youtube: 0.4, baseline: 5.0 },
  { dayKey: "dash.day.sun", instagram: 0.4, tiktok: 0.3, youtube: 0.3, baseline: 5.2 },
];

export const FEED_APPS = [
  { id: "instagram", color: "#e1306c" },
  { id: "tiktok", color: "#22d3ee" },
  { id: "youtube", color: "#ef4444" },
] as const;

export type FeedAppId = (typeof FEED_APPS)[number]["id"];

export const APP_COLORS: Record<FeedAppId, string> = {
  instagram: "#e1306c",
  tiktok: "#22d3ee",
  youtube: "#ef4444",
};

/** Total hours per app across the week. */
export function weeklyTotals() {
  const totals = { instagram: 0, tiktok: 0, youtube: 0, baseline: 0 };
  for (const day of SCREEN_TIME) {
    totals.instagram += day.instagram;
    totals.tiktok += day.tiktok;
    totals.youtube += day.youtube;
    totals.baseline += day.baseline;
  }
  return totals;
}

export function dayTotal(day: ScreenTimeDay): number {
  return day.instagram + day.tiktok + day.youtube;
}

export function weeklySavedHours(): number {
  const totals = weeklyTotals();
  const now = totals.instagram + totals.tiktok + totals.youtube;
  return Math.max(0, totals.baseline - now);
}

/** Share of the weekly total that was avoided, as a 0–1 ratio. */
export function weeklyReductionRatio(): number {
  const totals = weeklyTotals();
  if (totals.baseline <= 0) return 0;
  const now = totals.instagram + totals.tiktok + totals.youtube;
  return Math.max(0, Math.min(1, 1 - now / totals.baseline));
}

/* ------------------------------------------------------------------ *
 * Levels, streak and companion
 * ------------------------------------------------------------------ */

/**
 * Minimum streak days required to reach each level (index + 1).
 * Index 6 exists only as the sentinel for "top level reached" so that
 * `LEVEL_THRESHOLDS[level]` stays in range for level 5 → 6.
 */
export const LEVEL_THRESHOLDS = [0, 3, 7, 14, 30, 60, Infinity];

export type LevelNumber = 1 | 2 | 3 | 4 | 5 | 6;

export function levelForDays(days: number): LevelNumber {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length - 1; i += 1) {
    if (days >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return Math.min(level, 6) as LevelNumber;
}

/** Progress towards the next level: 0–1, and 1 when the top level is reached. */
export function levelProgress(days: number): number {
  const level = levelForDays(days);
  if (level >= 6) return 1;
  const from = LEVEL_THRESHOLDS[level - 1];
  const to = LEVEL_THRESHOLDS[level];
  return Math.max(0, Math.min(1, (days - from) / (to - from)));
}

/** Days still needed to reach the next level, or 0 at the top level. */
export function daysToNextLevel(days: number): number {
  const level = levelForDays(days);
  if (level >= 6) return 0;
  return Math.max(0, LEVEL_THRESHOLDS[level] - days);
}

/** Companion stages share the level thresholds so the two stay in sync. */
export const PET_STAGES: LevelNumber[] = [1, 2, 3, 4, 5, 6];

export function petStageForDays(days: number): LevelNumber {
  return levelForDays(days);
}

export const STARTING_STREAK = 12;
export const STARTING_BEST = 21;

/* ------------------------------------------------------------------ *
 * Weekly planner
 * ------------------------------------------------------------------ */

export const HABITS: HabitId[] = [
  "sport",
  "study",
  "reading",
  "project",
  "walk",
  "family",
  "noReels",
];

/**
 * Which real tasks are planned for each day of the week.
 * Deliberately lighter on Sunday so the plan is human, not punishing.
 */
export const WEEK_PLAN: HabitId[][] = [
  ["sport", "study", "reading", "noReels"],
  ["sport", "study", "project", "noReels"],
  ["reading", "project", "walk", "noReels"],
  ["sport", "study", "reading", "noReels"],
  ["study", "project", "family", "noReels"],
  ["sport", "walk", "family", "noReels"],
  ["reading", "walk", "family"],
];

/** Total number of planned tasks across the week. */
export const TOTAL_PLANNED = WEEK_PLAN.reduce(
  (sum, day) => sum + day.length,
  0,
);

export const DAY_KEYS = [
  "dash.day.mon",
  "dash.day.tue",
  "dash.day.wed",
  "dash.day.thu",
  "dash.day.fri",
  "dash.day.sat",
  "dash.day.sun",
] as const;

/** Stable key for one planner checkbox. */
export function plannerKey(dayIndex: number, habit: HabitId): string {
  return `${dayIndex}:${habit}`;
}

/** "Today" in the planner — the last column of the demo week. */
export const TODAY_INDEX = 6;

/* ------------------------------------------------------------------ *
 * Saved time → real deeds
 * ------------------------------------------------------------------ */

export const SAVED_ACTIVITIES: SavedActivity[] = [
  { labelKey: "dash.saved.book", perHour: 5 },
  { labelKey: "dash.saved.workout", perHour: 0.5 },
  { labelKey: "dash.saved.lesson", perHour: 0.5 },
  { labelKey: "dash.saved.project", perHour: 0.34 },
  { labelKey: "dash.saved.family", perHour: 0.5 },
];

/** The spec's example: two saved hours already equal real progress. */
export const DEFAULT_SAVED_HOURS = 2;

export interface SavedDeed {
  labelKey: SavedActivity["labelKey"];
  count: number;
}

/** How many of each deed a number of saved hours produces (>= 1 only). */
export function deedsForHours(hours: number): SavedDeed[] {
  return SAVED_ACTIVITIES.map((activity) => ({
    labelKey: activity.labelKey,
    count: Math.floor(hours * activity.perHour),
  })).filter((deed) => deed.count >= 1);
}

/* ------------------------------------------------------------------ *
 * Landing stats
 * ------------------------------------------------------------------ */

export const HERO_STATS = [
  { valueKey: "stats.hours.value", labelKey: "stats.hours.label", hintKey: "stats.hours.hint", tone: "cyan" },
  { valueKey: "stats.wins.value", labelKey: "stats.wins.label", hintKey: "stats.wins.hint", tone: "emerald" },
  { valueKey: "stats.control.value", labelKey: "stats.control.label", hintKey: "stats.control.hint", tone: "indigo" },
] as const;

/** Blocked-Reels counter shown on the floating hero card. */
export const BLOCKED_TODAY = 47;
