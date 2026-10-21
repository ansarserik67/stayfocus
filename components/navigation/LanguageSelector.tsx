"use client";

/** Capsule EN / RU / KZ selector driving the global language context. */

import { LANGUAGES } from "@/lib/i18n";
import { useLang } from "@/components/i18n/LanguageProvider";

export function LanguageSelector({ tone = "auto" }: { tone?: "auto" | "onDark" }) {
  const { lang, setLang, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t("nav.langLabel")}
      className={`inline-flex items-center gap-0.5 rounded-full border p-[3px] ${
        tone === "onDark"
          ? "border-white/15 bg-white/5"
          : "border-line bg-surface-2/70"
      }`}
    >
      {LANGUAGES.map((language) => {
        const active = language.code === lang;
        return (
          <button
            key={language.code}
            type="button"
            onClick={() => setLang(language.code)}
            aria-pressed={active}
            title={language.name}
            className={`rounded-full px-2.5 py-[5px] text-[11.5px] font-bold tracking-[0.08em] transition-all duration-250 ${
              active
                ? "bg-gradient-to-br from-cyan to-emerald text-[#04121a] shadow-[0_6px_16px_-8px_var(--glow-cyan)]"
                : tone === "onDark"
                  ? "text-white/55 hover:text-white"
                  : "text-ink-mute hover:text-ink"
            }`}
          >
            {language.label}
          </button>
        );
      })}
    </div>
  );
}
