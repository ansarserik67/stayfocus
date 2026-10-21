"use client";

/**
 * Saved time turned into real deeds.
 *
 * The slider is the honest part of the promise: instead of asserting a fixed
 * number, the visitor sets how many hours they actually reclaimed and sees
 * what those hours buy in real life.
 */

import { useState } from "react";
import { Hourglass, Sparkles } from "lucide-react";

import { useLang } from "@/components/i18n/LanguageProvider";
import { DEFAULT_SAVED_HOURS, deedsForHours } from "@/lib/focus-data";

const MAX_HOURS = 6;

export function SavedTimeCard() {
  const { t } = useLang();
  const [hours, setHours] = useState(DEFAULT_SAVED_HOURS);
  const deeds = deedsForHours(hours);

  return (
    <article className="card relative overflow-hidden p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-indigo/15 blur-3xl"
      />

      <header className="relative flex items-start justify-between gap-4">
        <div>
          <span className="text-eyebrow text-indigo">
            {t("dash.saved.eyebrow")}
          </span>
          <h2 className="text-card mt-2">{t("dash.saved.title")}</h2>
        </div>
        <Sparkles size={17} className="mt-0.5 flex-none text-indigo" />
      </header>

      <p className="relative mt-3 text-[13.5px] leading-relaxed text-ink-soft">
        {t("dash.saved.desc")}
      </p>

      {/* the equation */}
      <div className="relative mt-6 rounded-2xl border border-line bg-gradient-to-br from-cyan/12 to-emerald/10 p-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-[44px] font-extrabold leading-none tracking-[-0.04em]">
            <span className="text-grad">{hours}</span>
            <span className="ml-1.5 text-[18px] text-ink-soft">
              {t("dash.screen.hoursShort")}
            </span>
          </span>
          <span className="font-display text-[16px] font-bold text-ink-soft">
            {t("dash.saved.resultPrefix")}
          </span>
        </div>

        {deeds.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {deeds.map((deed) => (
              <li
                key={deed.labelKey}
                className="animate-pop inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-[13px] font-semibold text-ink"
              >
                <span className="text-ink-soft">
                  {t(deed.labelKey)}
                </span>
                <span className="font-display text-grad font-extrabold">
                  ×{deed.count}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[13.5px] text-ink-mute">
            {t("dash.saved.empty")}
          </p>
        )}
      </div>

      {/* slider */}
      <div className="relative mt-6">
        <label
          htmlFor="saved-hours"
          className="flex items-center justify-between text-[12.5px] font-semibold text-ink-soft"
        >
          <span className="flex items-center gap-2">
            <Hourglass size={13} className="text-cyan" />
            {t("dash.saved.slider")}
          </span>
          <span className="text-ink-mute">
            {hours} / {MAX_HOURS} {t("dash.screen.hoursShort")}
          </span>
        </label>
        <input
          id="saved-hours"
          type="range"
          min={0}
          max={MAX_HOURS}
          step={0.5}
          value={hours}
          onChange={(event) => setHours(Number(event.target.value))}
          aria-valuetext={`${hours} ${t("dash.screen.hoursShort")}`}
          className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-2 outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-cyan [&::-webkit-slider-thumb]:to-emerald [&::-webkit-slider-thumb]:shadow-[0_6px_16px_-6px_var(--glow-cyan)] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-cyan"
        />
      </div>
    </article>
  );
}
