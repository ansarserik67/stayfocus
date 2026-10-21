"use client";

/** Landing hero: headline, motivation, CTAs and the animated streak ring. */

import Link from "next/link";
import { ArrowRight, Flame, ShieldOff, Sparkles, Zap } from "lucide-react";

import { useLang } from "@/components/i18n/LanguageProvider";
import {
  BLOCKED_TODAY,
  levelForDays,
  levelProgress,
  STARTING_STREAK,
} from "@/lib/focus-data";
import { pluralDay, type TranslationKey } from "@/lib/i18n";

const RING_RADIUS = 86;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function Hero() {
  const { t, lang } = useLang();
  const streak = STARTING_STREAK;
  const level = levelForDays(streak);
  const progress = levelProgress(streak);

  return (
    <section className="relative overflow-hidden pb-8 pt-10 md:pt-16">
      {/* ambient orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -left-28 top-4 h-80 w-80 rounded-full bg-cyan/25 blur-[90px]" />
        <div className="animate-glow absolute right-[-60px] top-28 h-96 w-96 rounded-full bg-emerald/20 blur-[100px]" />
      </div>

      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr]">
        {/* ---------- copy ---------- */}
        <div className="animate-rise">
          <span className="chip !border-cyan/35 !bg-cyan/10 !text-cyan">
            <Sparkles size={13} />
            {t("hero.badge")}
          </span>

          <h1 className="text-hero mt-5 max-w-[16ch]">
            <span
              style={{
                backgroundImage:
                  "linear-gradient(100deg, var(--ink) 0%, var(--ink) 40%, var(--cyan) 72%, var(--emerald) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {t("hero.title")}
            </span>
          </h1>

          <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-ink-soft md:text-[18px]">
            {t("hero.subtitle")}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/dashboard" className="btn btn-primary">
              {t("hero.cta")}
              <ArrowRight size={17} />
            </Link>
            <Link href="/#features" className="btn btn-secondary">
              {t("hero.ctaSecondary")}
            </Link>
          </div>

          <p className="mt-6 flex items-center gap-2 text-[13.5px] text-ink-mute">
            <span className="inline-block h-2 w-2 flex-none rounded-full bg-emerald" />
            {t("hero.status")}
          </p>
        </div>

        {/* ---------- streak ring visual ---------- */}
        <div className="animate-rise relative mx-auto w-full max-w-[440px] [animation-delay:120ms]">
          <div className="card ring-grad relative p-6 pt-8">
            <div className="flex items-center justify-between">
              <span className="text-eyebrow text-ink-mute">
                {t("dash.streak.eyebrow")}
              </span>
              <span className="chip !border-amber/40 !bg-amber/10 !text-amber">
                {t("dash.demoBadge")}
              </span>
            </div>

            <div className="relative mx-auto mt-6 h-[212px] w-[212px]">
              <div
                aria-hidden="true"
                className="animate-glow absolute inset-4 rounded-full bg-gradient-to-br from-cyan/30 to-emerald/25 blur-2xl"
              />
              <svg viewBox="0 0 200 200" className="relative h-full w-full -rotate-90">
                <defs>
                  <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="var(--line)"
                  strokeWidth="12"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="url(#hero-ring)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
                  className="transition-[stroke-dashoffset] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Zap size={22} className="text-cyan" />
                <span className="font-display mt-1 text-[46px] font-extrabold leading-none">
                  {streak}
                </span>
                <span className="text-[13px] font-semibold text-ink-mute">
                  {pluralDay(lang, streak)}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="font-display text-[16px] font-extrabold">
                {t(`dash.level.${level}` as TranslationKey)}
              </p>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="progress-shine h-full rounded-full"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* floating stat cards */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="card card-hover p-3.5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-cyan/12 text-cyan">
                  <ShieldOff size={17} />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-[19px] font-extrabold leading-none">
                    {BLOCKED_TODAY}
                  </p>
                  <p className="mt-1 truncate text-[11.5px] text-ink-mute">
                    {t("hero.floatCard")}
                  </p>
                </div>
              </div>
            </div>

            <div className="card card-hover p-3.5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-emerald/12 text-emerald">
                  <Flame size={17} />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-[19px] font-extrabold leading-none">
                    {streak} {pluralDay(lang, streak)}
                  </p>
                  <p className="mt-1 truncate text-[11.5px] text-ink-mute">
                    {t("hero.floatCard2")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
