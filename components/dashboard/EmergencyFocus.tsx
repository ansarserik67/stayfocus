"use client";

/**
 * Rescue mode.
 *
 * When the urge to open a feed arrives, this gives the visitor ten seconds of
 * guided breathing and one honest thought before anything else happens. It does
 * not block or shame — it buys the minute in which the impulse usually fades.
 */

import { useCallback, useEffect, useState } from "react";
import { Heart, LifeBuoy, Quote, ShieldCheck, Wind, X } from "lucide-react";

import { useLang } from "@/components/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n";

const DURATION = 10;
const QUOTES: TranslationKey[] = [
  "dash.emergency.quote1",
  "dash.emergency.quote2",
  "dash.emergency.quote3",
  "dash.emergency.quote4",
  "dash.emergency.quote5",
];

const RING_RADIUS = 92;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type Phase = "idle" | "running" | "done";

export function EmergencyFocus() {
  const { t } = useLang();
  const [phase, setPhase] = useState<Phase>("idle");
  const [secondsLeft, setSecondsLeft] = useState(DURATION);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const start = useCallback(() => {
    setSecondsLeft(DURATION);
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
    setPhase("running");
  }, []);

  const stop = useCallback(() => {
    setPhase("idle");
    setSecondsLeft(DURATION);
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      setSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "running" && secondsLeft === 0) setPhase("done");
  }, [phase, secondsLeft]);

  useEffect(() => {
    if (phase === "idle") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") stop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, stop]);

  const elapsed = DURATION - secondsLeft;
  const progress = elapsed / DURATION;
  const inhaling = secondsLeft > DURATION / 2;

  return (
    <article className="card relative overflow-hidden p-6 lg:col-span-2 sm:p-7">
      <div
        aria-hidden="true"
        className="animate-glow pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-amber/20 blur-3xl"
      />

      <header className="relative flex items-center justify-between gap-3">
        <span className="text-eyebrow flex items-center gap-2 text-amber">
          <LifeBuoy size={14} />
          {t("dash.emergency.eyebrow")}
        </span>
        <span className="chip !border-amber/40 !bg-amber/10 !text-[11px] !text-amber">
          <Wind size={12} />
          {DURATION} {t("dash.emergency.countdown")}
        </span>
      </header>

      <div className="relative mt-5 sm:grid sm:grid-cols-[1.4fr_1fr] sm:items-center sm:gap-8">
        <div>
          <h2 className="text-section !text-[23px] sm:!text-[27px]">
            {t("dash.emergency.title")}
          </h2>
          <p className="mt-3 max-w-[46ch] text-[14px] leading-relaxed text-ink-soft">
            {t("dash.emergency.desc")}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-surface-2/40 p-4 sm:mt-0">
          <button type="button" onClick={start} className="btn btn-danger w-full">
            <Heart size={16} />
            {t("dash.emergency.button")}
          </button>
          <p className="text-center text-[12px] leading-relaxed text-ink-mute">
            {t("dash.emergency.waiting")}
          </p>
        </div>
      </div>

      {phase !== "idle" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("dash.emergency.eyebrow")}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-[#04070f]/80 backdrop-blur-md" />

          <div className="animate-rise card relative w-full max-w-[520px] overflow-hidden p-7 text-center sm:p-9">
            <button
              type="button"
              onClick={stop}
              aria-label={t("dash.emergency.abort")}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <X size={17} />
            </button>

            {phase === "running" ? (
              <>
                <p className="text-eyebrow text-amber">
                  {t("dash.emergency.eyebrow")}
                </p>

                <div className="relative mx-auto mt-6 h-[220px] w-[220px]">
                  <div
                    aria-hidden="true"
                    className="animate-breathe absolute inset-3 rounded-full bg-gradient-to-br from-cyan/40 via-transparent to-emerald/40 blur-2xl"
                  />
                  <svg viewBox="0 0 200 200" className="relative h-full w-full -rotate-90">
                    <defs>
                      <linearGradient id="emg-ring" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="100"
                      cy="100"
                      r={RING_RADIUS}
                      fill="none"
                      stroke="var(--line)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r={RING_RADIUS}
                      fill="none"
                      stroke="url(#emg-ring)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
                      className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Wind
                      size={22}
                      className={`text-cyan transition-transform duration-[1000ms] ease-out ${
                        inhaling ? "scale-125" : "scale-90"
                      }`}
                    />
                    <span className="font-display mt-1 text-[52px] font-extrabold leading-none">
                      {secondsLeft}
                    </span>
                    <span className="mt-1 text-[13.5px] font-semibold text-ink-soft">
                      {inhaling
                        ? t("dash.emergency.inhale")
                        : t("dash.emergency.exhale")}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-[12.5px] text-ink-mute">
                  {t("dash.emergency.waiting")}
                </p>

                <div className="mt-7 rounded-2xl border border-line bg-surface-2/50 p-4 text-left">
                  <span className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-mute">
                    <Quote size={12} />
                    {t("dash.emergency.quoteTitle")}
                  </span>
                  <p className="font-display mt-2 text-[16px] font-bold leading-snug">
                    {t(QUOTES[quoteIndex])}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={stop}
                  className="btn btn-ghost mt-6"
                >
                  {t("dash.emergency.abort")}
                </button>
              </>
            ) : (
              <>
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan to-emerald text-[#04121a]">
                  <ShieldCheck size={28} />
                </span>
                <h3 className="text-section mt-5 !text-[24px]">
                  {t("dash.emergency.unlockedTitle")}
                </h3>
                <p className="mx-auto mt-3 max-w-[40ch] text-[14.5px] leading-relaxed text-ink-soft">
                  {t("dash.emergency.unlockedText")}
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={stop} className="btn btn-primary">
                    {t("dash.emergency.unlockedCta")}
                  </button>
                  <button
                    type="button"
                    onClick={start}
                    className="btn btn-secondary"
                  >
                    {t("dash.emergency.again")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
