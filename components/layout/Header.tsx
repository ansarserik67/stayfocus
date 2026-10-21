"use client";

/**
 * Sticky glass header: logo · navigation · language capsule · theme switch ·
 * auth control. Collapses into a panel on small screens.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { AuthControl } from "@/components/auth/AuthControl";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { useLang } from "@/components/i18n/LanguageProvider";

const NAV_ITEMS = [
  { href: "/", key: "nav.home" },
  { href: "/#features", key: "nav.features" },
  { href: "/#install", key: "nav.install" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // In-page section links (/#features) carry no active state of their own —
  // otherwise every hash link would look selected on each route.
  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex h-[74px] items-center justify-between gap-4">
        <Logo />

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3.5 py-2 text-[14.5px] font-semibold transition-colors duration-200 ${
                isActive(item.href)
                  ? "bg-surface-2/70 text-ink"
                  : "text-ink-soft hover:bg-surface-2/60 hover:text-ink"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className={`rounded-full px-3.5 py-2 text-[14.5px] font-semibold transition-colors duration-200 ${
              pathname.startsWith("/dashboard")
                ? "bg-surface-2/70 text-ink"
                : "text-ink-soft hover:bg-surface-2/60 hover:text-ink"
            }`}
          >
            {t("nav.dashboard")}
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
          <ThemeToggle />
          <div className="hidden sm:block">
            <AuthControl compact />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-2/60 text-ink transition-colors hover:border-line-strong lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="animate-rise border-t border-line bg-background/95 backdrop-blur-xl lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="container-page flex flex-col gap-1 py-4"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3.5 py-3 text-[16px] font-semibold text-ink-soft transition-colors hover:bg-surface-2/70 hover:text-ink"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3.5 py-3 text-[16px] font-semibold text-ink-soft transition-colors hover:bg-surface-2/70 hover:text-ink"
            >
              {t("nav.dashboard")}
            </Link>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <LanguageSelector />
              <div className="sm:hidden">
                <AuthControl />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
