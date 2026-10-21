"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Info } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";
import { useLang } from "@/components/i18n/LanguageProvider";

export function Footer() {
  const { t } = useLang();

  // Client-only clock (cacheComponents forbids new Date() during prerender).
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="mt-auto border-t border-line bg-background/60">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[42ch] text-[14.5px] leading-relaxed text-ink-soft">
            {t("footer.tagline")}
          </p>
          <div className="mt-5">
            <LanguageSelector />
          </div>
        </div>

        <div>
          <h3 className="text-eyebrow text-ink-mute">{t("footer.product")}</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-[14.5px]">
            <li>
              <Link
                href="/dashboard"
                className="text-ink-soft transition-colors hover:text-cyan"
              >
                {t("nav.dashboard")}
              </Link>
            </li>
            <li>
              <Link
                href="/#features"
                className="text-ink-soft transition-colors hover:text-cyan"
              >
                {t("nav.features")}
              </Link>
            </li>
            <li>
              <Link
                href="/#install"
                className="text-ink-soft transition-colors hover:text-cyan"
              >
                {t("nav.install")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-eyebrow text-ink-mute">{t("footer.legal")}</h3>
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-line bg-surface-2/40 p-3.5">
            <Info size={15} className="mt-0.5 flex-none text-amber" />
            <p className="text-[12.5px] leading-relaxed text-ink-soft">
              {t("footer.demo")}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-[12.5px] text-ink-mute sm:flex-row">
          <p>© {year} {t("footer.rights")}</p>
          <p className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 flex-none rounded-full bg-emerald"
              aria-hidden="true"
            />
            {t("hero.status")}
          </p>
        </div>
      </div>
    </footer>
  );
}
