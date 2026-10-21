"use client";

/**
 * The focus companion: a little guardian that gets brighter with every day
 * without Reels. Built from CSS shapes so it stays crisp and animatable.
 */

import { Sparkles } from "lucide-react";

import { useLang } from "@/components/i18n/LanguageProvider";
import {
  LEVEL_THRESHOLDS,
  levelProgress,
  petStageForDays,
} from "@/lib/focus-data";
import { pluralDay, type TranslationKey } from "@/lib/i18n";

export function FocusPet({ streak }: { streak: number }) {
  const { t, lang } = useLang();
  const stage = petStageForDays(streak);
  const progress = levelProgress(streak);
  const toNext =
    stage >= 6 ? 0 : Math.max(0, LEVEL_THRESHOLDS[stage] - streak);

  return (
    <article className="card relative overflow-hidden p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald/12 to-transparent"
      />

      <header className="relative flex items-center justify-between">
        <span className="text-eyebrow text-ink-mute">{t("dash.pet.title")}</span>
        <Sparkles size={15} className="text-emerald" />
      </header>

      <div className="relative mt-6 flex justify-center">
        <div className="relative h-[152px] w-[152px]">
          {/* aura rings — one per stage */}
          {Array.from({ length: stage }, (_, index) => (
            <span
              key={index}
              aria-hidden="true"
              className="animate-glow absolute inset-0 rounded-full border border-cyan/25"
              style={{
                transform: `scale(${1 + index * 0.14})`,
                animationDelay: `${index * 240}ms`,
              }}
            />
          ))}

          <div
            aria-hidden="true"
            className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan/40 via-indigo/30 to-emerald/40 blur-2xl"
          />

          {/* the companion */}
          <div className="animate-float relative flex h-full w-full flex-col items-center justify-center rounded-full border border-line-strong/60 bg-gradient-to-br from-cyan/25 via-surface-2 to-emerald/25 shadow-[inset_0_10px_30px_-12px_var(--glow-cyan)]">
            <div className="flex items-center gap-7">
              <span className="h-2.5 w-2.5 rounded-full bg-ink" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink" />
            </div>
            <span className="mt-3 h-3 w-9 rounded-b-full border-b-[3px] border-ink" />
          </div>

          {/* bolt badge */}
          <span className="absolute -right-1 -top-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan to-emerald text-[#04121a] shadow-[0_10px_24px_-12px_var(--glow-cyan)]">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M14 3 6.5 13.4h4.3L9.8 21l7.7-10.7h-4.3L14 3Z" fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>

      <div className="relative mt-6 text-center">
        <p className="font-display text-[19px] font-extrabold">
          {t(`dash.pet.stage.${stage}` as TranslationKey)}
        </p>
        <p className="mx-auto mt-2 max-w-[30ch] text-[13px] leading-relaxed text-ink-soft">
          {t("dash.pet.desc")}
        </p>
      </div>

      <div className="relative mt-5">
        <div className="flex items-center justify-between text-[12px] font-semibold text-ink-mute">
          <span>{t("dash.pet.grow")}</span>
          <span>
            {toNext > 0 ? `${toNext} ${pluralDay(lang, toNext)}` : "MAX"}
          </span>
        </div>
        <div className="mt-2 flex gap-1.5">
          {Array.from({ length: 6 }, (_, index) => (
            <span
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                index < stage
                  ? "bg-gradient-to-r from-cyan to-emerald"
                  : "bg-surface-2"
              }`}
            />
          ))}
        </div>
        <span className="sr-only">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </article>
  );
}
