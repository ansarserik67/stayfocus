import Image from "next/image";
import Link from "next/link";

/**
 * StayFocus brand mark.
 *
 * The mark is the approved logo asset: a rounded-square icon with a glowing
 * mountain path and a hexagon peak — the long climb of attention won back, lit
 * at the top. It ships as a 320 px WebP with a transparent rounded square
 * (public/brand/stayfocus-icon.webp, 13 KB, served ~70 px wide by next/image),
 * so it sits cleanly on both the dark indigo canvas and the light blue one.
 * The same artwork is the favicon (app/icon.png).
 */

interface LogoMarkProps {
  size?: number;
  className?: string;
  /** Preload the asset — use it for the mark that sits above the fold. */
  priority?: boolean;
}

export function LogoMark({
  size = 34,
  className = "",
  priority = false,
}: LogoMarkProps) {
  return (
    <Image
      src="/brand/stayfocus-icon.webp"
      alt=""
      width={size}
      height={size}
      priority={priority}
      sizes={`${size}px`}
      className={`flex-none select-none ${className}`}
    />
  );
}

interface LogoProps {
  /** "light" = light wordmark for dark surfaces, "dark" = ink wordmark. */
  variant?: "light" | "dark";
  iconOnly?: boolean;
  className?: string;
  linkHome?: boolean;
}

export function Logo({
  variant = "dark",
  iconOnly = false,
  className = "",
  linkHome = true,
}: LogoProps) {
  const mark = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark
        size={36}
        priority
        className="drop-shadow-[0_6px_16px_var(--glow-cyan)]"
      />
      {!iconOnly && (
        <span
          className={`font-display text-[21px] font-extrabold tracking-[-0.03em] ${
            variant === "light" ? "text-white" : "text-ink"
          }`}
        >
          Stay
          <span className="text-grad">Focus</span>
        </span>
      )}
    </span>
  );

  if (!linkHome) return mark;

  return (
    <Link
      href="/"
      aria-label="StayFocus — главная"
      className="inline-flex items-center rounded-xl transition-opacity duration-200 hover:opacity-85"
    >
      {mark}
    </Link>
  );
}
