"use client";

/** "How it works" feature grid + the three-step first-week flow. */

import { CalendarCheck, ChartColumn, Flame, Globe, Quote, Wind } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/components/i18n/LanguageProvider";

const FEATURES = [
  { key: "streak", Icon: Flame, tone: "text-amber bg-amber/12" },
  { key: "analytics", Icon: ChartColumn, tone: "text-cyan bg-cyan/12" },
  { key: "planner", Icon: CalendarCheck, tone: "text-emerald bg-emerald/12" },
  { key: "rescue", Icon: Wind, tone: "text-indigo bg-indigo/12" },
  { key: "extension", Icon: Globe, tone: "text-cyan bg-cyan/12" },
] as const;

const STEPS = ["step1", "step2", "step3"] as const;

export function Features() {
  const { t } = useLang();

  return (
    <section id="features" className="section-pad scroll-mt-24">
      <div className="container-page">
        <Reveal>
          <div className="max-w-[60ch]">
            <p className="text-eyebrow text-cyan">{t("home.features.eyebrow")}</p>
            <h2 className="text-section mt-3">{t("home.features.title")}</h2>
            <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">
              {t("home.features.desc")}
            </p>
          </div>
        </Reveal>

        <div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.key} delay={index * 80}>
              <article className="card card-hover group h-full p-6">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${feature.tone}`}
                >
                  <feature.Icon size={20} />
                </span>
                <h3 className="text-card mt-5">
                  {t(`feature.${feature.key}.title` as never)}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">
                  {t(`feature.${feature.key}.desc` as never)}
                </p>
              </article>
            </Reveal>
          ))}

          <Reveal delay={400} className="md:col-span-2 lg:col-span-1">
            <article className="ring-grad relative flex h-full flex-col justify-between overflow-hidden rounded-[18px] border border-line bg-gradient-to-br from-cyan/12 via-transparent to-emerald/12 p-6">
              <Quote size={22} className="text-cyan" />
              <p className="font-display mt-5 text-[19px] font-bold leading-snug">
                {t("home.how.quote")}
              </p>
              <span className="text-eyebrow mt-5 text-ink-mute">
                StayFocus · {t("home.how.eyebrow")}
              </span>
            </article>
          </Reveal>
        </div>

        {/* three steps */}
        <div className="mt-16">
          <Reveal>
            <h2 className="text-section max-w-[26ch]">{t("home.how.title")}</h2>
          </Reveal>
          <ol className="mt-9 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <Reveal key={step} delay={index * 100} as="li">
                <div className="card relative h-full overflow-hidden p-6">
                  <span className="font-display absolute right-5 top-4 text-[52px] font-extrabold leading-none text-ink/5">
                    0{index + 1}
                  </span>
                  <span className="font-display inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-emerald text-[14px] font-extrabold text-[#04121a]">
                    {index + 1}
                  </span>
                  <h3 className="text-card mt-5">
                    {t(`home.how.${step}.title` as never)}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">
                    {t(`home.how.${step}.desc` as never)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
