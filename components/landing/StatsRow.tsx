"use client";

/** Motivational stat cards: hours saved, wins over Reels, control. */

import { Clock, ShieldCheck, Trophy } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/components/i18n/LanguageProvider";
import { HERO_STATS } from "@/lib/focus-data";
import type { TranslationKey } from "@/lib/i18n";

const ICONS = {
  cyan: Clock,
  emerald: ShieldCheck,
  indigo: Trophy,
} as const;

const TONES = {
  cyan: "from-cyan/18 to-cyan/0 text-cyan",
  emerald: "from-emerald/18 to-emerald/0 text-emerald",
  indigo: "from-indigo/18 to-indigo/0 text-indigo",
} as const;

export function StatsRow() {
  const { t } = useLang();

  return (
    <section className="section-pad">
      <div className="container-page">
        <Reveal>
          <p className="text-eyebrow text-ink-mute">{t("stats.eyebrow")}</p>
        </Reveal>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HERO_STATS.map((stat, index) => {
            const Icon = ICONS[stat.tone];
            return (
              <Reveal key={stat.valueKey} delay={index * 90}>
                <article className="card card-hover relative h-full overflow-hidden p-6">
                  <div
                    aria-hidden="true"
                    className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${TONES[stat.tone]} blur-2xl`}
                  />
                  <span
                    className={`relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${TONES[stat.tone]}`}
                  >
                    <Icon size={20} />
                  </span>
                  <p className="font-display relative mt-5 text-[40px] font-extrabold leading-none tracking-[-0.03em]">
                    <span className="text-grad">{t(stat.valueKey as TranslationKey)}</span>
                  </p>
                  <p className="font-display relative mt-2 text-[16.5px] font-bold">
                    {t(stat.labelKey as TranslationKey)}
                  </p>
                  <p className="relative mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">
                    {t(stat.hintKey as TranslationKey)}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
