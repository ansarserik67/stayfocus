"use client";

/** Capsule light/dark switch: ☀️ | 🌙, with a sliding active pill. */

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme/ThemeProvider";
import { useLang } from "@/components/i18n/LanguageProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLang();
  const isDark = theme === "dark";

  return (
    <div
      role="group"
      aria-label={t("theme.label")}
      className="relative inline-flex items-center rounded-full border border-line bg-surface-2/70 p-[3px]"
    >
      <span
        aria-hidden="true"
        className={`absolute top-[3px] h-[calc(100%-6px)] w-[calc(50%-3px)] rounded-full bg-gradient-to-br from-cyan to-emerald transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDark ? "translate-x-[calc(100%+3px)]" : "translate-x-0"
        }`}
      />
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={!isDark}
        title={t("theme.toLight")}
        className={`relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 ${
          isDark ? "text-ink-mute hover:text-ink" : "text-[#04121a]"
        }`}
      >
        <Sun size={15} strokeWidth={2.4} />
        <span className="sr-only">{t("theme.toLight")}</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={isDark}
        title={t("theme.toDark")}
        className={`relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 ${
          isDark ? "text-[#04121a]" : "text-ink-mute hover:text-ink"
        }`}
      >
        <Moon size={15} strokeWidth={2.4} />
        <span className="sr-only">{t("theme.toDark")}</span>
      </button>
    </div>
  );
}
