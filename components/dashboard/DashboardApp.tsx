"use client";

/**
 * Personal cabinet. Composes the streak, companion, screen-time analytics,
 * saved-time converter, weekly planner, rescue mode and the extension guide.
 * Signed-out visitors get an honest gate instead of a redirected blank page.
 */

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarCheck, Info, Puzzle, Zap } from "lucide-react";

import { SignInDialog } from "@/components/auth/SignInDialog";
import { useAuth } from "@/components/auth/AuthProvider";
import { EmergencyFocus } from "@/components/dashboard/EmergencyFocus";
import { FocusPet } from "@/components/dashboard/FocusPet";
import { LimitsPanel } from "@/components/dashboard/LimitsPanel";
import { SavedTimeCard } from "@/components/dashboard/SavedTimeCard";
import { ScreenTimeCompare, ScreenTimeDailyChart } from "@/components/dashboard/ScreenTime";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { WeekPlanner } from "@/components/dashboard/WeekPlanner";
import { ExtensionSteps } from "@/components/landing/InstallGuide";
import { useLang } from "@/components/i18n/LanguageProvider";
import { LogoMark } from "@/components/brand/Logo";
import { useFocusStore } from "@/lib/use-focus-store";

function SignInGate() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card ring-grad animate-rise w-full max-w-[520px] p-8 text-center sm:p-10">
        <LogoMark size={64} />
        <h1 className="text-section mt-5 !text-[25px] sm:!text-[28px]">
          {t("auth.gateTitle")}
        </h1>
        <p className="mx-auto mt-3.5 max-w-[44ch] text-[14.5px] leading-relaxed text-ink-soft">
          {t("auth.gateText")}
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn btn-primary mt-7"
        >
          <Zap size={17} />
          {t("auth.gateCta")}
        </button>
        <p className="mt-5 text-[12px] text-ink-mute">{t("auth.demoNote")}</p>
      </div>

      <SignInDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export function DashboardApp() {
  const { user, ready } = useAuth();
  const { t } = useLang();
  const {
    store,
    hydrated,
    weekDone,
    today,
    dayProgress,
    markToday,
    resetStreak,
    toggleHabit,
    resetWeek,
  } = useFocusStore();

  if (!ready || !hydrated) {
    return (
      <div className="container-page py-16">
        <div className="animate-pulse space-y-5">
          <div className="h-9 w-64 rounded-full bg-surface-2/60" />
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="h-64 rounded-[18px] bg-surface-2/50 lg:col-span-2" />
            <div className="h-64 rounded-[18px] bg-surface-2/50" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <SignInGate />;

  return (
    <div className="container-page py-10 sm:py-12">
      {/* ---------- greeting ---------- */}
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="text-eyebrow text-cyan">{t("dash.subtitle")}</span>
          <h1 className="text-section mt-2">
            {t("dash.hello")},{" "}
            <span className="text-grad">{user.name.split(" ")[0]}</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="chip !border-amber/40 !bg-amber/10 !text-amber">
            <Info size={12} />
            {t("dash.demoBadge")}
          </span>
          <span className="chip">
            <CalendarCheck size={13} className="text-emerald" />
            {t("dash.today")}: {today.done} {t("dash.of")} {today.total}
          </span>
        </div>
      </header>

      {/* ---------- grid ---------- */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <StreakCard
          streak={store.streak}
          best={store.best}
          todayDone={store.todayDone}
          onMarkToday={markToday}
          onReset={resetStreak}
        />

        <FocusPet streak={store.streak} />

        <LimitsPanel />

        <ScreenTimeDailyChart />
        <ScreenTimeCompare />

        <SavedTimeCard />
        <EmergencyFocus />

        <WeekPlanner
          planner={store.planner}
          weekDone={weekDone}
          today={today}
          dayProgress={dayProgress}
          onToggle={toggleHabit}
          onReset={resetWeek}
        />

        {/* ---------- extension ---------- */}
        <section className="card p-6 lg:col-span-3">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-eyebrow flex items-center gap-2 text-cyan">
                <Puzzle size={14} />
                {t("install.eyebrow")}
              </span>
              <h2 className="text-card mt-2">{t("dash.install.title")}</h2>
              <p className="mt-2 max-w-[56ch] text-[13.5px] leading-relaxed text-ink-soft">
                {t("dash.install.desc")}
              </p>
            </div>
            <Link href="/#install" className="btn btn-secondary">
              {t("nav.install")}
              <ArrowRight size={16} />
            </Link>
          </header>
          <div className="mt-5">
            <ExtensionSteps compact />
          </div>
        </section>
      </div>
    </div>
  );
}
