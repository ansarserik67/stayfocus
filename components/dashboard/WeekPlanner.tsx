"use client";

/**
 * Motivational weekly planner: instead of feeding the timeline, each day holds
 * real tasks. Ticking one plays a small success animation and moves the week
 * progress bar; a perfect day is celebrated explicitly.
 */

import {
  BookOpen,
  Check,
  Dumbbell,
  Footprints,
  GraduationCap,
  Rocket,
  ShieldOff,
  Users,
  WandSparkles,
} from "lucide-react";

import { useLang } from "@/components/i18n/LanguageProvider";
import {
  DAY_KEYS,
  TODAY_INDEX,
  TOTAL_PLANNED,
  WEEK_PLAN,
} from "@/lib/focus-data";
import type { HabitId } from "@/types/focus";
import type { TranslationKey } from "@/lib/i18n";

const HABIT_ICONS: Record<HabitId, typeof Dumbbell> = {
  sport: Dumbbell,
  study: GraduationCap,
  reading: BookOpen,
  project: Rocket,
  walk: Footprints,
  family: Users,
  noReels: ShieldOff,
};

export function WeekPlanner({
  planner,
  weekDone,
  today,
  dayProgress,
  onToggle,
  onReset,
}: {
  planner: Record<string, boolean>;
  weekDone: number;
  today: { done: number; total: number };
  dayProgress: (dayIndex: number) => { done: number; total: number };
  onToggle: (dayIndex: number, habit: HabitId) => void;
  onReset: () => void;
}) {
  const { t } = useLang();
  const weekPercent = Math.round((weekDone / TOTAL_PLANNED) * 100);
  const todayPerfect = today.total > 0 && today.done === today.total;

  return (
    <article className="card p-6 lg:col-span-3">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-eyebrow text-emerald">
            {t("dash.planner.eyebrow")}
          </span>
          <h2 className="text-section mt-2 !text-[26px] sm:!text-[30px]">
            {t("dash.planner.title")}
          </h2>
          <p className="mt-2 max-w-[58ch] text-[13.5px] leading-relaxed text-ink-soft">
            {t("dash.planner.desc")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-[168px] min-w-[140px] flex-1">
            <div className="flex items-center justify-between text-[12px] font-semibold text-ink-mute">
              <span>{t("dash.planner.progress")}</span>
              <span className="text-ink">{weekPercent}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className="progress-shine h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: `${Math.max(2, weekPercent)}%` }}
              />
            </div>
            <p className="mt-2 text-[11.5px] text-ink-mute">
              {weekDone} / {TOTAL_PLANNED} {t("dash.planner.done")}
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="btn btn-ghost !min-h-[36px] !px-3 !py-2 text-[12.5px]"
          >
            <WandSparkles size={14} />
            {t("dash.planner.reset")}
          </button>
        </div>
      </header>

      {todayPerfect && (
        <div className="animate-pop mt-5 flex items-center gap-3 rounded-2xl border border-emerald/40 bg-emerald/10 p-3.5">
          <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gradient-to-br from-cyan to-emerald text-[#04121a]">
            <Check size={16} />
          </span>
          <p className="text-[13.5px] font-semibold text-ink">
            {t("dash.planner.complete")}
          </p>
        </div>
      )}

      {/* min-w-0 lets long Russian/Kazakh labels wrap inside narrow columns
          instead of forcing the whole page to scroll sideways. */}
      <div className="thin-scroll mt-6 grid grid-cols-2 gap-3 [&>*]:min-w-0 sm:grid-cols-4 lg:grid-cols-7">
        {WEEK_PLAN.map((habits, dayIndex) => {
          const { done, total } = dayProgress(dayIndex);
          const isToday = dayIndex === TODAY_INDEX;
          const complete = total > 0 && done === total;

          return (
            <div
              key={DAY_KEYS[dayIndex]}
              className={`flex flex-col rounded-2xl border p-3.5 transition-colors duration-300 ${
                isToday
                  ? "border-cyan/50 bg-cyan/6"
                  : complete
                    ? "border-emerald/40 bg-emerald/6"
                    : "border-line bg-surface-2/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-[14.5px] font-extrabold">
                  {t(DAY_KEYS[dayIndex] as TranslationKey)}
                </span>
                {isToday ? (
                  <span className="chip !border-cyan/40 !bg-cyan/10 !px-2 !py-0.5 !text-[10.5px] !text-cyan">
                    {t("dash.planner.doneToday")}
                  </span>
                ) : (
                  <span className="text-[11.5px] font-semibold text-ink-mute">
                    {done}/{total}
                  </span>
                )}
              </div>

              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    complete
                      ? "bg-gradient-to-r from-cyan to-emerald"
                      : "bg-line-strong"
                  }`}
                  style={{ width: `${total ? (done / total) * 100 : 0}%` }}
                />
              </div>

              <ul className="mt-3.5 flex flex-1 flex-col gap-1.5">
                {habits.map((habit) => {
                  const key = `${dayIndex}:${habit}`;
                  const checked = Boolean(planner[key]);
                  const Icon = HABIT_ICONS[habit];
                  return (
                    <li key={habit}>
                      <button
                        type="button"
                        onClick={() => onToggle(dayIndex, habit)}
                        aria-pressed={checked}
                        className={`group flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-[12.5px] font-semibold transition-all duration-200 ${
                          checked
                            ? "border-transparent bg-gradient-to-br from-cyan to-emerald text-[#04121a]"
                            : "border-line bg-surface/70 text-ink-soft hover:border-cyan/50 hover:text-ink"
                        }`}
                      >
                        <span
                          className={`inline-flex h-4 w-4 flex-none items-center justify-center rounded-md border transition-colors ${
                            checked
                              ? "border-[#04121a]/30 bg-[#04121a]/15"
                              : "border-line-strong"
                          }`}
                        >
                          {checked && (
                            <Check size={11} strokeWidth={3.5} className="check-pop" />
                          )}
                        </span>
                        <Icon size={13} className="flex-none" />
                        <span className="min-w-0 leading-snug">
                          {t(`dash.habit.${habit}` as TranslationKey)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </article>
  );
}
