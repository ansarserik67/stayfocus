"use client";

/**
 * Daily feed budget: per-app limits, usage, and minutes earned back by doing a
 * verified set.
 *
 * Persisted per calendar day in localStorage. Real usage numbers have to come
 * from the extension — a web page cannot observe another origin's screen time —
 * so the cabinet enforces the budget for the links it opens and exposes a demo
 * "+5 min" action so the limit can actually be reached in a prototype.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import type { TranslationKey } from "@/lib/i18n";

export type ChannelId = "instagram" | "tiktok" | "youtube";

export interface ChannelLimit {
  /** Daily budget in minutes, set by the user. */
  limitMinutes: number;
  /** Minutes used today. */
  usedMinutes: number;
  /** Minutes earned back with workouts today. */
  bonusMinutes: number;
  /** Completed sets today. */
  workouts: number;
}

export interface LimitsState {
  /** Calendar day the numbers belong to, so a new day starts clean. */
  day: string;
  channels: Record<ChannelId, ChannelLimit>;
}

export const CHANNEL_IDS: ChannelId[] = ["instagram", "tiktok", "youtube"];

export const CHANNEL_LABEL_KEY: Record<ChannelId, TranslationKey> = {
  instagram: "dash.app.instagram",
  tiktok: "dash.app.tiktok",
  youtube: "dash.app.youtube",
};

const STORAGE_KEY = "stayfocus.limits.v1";

const DEFAULTS: LimitsState = {
  day: today(),
  channels: {
    instagram: { limitMinutes: 30, usedMinutes: 22, bonusMinutes: 0, workouts: 0 },
    tiktok: { limitMinutes: 20, usedMinutes: 18, bonusMinutes: 0, workouts: 0 },
    youtube: { limitMinutes: 30, usedMinutes: 9, bonusMinutes: 0, workouts: 0 },
  },
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function remainingMinutes(channel: ChannelLimit): number {
  return Math.max(0, channel.limitMinutes + channel.bonusMinutes - channel.usedMinutes);
}

/** A channel with nothing left can only be re-opened through the workout gate. */
export function isLocked(channel: ChannelLimit): boolean {
  return remainingMinutes(channel) <= 0;
}

function sanitizeChannel(value: unknown, fallback: ChannelLimit): ChannelLimit {
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Record<string, unknown>;
  const number = (input: unknown, fallbackValue: number, min: number, max: number) => {
    const parsed = Number(input);
    if (!Number.isFinite(parsed)) return fallbackValue;
    return Math.max(min, Math.min(max, Math.round(parsed)));
  };
  return {
    limitMinutes: number(raw.limitMinutes, fallback.limitMinutes, 5, 240),
    usedMinutes: number(raw.usedMinutes, fallback.usedMinutes, 0, 24 * 60),
    bonusMinutes: number(raw.bonusMinutes, 0, 0, 24 * 60),
    workouts: number(raw.workouts, 0, 0, 99),
  };
}

function sanitize(value: unknown): LimitsState | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.day !== "string") return null;
  // Stored numbers from an earlier day are stale; start the new day fresh.
  if (raw.day !== today()) return { ...DEFAULTS, day: today() };
  const channels = (raw.channels ?? {}) as Record<string, unknown>;
  return {
    day: raw.day,
    channels: {
      instagram: sanitizeChannel(channels.instagram, DEFAULTS.channels.instagram),
      tiktok: sanitizeChannel(channels.tiktok, DEFAULTS.channels.tiktok),
      youtube: sanitizeChannel(channels.youtube, DEFAULTS.channels.youtube),
    },
  };
}

export function useLimits() {
  const [state, setState] = useState<LimitsState>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = sanitize(JSON.parse(raw));
        if (parsed) setState(parsed);
      }
    } catch {
      /* unreadable storage — keep the defaults */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const setLimit = useCallback((id: ChannelId, minutes: number) => {
    setState((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [id]: { ...prev.channels[id], limitMinutes: minutes },
      },
    }));
  }, []);

  /** Demo stand-in for the extension reporting real usage. */
  const addUsage = useCallback((id: ChannelId, minutes: number) => {
    setState((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [id]: {
          ...prev.channels[id],
          usedMinutes: Math.min(24 * 60, prev.channels[id].usedMinutes + minutes),
        },
      },
    }));
  }, []);

  /** Award minutes earned by a completed, camera-verified set. */
  const grantBonus = useCallback((id: ChannelId, minutes: number) => {
    setState((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [id]: {
          ...prev.channels[id],
          bonusMinutes: prev.channels[id].bonusMinutes + minutes,
          workouts: prev.channels[id].workouts + 1,
        },
      },
    }));
  }, []);

  const resetDay = useCallback(() => {
    setState({ ...DEFAULTS, day: today() });
  }, []);

  const totals = useMemo(() => {
    const list = CHANNEL_IDS.map((id) => state.channels[id]);
    return {
      locked: list.filter((channel) => isLocked(channel)).length,
      earned: list.reduce((sum, channel) => sum + channel.bonusMinutes, 0),
      workouts: list.reduce((sum, channel) => sum + channel.workouts, 0),
    };
  }, [state.channels]);

  return { state, hydrated, totals, setLimit, addUsage, grantBonus, resetDay };
}
