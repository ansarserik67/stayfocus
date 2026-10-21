"use client";

/**
 * Step-by-step guide for connecting the StayFocus Control Chrome extension.
 * Reused as a panel inside the dashboard (`compact`).
 */

import { Download, LogIn, MonitorSmartphone, Puzzle } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/components/i18n/LanguageProvider";

const STEPS = [
  { key: "step1", Icon: Download },
  { key: "step2", Icon: MonitorSmartphone },
  { key: "step3", Icon: Puzzle },
  { key: "step4", Icon: LogIn },
] as const;

export function ExtensionSteps({ compact = false }: { compact?: boolean }) {
  const { t } = useLang();

  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {STEPS.map((step, index) => (
        <li key={step.key}>
          <div
            className={`flex h-full gap-4 rounded-2xl border border-line bg-surface-2/40 p-4 transition-colors duration-200 hover:border-line-strong ${
              compact ? "" : "sm:p-5"
            }`}
          >
            <span className="font-display relative inline-flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-cyan to-emerald text-[#04121a]">
              <step.Icon size={18} />
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-line bg-surface text-[10.5px] font-extrabold text-ink">
                {index + 1}
              </span>
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-[15.5px] font-bold">
                {t(`install.${step.key}.title` as never)}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
                {t(`install.${step.key}.desc` as never)}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function InstallSection() {
  const { t } = useLang();

  return (
    <section id="install" className="section-pad scroll-mt-24">
      <div className="container-page">
        <div className="card ring-grad relative overflow-hidden p-6 sm:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan/15 blur-3xl"
          />
          <Reveal>
            <div className="relative grid gap-9 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <span className="chip !border-emerald/40 !bg-emerald/10 !text-emerald">
                  <Puzzle size={13} />
                  {t("install.eyebrow")}
                </span>
                <h2 className="text-section mt-4 max-w-[22ch]">
                  {t("install.title")}
                </h2>
                <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
                  {t("install.desc")}
                </p>

                <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-line bg-surface-2/60 px-3.5 py-2.5">
                  <MonitorSmartphone size={15} className="flex-none text-cyan" />
                  <code className="truncate font-mono text-[13px] text-ink-soft">
                    chrome://extensions
                  </code>
                </div>

                <p className="mt-4 text-[12.5px] leading-relaxed text-ink-mute">
                  {t("install.note")}
                </p>
              </div>

              <ExtensionSteps />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
