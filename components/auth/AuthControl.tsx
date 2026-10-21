"use client";

/**
 * Header auth cluster: a "Sign in" button when signed out, and a profile chip
 * with a small menu (open cabinet / sign out) when signed in.
 */

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Sparkles } from "lucide-react";

import { SignInDialog } from "@/components/auth/SignInDialog";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLang } from "@/components/i18n/LanguageProvider";

export function AuthControl({ compact = false }: { compact?: boolean }) {
  const { user, signOut, ready } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Signed out on the cabinet route → nothing to render but the entry button.
  if (ready && !user) {
    return (
      <>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="btn btn-primary !min-h-[42px] !px-4 !py-2.5 text-[14px]"
        >
          <Sparkles size={15} />
          <span className={compact ? "sm:inline" : ""}>
            {t("auth.signInGoogle")}
          </span>
        </button>
        <SignInDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSignedIn={() => {
            if (pathname !== "/dashboard") router.push("/dashboard");
          }}
        />
      </>
    );
  }

  if (!user) {
    // Still hydrating — keep the layout from jumping.
    return <div className="h-[42px] w-[136px] rounded-full bg-surface-2/60" />;
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-line bg-surface-2/70 py-1 pl-1 pr-2.5 transition-colors hover:border-line-strong"
      >
        {user.picture ? (
          <Image
            src={user.picture}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 flex-none rounded-full object-cover"
          />
        ) : (
          <span className="font-display inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-emerald text-[13px] font-extrabold text-[#04121a]">
            {user.initials || "SF"}
          </span>
        )}
        <span className="hidden max-w-[110px] truncate text-[13.5px] font-semibold text-ink sm:block">
          {user.name}
        </span>
        <ChevronDown
          size={14}
          className={`text-ink-mute transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
        />
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="card animate-rise absolute right-0 top-[calc(100%+10px)] z-50 w-[236px] overflow-hidden p-1.5"
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-[13.5px] font-semibold text-ink">
              {user.name}
            </p>
            <p className="truncate text-[12px] text-ink-mute">{user.email}</p>
          </div>
          <Link
            href="/dashboard"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <LayoutDashboard size={15} />
            {t("nav.dashboard")}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              signOut();
              setMenuOpen(false);
              if (pathname === "/dashboard") router.push("/");
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <LogOut size={15} />
            {t("auth.signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
