"use client";

/**
 * Google Identity Services sign-in.
 *
 * This is a genuine Google flow: the user authenticates on Google's own
 * accounts page, Google returns a signed ID token, and the profile shown in
 * the app comes from that token — not from a hardcoded demo account.
 *
 * It needs one thing the repo cannot ship: an OAuth client ID. Create a
 * "Web application" client in Google Cloud Console, add
 * http://localhost:3000 to the authorised JavaScript origins, and put the ID
 * in NEXT_PUBLIC_GOOGLE_CLIENT_ID. Without it the component falls back to the
 * demo button and says so, instead of pretending a login happened.
 *
 * The JWT payload is decoded in the browser for display. A production app must
 * also verify the signature server-side before trusting the claims.
 */

import { useEffect, useRef, useState } from "react";
import { Info, Loader2 } from "lucide-react";

import { useLang } from "@/components/i18n/LanguageProvider";

export interface GoogleProfile {
  name: string;
  email: string;
  picture?: string;
}

interface CredentialResponse {
  credential?: string;
}

interface AccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: Record<string, string | number | boolean>,
  ) => void;
}

declare global {
  interface Window {
    google?: { accounts?: { id?: AccountsId } };
  }
}

const SCRIPT_ID = "google-identity-services";

let scriptPromise: Promise<AccountsId> | null = null;

function loadScript(): Promise<AccountsId> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id);

  if (!scriptPromise) {
    scriptPromise = new Promise<AccountsId>((resolve, reject) => {
      const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      const script = existing ?? document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const id = window.google?.accounts?.id;
        if (id) resolve(id);
        else reject(new Error("Google Identity Services did not initialise"));
      };
      script.onerror = () => reject(new Error("Google Identity Services failed to load"));
      if (!existing) document.head.appendChild(script);
    });
  }

  return scriptPromise;
}

/** Decode a JWT payload without verifying it (display only, see file header). */
function decodeJwt(token: string): Record<string, unknown> | null {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export function GoogleSignInButton({
  onSignedIn,
  onError,
}: {
  onSignedIn: (profile: GoogleProfile) => void;
  onError?: () => void;
}) {
  const { t } = useLang();
  const holder = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    (async () => {
      try {
        const id = await loadScript();
        if (cancelled || !holder.current) return;

        id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            const payload = response.credential ? decodeJwt(response.credential) : null;
            const email = typeof payload?.email === "string" ? payload.email : "";
            if (!email) {
              onError?.();
              return;
            }
            onSignedIn({
              name:
                typeof payload?.name === "string" && payload.name.trim()
                  ? payload.name
                  : email.split("@")[0],
              email,
              picture: typeof payload?.picture === "string" ? payload.picture : undefined,
            });
          },
        });

        id.renderButton(holder.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "pill",
          logo_alignment: "left",
          width: 336,
        });
        setStatus("ready");
      } catch {
        if (!cancelled) {
          setStatus("failed");
          onError?.();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [onSignedIn, onError]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className="mt-4 flex items-start gap-2.5 rounded-2xl border border-line bg-surface-2/50 p-3.5 text-[12px] leading-relaxed text-ink-soft">
        <Info size={14} className="mt-0.5 flex-none text-amber" />
        {t("auth.googleMissing")}
      </p>
    );
  }

  return (
    <div className="mt-6 flex min-h-[44px] w-full flex-col items-center justify-center gap-2">
      <div ref={holder} className="flex w-full justify-center" />
      {(status === "loading" || status === "failed") && (
        <span className="flex items-center gap-2 text-[12.5px] text-ink-mute">
          {status === "loading" ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              {t("auth.googleLoading")}
            </>
          ) : (
            t("auth.googleFailed")
          )}
        </span>
      )}
    </div>
  );
}
