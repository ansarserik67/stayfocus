"use client";

/**
 * Feed budget card: per-app daily limits, today's usage, and the workout gate
 * that unlocks a channel once its minutes are gone.
 *
 * Usage is demo data by design — a page cannot read another origin's screen
 * time. The limit, the lock and the earned minutes are real state in this app.
 */

import { useState } from "react";
import { Info, Lock, RotateCcw, ShieldCheck, Timer } from "lucide-react";

import { WorkoutGate } from "@/components/workout/WorkoutGate";
import { useLang } from "@/components/i18n/LanguageProvider";
import {
  CHANNEL_IDS,
  CHANNEL_LABEL_KEY,
  isLocked,
  remainingMinutes,
  useLimits,
  type ChannelId,
} from "@/lib/use-limits-store";

export function LimitsPanel() {
  const { t } = useLang();
  const { state, totals, setLimit, addUsage, grantBonus, resetDay } = useLimits();
  const [gate, setGate] = useState<ChannelId | null>(null);

  return (
    <section className="card p-6 lg:col-span-3">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-eyebrow flex items-center gap-2 text-cyan">
            <Timer size={14} />
            {t("limits.eyebrow")}
          </span>
          <h2 className="text-card mt-2">{t("limits.title")}</h2>
          <p className="mt-2 max-w-[62ch] text-[13.5px] leading-relaxed text-ink-soft">
            {t("limits.desc")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">
            <ShieldCheck size={13} className="text-emerald" />
            {t("limits.earned")}: {totals.earned} {t("limits.mins")}
          </span>
          <button type="button" onClick={resetDay} className="btn btn-secondary !min-h-[38px] !px-3 !py-2 text-[13px]">
            <RotateCcw size={14} />
            {t("limits.reset")}
          </button>
        </div>
      </header>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {CHANNEL_IDS.map((id) => {
          const channel = state.channels[id];
          const remaining = remainingMinutes(channel);
          const budget = channel.limitMinutes + channel.bonusMinutes;
          const usedShare = budget === 0 ? 1 : Math.min(1, channel.usedMinutes / budget);
          const locked = isLocked(channel);
          const label = t(CHANNEL_LABEL_KEY[id]);

          return (
            <article
              key={id}
              aria-label={label}
              className={`rounded-2xl border p-4 transition-colors ${
                locked
                  ? "border-amber/40 bg-amber/[0.06]"
                  : "border-line bg-surface-2/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[15px] font-semibold text-ink">{label}</p>
                  <p className="mt-0.5 text-[12.5px] text-ink-mute">
                    {t("limits.limit")}: {channel.limitMinutes} {t("limits.mins")}
                    {channel.bonusMinutes > 0 && (
                      <> + {channel.bonusMinutes} {t("limits.earned")}</>
                    )}
                  </p>
                </div>
                {locked && (
                  <span className="chip !border-amber/40 !bg-amber/10 !text-amber">
                    <Lock size={12} />
                    {t("limits.locked")}
                  </span>
                )}
              </div>

              <p className="font-display mt-3 text-[26px] font-extrabold leading-none text-ink">
                {remaining}
                <span className="ml-1 text-[13px] font-semibold text-ink-mute">
                  {t("limits.mins")} {t("limits.remaining")}
                </span>
              </p>

              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full rounded-full ${
                    locked
                      ? "bg-amber"
                      : "bg-gradient-to-r from-cyan to-emerald"
                  }`}
                  style={{ width: `${usedShare * 100}%` }}
                />
              </div>

              <label className="mt-4 block text-[12px] text-ink-mute">
                {t("limits.limit")}
                <input
                  type="range"
                  min={5}
                  max={120}
                  step={5}
                  value={channel.limitMinutes}
                  onChange={(event) => setLimit(id, Number(event.target.value))}
                  aria-label={`${label} — ${t("limits.limit")}`}
                  className="mt-1.5 w-full accent-[var(--color-cyan,#38bdf8)]"
                />
              </label>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {locked ? (
                  <button
                    type="button"
                    onClick={() => setGate(id)}
                    className="btn btn-primary !min-h-[38px] !px-3.5 !py-2 text-[13px]"
                  >
                    <Lock size={14} />
                    {t("limits.unlockCta")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => addUsage(id, 5)}
                    className="btn btn-secondary !min-h-[38px] !px-3.5 !py-2 text-[13px]"
                  >
                    +5 {t("limits.mins")}
                  </button>
                )}
                <span className="text-[11.5px] text-ink-mute">
                  {t("limits.used")}: {channel.usedMinutes} {t("limits.mins")}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-5 flex items-start gap-2.5 border-t border-line pt-4 text-[12px] leading-relaxed text-ink-mute">
        <Info size={14} className="mt-0.5 flex-none text-amber" />
        {t("limits.note")}
      </p>

      {gate && (
        <WorkoutGate
          channelLabel={t(CHANNEL_LABEL_KEY[gate])}
          onLeave={() => setGate(null)}
          onEarned={(minutes) => {
            grantBonus(gate, minutes);
            setGate(null);
          }}
        />
      )}
    </section>
  );
}
