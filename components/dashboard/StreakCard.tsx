"use client";

/** Focus streak: day counter, level progress bar, daily win button. */

import { useEffect, useState } from "react";
import { Check, Flame, RotateCcw, Trophy, Zap } from "lucide-react";

import { useLang } from "@/components/i18n/LanguageProvider";
import { daysToNextLevel, levelForDays, levelProgress } from "@/lib/focus-data";
import { pluralDay, type TranslationKey } from "@/lib/i18n";

export function StreakCard({
  streak,
  best,
  todayDone,
  onMarkToday,
  onReset,
}: {
  streak: number;
  best: number;
  todayDone: boolean;
  onMarkToday: () => void;
  onReset: () => void;
}) {
  const { t, lang } = useLang();
  const [celebrating, setCelebrating] = useState(false);

  const level = levelForDays(streak);
  const progress = levelProgress(streak);
  const remaining = daysToNextLevel(streak);

  useEffect(() => {
    if (!celebrating) return;
    const timer = setTimeout(() => setCelebrating(false), 1500);
    return () => clearTimeout(timer);
  }, [celebrating]);

  return (
    <article className="card ring-grad relative overflow-hidden p-6 sm:col-span-2 sm:p-7">
      <div
        aria-hidden="true"
        className="animate-glow pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan/15 blur-3xl"
      />

      <header className="relative flex flex-wrap items-center justify-between gap-3">
        <span className="text-eyebrow flex items-center gap-2 text-ink-mute">
          <Flame size={14} className="text-amber" />
          {t("dash.streak.eyebrow")}
        </span>
        <span className="chip !border-amber/40 !bg-amber/10 !text-amber">
          {t("dash.demoBadge")}
        </span>
      </header>

      <div className="relative mt-5 flex flex-wrap items-end gap-x-8 gap-y-4">
        <div className="relative">
          <p className="font-display text-[74px] font-extrabold leading-[0.85] tracking-[-0.05em]">
            <span className="text-grad">{streak}</span>
          </p>
          {celebrating && (
            <span className="animate-burst pointer-events-none absolute inset-0 -z-10 rounded-full bg-cyan/30 blur-xl" />
          )}
          <p className="font-display mt-2 text-[17px] font-bold">
            {pluralDay(lang, streak)} ·{" "}
            <span className="text-ink-soft">{t("dash.streak.title")}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="chip">
            <Trophy size={13} className="text-emerald" />
            {t("dash.streak.best")}: <strong className="text-ink">{best}</strong>
          </span>
          <span className="chip">
            <Zap size={13} className="text-cyan" />
            {t(`dash.level.${level}` as TranslationKey)}
          </span>
        </div>
      </div>

      {/* level progress */}
      <div className="relative mt-7">
        <div className="flex items-center justify-between text-[12.5px] font-semibold">
          <span className="text-ink-soft">{t("dash.streak.progress")}</span>
          <span className="text-ink-mute">
            {remaining > 0
              ? `${remaining} ${t("dash.streak.next")}`
              : t("dash.level.6")}
          </span>
        </div>
        <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className={`progress-shine h-full rounded-full transition-[width] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              celebrating ? "check-pop" : ""
            }`}
            style={{ width: `${Math.max(4, Math.round(progress * 100))}%` }}
          />
        </div>
      </div>

      <div className="relative mt-7 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (todayDone) return;
            onMarkToday();
            setCelebrating(true);
          }}
          disabled={todayDone}
          className={`btn ${todayDone ? "btn-secondary" : "btn-primary"}`}
        >
          {todayDone ? <Check size={17} /> : <Zap size={17} />}
          {todayDone ? t("dash.streak.todayDone") : t("dash.streak.today")}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="btn btn-ghost !min-h-[38px] !px-3 !py-2 text-[13px]"
        >
          <RotateCcw size={14} />
          {t("dash.streak.reset")}
        </button>
      </div>
    </article>
  );
}
