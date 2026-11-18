import React from "react";

type P = { className?: string; style?: React.CSSProperties };

const base = (
  path: React.ReactNode,
  { className = "h-6 w-6", style }: P
) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden
  >
    {path}
  </svg>
);

/** The PRISM mark — a triangle splitting light into colour. */
export function PrismMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="prism-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent2)" />
        </linearGradient>
      </defs>
      <path d="M20 4 L37 34 L3 34 Z" fill="none" stroke="url(#prism-g)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M20 15 L28.5 31 L11.5 31 Z" fill="url(#prism-g)" opacity="0.9" />
      <line x1="2" y1="19" x2="15" y2="19" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export const IconPrism = (p: P) =>
  base(
    <>
      <path d="M12 3 L21 20 L3 20 Z" />
      <path d="M12 10 L16.5 18 L7.5 18 Z" fill="currentColor" stroke="none" opacity="0.85" />
    </>,
    p
  );

export const IconLayout = (p: P) =>
  base(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="9.5" x2="21" y2="9.5" />
      <line x1="6.2" y1="6.8" x2="6.21" y2="6.8" strokeWidth="2.6" />
      <line x1="9.4" y1="6.8" x2="9.41" y2="6.8" strokeWidth="2.6" />
      <rect x="6" y="13" width="5" height="4" rx="0.8" />
      <line x1="14" y1="13.5" x2="18" y2="13.5" />
      <line x1="14" y1="16.5" x2="18" y2="16.5" />
    </>,
    p
  );

export const IconBag = (p: P) =>
  base(
    <>
      <path d="M5.5 8 L4 20.5 L20 20.5 L18.5 8 Z" />
      <path d="M8.5 10.5 V6.5 a3.5 3.5 0 0 1 7 0 V10.5" />
    </>,
    p
  );

export const IconPlay = (p: P) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5 L16 12 L10 15.5 Z" fill="currentColor" stroke="none" />
    </>,
    p
  );

export const IconCompass = (p: P) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="15.5 8.5 13.4 13.4 8.5 15.5 10.6 10.6" />
    </>,
    p
  );

export const IconGrid = (p: P) =>
  base(
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="3.5" />
    </>,
    p
  );

export const IconCheck = (p: P) =>
  base(<polyline points="4.5 12.5 9.5 17.5 19.5 6.5" />, p);

export const IconArrowUpRight = (p: P) =>
  base(
    <>
      <line x1="6" y1="18" x2="18" y2="6" />
      <polyline points="8 6 18 6 18 16" />
    </>,
    p
  );

export const IconArrowRight = (p: P) =>
  base(
    <>
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="13 5 20 12 13 19" />
    </>,
    p
  );

export const IconPalette = (p: P) =>
  base(
    <>
      <path d="M12 3.5 a8.5 8.5 0 1 0 0 17 c1.4 0 2-.9 2-1.9 0-1.2-1-1.7-1-2.9 0-1.1.9-1.9 2.1-1.9 H17 a4.4 4.4 0 0 0 4.4-4.4 C21.4 6 17.2 3.5 12 3.5 Z" />
      <circle cx="7.6" cy="10.4" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.4" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="16.6" cy="10.2" r="1.15" fill="currentColor" stroke="none" />
    </>,
    p
  );

export const IconSparkle = (p: P) =>
  base(
    <path d="M12 3 L13.9 10.1 L21 12 L13.9 13.9 L12 21 L10.1 13.9 L3 12 L10.1 10.1 Z" />,
    p
  );

export const serviceIcons: Record<string, (p: P) => React.ReactNode> = {
  prism: IconPrism,
  layout: IconLayout,
  bag: IconBag,
  play: IconPlay,
  compass: IconCompass,
  grid: IconGrid,
};
