"use client";

/** Closing CTA band that leads into the personal cabinet. */

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/components/i18n/LanguageProvider";

export function ClosingCta() {
  const { t } = useLang();

  return (
    <section className="section-pad pt-0">
      <div className="container-page">
        <Reveal>
          <div className="ring-grad relative overflow-hidden rounded-[24px] border border-line bg-gradient-to-br from-cyan/16 via-surface to-emerald/16 p-8 text-center sm:p-14">
            <div
              aria-hidden="true"
              className="animate-glow pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full bg-emerald/20 blur-[80px]"
            />
            <span className="animate-float relative inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan to-emerald text-[#04121a]">
              <Zap size={24} />
            </span>
            <h2 className="text-section relative mx-auto mt-6 max-w-[26ch]">
              {t("home.cta.title")}
            </h2>
            <p className="relative mx-auto mt-4 max-w-[52ch] text-[16px] leading-relaxed text-ink-soft">
              {t("home.cta.desc")}
            </p>
            <div className="relative mt-8 flex justify-center">
              <Link href="/dashboard" className="btn btn-primary">
                {t("home.cta.button")}
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
