"use client";

/**
 * Screen-time analytics.
 *
 * Two Recharts views over the same seven days: a stacked area chart of the
 * Instagram / TikTok / YouTube split, and a before-vs-now comparison against
 * the visitor's own pre-StayFocus baseline. Charts render after mount so the
 * responsive container measures a real element.
 */

import { useEffect, useState } from "react";
import { Clock, TrendingDown } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useLang } from "@/components/i18n/LanguageProvider";
import {
  APP_COLORS,
  dayTotal,
  SCREEN_TIME,
  weeklyReductionRatio,
  weeklySavedHours,
  weeklyTotals,
} from "@/lib/focus-data";
import type { TranslationKey } from "@/lib/i18n";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function useChartData() {
  const { t } = useLang();
  return SCREEN_TIME.map((day) => ({
    day: t(day.dayKey),
    instagram: day.instagram,
    tiktok: day.tiktok,
    youtube: day.youtube,
    now: Number(dayTotal(day).toFixed(1)),
    baseline: day.baseline,
  }));
}

function ChartSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div
      className="animate-pulse rounded-2xl bg-surface-2/60"
      style={{ height }}
      aria-hidden="true"
    />
  );
}

const APPS = ["instagram", "tiktok", "youtube"] as const;

export function ScreenTimeDailyChart() {
  const { t } = useLang();
  const data = useChartData();
  const mounted = useMounted();
  const totals = weeklyTotals();

  return (
    <article className="card p-6 lg:col-span-2">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-eyebrow text-cyan">{t("dash.screen.eyebrow")}</span>
          <h2 className="text-card mt-2">{t("dash.screen.daily")}</h2>
          <p className="mt-1.5 max-w-[46ch] text-[13.5px] leading-relaxed text-ink-soft">
            {t("dash.screen.desc")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip !border-emerald/40 !bg-emerald/10 !text-emerald">
            <TrendingDown size={13} />
            {Math.round(weeklyReductionRatio() * 100)}% {t("dash.screen.trend")}
          </span>
        </div>
      </header>

      <div className="mt-6">
        {mounted ? (
          <ResponsiveContainer width="100%" height={272}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <defs>
                {APPS.map((app) => (
                  <linearGradient key={app} id={`sf-${app}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={APP_COLORS[app]} stopOpacity={0.7} />
                    <stop offset="100%" stopColor={APP_COLORS[app]} stopOpacity={0.06} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} dy={6} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                domain={[0, 6]}
                ticks={[0, 2, 4, 6]}
                tickFormatter={(value: number) => `${value}${t("dash.screen.hoursShort")}`}
              />
              <Tooltip
                cursor={{ stroke: "var(--line-strong)", strokeWidth: 1 }}
                formatter={(value, name) => [
                  `${value} ${t("dash.screen.hoursShort")}`,
                  t(`dash.app.${String(name)}` as TranslationKey),
                ]}
              />
              {APPS.map((app) => (
                <Area
                  key={app}
                  type="monotone"
                  dataKey={app}
                  stackId="1"
                  stroke={APP_COLORS[app]}
                  strokeWidth={2}
                  fill={`url(#sf-${app})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ChartSkeleton height={272} />
        )}
      </div>

      <ul className="mt-5 flex flex-wrap gap-2.5">
        {APPS.map((app) => (
          <li key={app} className="chip">
            <span
              className="inline-block h-2.5 w-2.5 flex-none rounded-full"
              style={{ background: APP_COLORS[app] }}
              aria-hidden="true"
            />
            {t(`dash.app.${app}` as TranslationKey)}
            <strong className="text-ink">
              {totals[app].toFixed(1)} {t("dash.screen.hoursShort")}
            </strong>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ScreenTimeCompare() {
  const { t } = useLang();
  const data = useChartData();
  const mounted = useMounted();
  const saved = weeklySavedHours();

  return (
    <article className="card flex flex-col p-6">
      <span className="text-eyebrow text-ink-mute">
        {t("dash.screen.compare")}
      </span>

      <div className="mt-4 rounded-2xl border border-line bg-gradient-to-br from-emerald/12 to-transparent p-4">
        <span className="flex items-center gap-2 text-[12.5px] font-semibold text-ink-soft">
          <Clock size={14} className="text-emerald" />
          {t("dash.screen.saved")}
        </span>
        <p className="font-display mt-2 text-[38px] font-extrabold leading-none">
          <span className="text-grad">{saved.toFixed(1)}</span>
          <span className="ml-1.5 text-[20px] text-ink-soft">
            {t("dash.screen.hoursShort")}
          </span>
        </p>
      </div>

      <div className="mt-5 flex-1">
        {mounted ? (
          <ResponsiveContainer width="100%" height={188}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: -6, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 6" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} dy={6} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={46}
                domain={[0, 6]}
                ticks={[0, 3, 6]}
                tickFormatter={(value: number) => `${value}${t("dash.screen.hoursShort")}`}
              />
              <Tooltip
                cursor={{ fill: "var(--surface-2)" }}
                formatter={(value, name) => [
                  `${value} ${t("dash.screen.hoursShort")}`,
                  String(name) === "baseline"
                    ? t("dash.screen.before")
                    : t("dash.screen.now"),
                ]}
              />
              <Bar
                dataKey="baseline"
                fill="var(--line-strong)"
                radius={[6, 6, 0, 0]}
                maxBarSize={14}
              />
              <Bar dataKey="now" fill="url(#sf-now)" radius={[6, 6, 0, 0]} maxBarSize={14}>
                <defs>
                  <linearGradient id="sf-now" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ChartSkeleton height={188} />
        )}
      </div>

      <ul className="mt-4 flex flex-wrap gap-2.5">
        <li className="chip">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-line-strong" />
          {t("dash.screen.before")}
        </li>
        <li className="chip">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan" />
          {t("dash.screen.now")}
        </li>
      </ul>
    </article>
  );
}
