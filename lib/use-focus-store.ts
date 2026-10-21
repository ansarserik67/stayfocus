"use client";

/**
 * The cabinet's client-side state: streak, personal best and the weekly
 * planner checkboxes. Persisted in localStorage so the prototype feels alive
 * between visits — no server, no account, nothing leaves the browser.
 */

import { useCallback, useEffect, useState } from "react";
import type { HabitId, PlannerState } from "@/types/focus";
import {
  plannerKey,
  STARTING_BEST,
  STARTING_STREAK,
  TODAY_INDEX,
  TOTAL_PLANNED,
  WEEK_PLAN,
} from "@/lib/focus-data";

const STORAGE_KEY = "stayfocus.store.v1";

export interface FocusStore {
  streak: number;
  best: number;
  /** Whether today's streak day has already been claimed. */
  todayDone: boolean;
  planner: PlannerState;
}

const INITIAL: FocusStore = {
  streak: STARTING_STREAK,
  best: STARTING_BEST,
  todayDone: false,
  planner: {},
};

export { TOTAL_PLANNED };

function sanitize(value: unknown): FocusStore | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const streak = Number(raw.streak);
  const best = Number(raw.best);
  if (!Number.isFinite(streak) || !Number.isFinite(best)) return null;

  const planner: PlannerState = {};
  if (raw.planner && typeof raw.planner === "object") {
    for (const [key, flag] of Object.entries(
      raw.planner as Record<string, unknown>,
    )) {
      if (flag === true) planner[key] = true;
    }
  }

  return {
    streak: Math.max(0, Math.round(streak)),
    best: Math.max(0, Math.round(best)),
    todayDone: raw.todayDone === true,
    planner,
  };
}

export function useFocusStore() {
  const [store, setStore] = useState<FocusStore>(INITIAL);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = sanitize(JSON.parse(raw));
        if (parsed) setStore(parsed);
      }
    } catch {
      /* corrupted or unavailable storage — start from the demo defaults */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      /* ignore */
    }
  }, [store, hydrated]);

  const markToday = useCallback(() => {
    setStore((prev) => {
      if (prev.todayDone) return prev;
      const streak = prev.streak + 1;
      return {
        ...prev,
        streak,
        best: Math.max(prev.best, streak),
        todayDone: true,
      };
    });
  }, []);

  const resetStreak = useCallback(() => {
    setStore((prev) => ({ ...prev, streak: 0, todayDone: false }));
  }, []);

  const toggleHabit = useCallback((dayIndex: number, habit: HabitId) => {
    const key = plannerKey(dayIndex, habit);
    setStore((prev) => {
      const planner = { ...prev.planner };
      if (planner[key]) delete planner[key];
      else planner[key] = true;
      return { ...prev, planner };
    });
  }, []);

  const resetWeek = useCallback(() => {
    setStore((prev) => ({ ...prev, planner: {} }));
  }, []);

  /** How many of a day's planned tasks are ticked. */
  const dayProgress = useCallback(
    (dayIndex: number) => {
      const planned = WEEK_PLAN[dayIndex] ?? [];
      const done = planned.filter((habit) => store.planner[plannerKey(dayIndex, habit)]).length;
      return { done, total: planned.length };
    },
    [store.planner],
  );

  const weekDone = Object.keys(store.planner).length;

  const today = dayProgress(TODAY_INDEX);

  return {
    store,
    hydrated,
    weekDone,
    today,
    dayProgress,
    markToday,
    resetStreak,
    toggleHabit,
    resetWeek,
  };
}
