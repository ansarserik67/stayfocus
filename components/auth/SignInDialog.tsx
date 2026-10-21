"use client";

/**
 * Simulated Google account chooser.
 *
 * Clearly labelled as a demo: it renders the familiar chooser layout so the
 * flow feels real, but no OAuth request is made and no account is contacted.
 */

import { useEffect, useRef, useState } from "react";
import { Check, Info, X } from "lucide-react";

import { LogoMark } from "@/components/brand/Logo";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  GOOGLE_CLIENT_ID,
  GoogleSignInButton,
} from "@/components/auth/GoogleSignInButton";
import { useLang } from "@/components/i18n/LanguageProvider";

function GoogleGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-2.8-.4-4.1H24v8.1h12c-.2 2-1.5 5-4.4 7l-.1.2 6.4 4.9.4.1c4-3.7 6.8-9.2 6.8-16.2Z"
      />
      <path
        fill="#34A853"
        d="M24 45.6c5.8 0 10.7-1.9 14.3-5.2l-6.8-5.3c-1.8 1.3-4.3 2.2-7.5 2.2-5.7 0-10.6-3.8-12.3-9l-.2.1-6.6 5.1-.1.2c3.6 7.1 10.9 11.9 19.2 11.9Z"
      />
      <path
        fill="#FBBC05"
        d="M11.7 28.3c-.5-1.4-.7-2.9-.7-4.4 0-1.5.3-3 .7-4.4v-.2L5 14.2l-.2.1A21.5 21.5 0 0 0 2.4 24c0 3.4.8 6.7 2.4 9.7l6.9-5.4Z"
      />
      <path
        fill="#EA4335"
        d="M24 9.7c4 0 6.8 1.7 8.3 3.2l6.1-6C34.7 3.5 29.8 1.4 24 1.4 15.7 1.4 8.4 6.2 4.8 13.3l6.9 5.4C13.4 13.5 18.3 9.7 24 9.7Z"
      />
    </svg>
  );
}

export function SignInDialog({
  open,
  onClose,
  onSignedIn,
}: {
  open: boolean;
  onClose: () => void;
  onSignedIn?: () => void;
}) {
  const { t } = useLang();
  const { signIn, signInWithGoogle } = useAuth();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [googleFailed, setGoogleFailed] = useState(false);

  const handleContinue = () => {
    signInWithGoogle();
    onClose();
    onSignedIn?.();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#04070f]/70 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="card animate-rise relative w-full max-w-[420px] overflow-hidden p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("auth.cancel")}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <X size={17} />
        </button>

        <div className="flex flex-col items-center text-center">
          <LogoMark size={48} />
          <h2
            id="signin-title"
            className="font-display mt-4 text-[21px] font-extrabold"
          >
            {t("auth.dialogTitle")}
          </h2>
          <p className="mt-1 text-[14px] text-ink-soft">
            {t("auth.dialogSubtitle")}
          </p>
        </div>

        {/* Primary Google entry point. With a client ID this is Google's own
            button and a real account; without it, an honest demo fallback. */}
        {GOOGLE_CLIENT_ID ? (
          <GoogleSignInButton
            onSignedIn={(profile) => {
              signIn(profile);
              onClose();
              onSignedIn?.();
            }}
            onError={() => setGoogleFailed(true)}
          />
        ) : (
          <>
            <button
              type="button"
              onClick={handleContinue}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-line bg-surface-2/80 px-4 py-3.5 text-[15px] font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan hover:shadow-[0_18px_36px_-24px_var(--glow-cyan)]"
            >
              <GoogleGlyph size={19} />
              <span>{t("auth.googleButton")}</span>
            </button>
            <GoogleSignInButton
              onSignedIn={(profile) => {
                signIn(profile);
                onClose();
                onSignedIn?.();
              }}
            />
          </>
        )}

        {googleFailed && (
          <p role="alert" className="mt-3 text-center text-[12.5px] text-amber">
            {t("auth.googleFailed")}
          </p>
        )}

        <div className="my-5 flex items-center gap-3 text-[12px] text-ink-mute">
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
          <span>{t("auth.orDemo")}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface-2/40 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong"
        >
          <span className="font-display inline-flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-cyan to-emerald text-[15px] font-extrabold text-[#04121a]">
            FF
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-semibold text-ink">
              {t("auth.demoAccount")}
            </span>
            <span className="block truncate text-[13px] text-ink-mute">
              {t("auth.demoEmail")}
            </span>
          </span>
          <Check size={17} className="flex-none text-emerald" />
        </button>

        <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-line bg-surface-2/50 p-3.5">
          <Info size={15} className="mt-0.5 flex-none text-cyan" />
          <p className="text-[12.5px] leading-relaxed text-ink-soft">
            {t("auth.demoNote")}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-ink-mute">
          <span className="chip !border-amber/40 !bg-amber/10 !text-amber">
            {t("auth.demoBadge")}
          </span>
        </div>
      </div>
    </div>
  );
}
