import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";

import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { ThemeProvider, THEME_STORAGE_KEY } from "@/components/theme/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "StayFocus — защита от думскроллинга и цифровой зависимости",
    template: "%s · StayFocus",
  },
  description:
    "StayFocus — мотивационный хаб против думскроллинга: стрик побед, аналитика экранного времени, трекер привычек, режим спасения и расширение, скрывающее Reels и Shorts.",
  keywords: [
    "думскроллинг",
    "цифровая зависимость",
    "фокус",
    "экранное время",
    "Reels",
    "Shorts",
    "трекер привычек",
    "doomscrolling",
    "screen time",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "StayFocus",
    title: "StayFocus — твоё время твой главный ресурс",
    description:
      "Останови бесконечный скроллинг: стрик побед, аналитика экранного времени, режим спасения и планнер реальных дел.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "StayFocus — мотивационный хаб против думскроллинга",
    description:
      "Стрик без Reels, аналитика экранного времени и режим спасения на 10 секунд дыхания.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05091a" },
    { media: "(prefers-color-scheme: light)", color: "#eef5ff" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * Applies the saved theme before first paint so the indigo canvas never
 * flashes light. Dark is the default for first-time visitors.
 */
const themeScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var d=s?s==="dark":true;document.documentElement.classList.toggle("dark",d);}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${manrope.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="page-canvas flex min-h-full flex-col">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
              >
                Перейти к содержанию
              </a>
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
