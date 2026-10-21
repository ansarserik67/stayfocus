import type { Metadata } from "next";

import { DashboardApp } from "@/components/dashboard/DashboardApp";

export const metadata: Metadata = {
  title: "Личный кабинет",
  description:
    "Стрик побед, аналитика экранного времени, трекер привычек и режим спасения StayFocus.",
};

export default function DashboardPage() {
  return <DashboardApp />;
}
