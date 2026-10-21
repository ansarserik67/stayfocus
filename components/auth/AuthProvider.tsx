"use client";

/**
 * Demo authentication.
 *
 * This is a front-end prototype, so sign-in is simulated: clicking the Google
 * button creates a local profile in this browser only. No OAuth request is
 * made, no token is stored, and nothing leaves the device. The UI labels this
 * wherever it appears — replacing it with a real provider means swapping this
 * module for an OAuth client and keeping the same `useAuth()` surface.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "stayfocus.user";

export interface FocusUser {
  name: string;
  email: string;
  /** Two-letter monogram for the avatar chip. */
  initials: string;
  /** ISO date the local profile was created. */
  since: string;
  /** Google account picture, when the real flow supplied one. */
  picture?: string;
}

interface AuthContextValue {
  user: FocusUser | null;
  /** True once localStorage has been read — guards against hydration jumps. */
  ready: boolean;
  signIn: (profile: { name: string; email: string; picture?: string }) => void;
  /** Demo path: creates the local prototype profile. */
  signInWithGoogle: () => FocusUser;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** The single demo account offered by the simulated Google chooser. */
export const DEMO_ACCOUNT = {
  nameKey: "auth.demoAccount",
  email: "focus.friend@gmail.com",
} as const;

function isFocusUser(value: unknown): value is FocusUser {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.email === "string" && typeof candidate.name === "string";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FocusUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isFocusUser(parsed)) setUser(parsed);
      }
    } catch {
      /* corrupted or unavailable storage — start signed out */
    }
    setReady(true);
  }, []);

  const signIn = useCallback((next: { name: string; email: string; picture?: string }) => {
    const profile: FocusUser = {
      name: next.name,
      email: next.email,
      picture: next.picture,
      initials:
        next.name
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join("") || next.email.slice(0, 1).toUpperCase(),
      since: new Date().toISOString().slice(0, 10),
    };
    setUser(profile);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const signInWithGoogle = useCallback(() => {
    const since = new Date().toISOString().slice(0, 10);
    signIn({ name: "Focus Friend", email: "focus.friend@gmail.com" });
    return {
      name: "Focus Friend",
      email: "focus.friend@gmail.com",
      initials: "FF",
      since,
    };
  }, [signIn]);

  const value = useMemo(
    () => ({ user, ready, signIn, signInWithGoogle, signOut }),
    [user, ready, signIn, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
