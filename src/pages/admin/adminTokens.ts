// src/pages/admin/adminTokens.ts
// ─────────────────────────────────────────────────────────────────────────────
// All admin page design tokens mapped to your existing CSS variables.
// These work in both light and dark mode automatically.
// ─────────────────────────────────────────────────────────────────────────────

export const C = {
  // ── Accent colors (your custom tokens) ────────────────────────────────────
  // Used for chart strokes, stat card values, badges
  blue: 'hsl(210 100% 55%)', // consistent accent, readable both modes
  teal: 'var(--cyan)', // your --cyan token
  green: 'var(--emerald)', // your --emerald token
  amber: 'var(--amber)', // your --amber token
  red: 'var(--rose)', // your --rose token
  violet: 'oklch(0.60 0.18 270)', // purple accent

  // ── Surfaces (mapped to your surface tokens) ───────────────────────────────
  card: 'color-mix(in oklch, var(--card) 85%, transparent)',
  cardBdr: 'var(--border)',
  surface: 'var(--surface-3)',
  grid: 'var(--surface-3)', // chart grid lines
  skl: 'var(--surface-3)', // skeleton bg

  // ── Text (mapped to your text tokens) ─────────────────────────────────────
  t1: 'var(--foreground)',
  t2: 'var(--muted-foreground)',
  t3: 'color-mix(in oklch, var(--muted-foreground) 60%, transparent)',

  // ── Chart axis ticks ───────────────────────────────────────────────────────
  axisTick: 'var(--muted-foreground)',

  // ── Chart tooltip ─────────────────────────────────────────────────────────
  ttBg: 'var(--card)',
  ttBdr: 'var(--border)',
  ttTxt: 'var(--card-foreground)',
} as const;

// Tooltip style object for recharts
export const TT = {
  backgroundColor: C.ttBg,
  border: `1px solid ${C.ttBdr}`,
  borderRadius: '10px',
  fontSize: '12px',
  color: C.ttTxt,
} as const;

// Metric card accent definitions
export type AccentKey = 'blue' | 'teal' | 'violet' | 'amber' | 'green';

export const ACCENTS: Record<
  AccentKey,
  { color: string; glow: string; ring: string }
> = {
  blue: {
    color: C.blue,
    glow: 'hsl(210 100% 55% / 0.10)',
    ring: 'hsl(210 100% 55% / 0.22)',
  },
  teal: {
    color: C.teal,
    glow: 'color-mix(in oklch, var(--cyan) 12%, transparent)',
    ring: 'color-mix(in oklch, var(--cyan) 25%, transparent)',
  },
  violet: {
    color: C.violet,
    glow: 'oklch(0.60 0.18 270 / 0.10)',
    ring: 'oklch(0.60 0.18 270 / 0.22)',
  },
  amber: {
    color: C.amber,
    glow: 'color-mix(in oklch, var(--amber) 12%, transparent)',
    ring: 'color-mix(in oklch, var(--amber) 25%, transparent)',
  },
  green: {
    color: C.green,
    glow: 'color-mix(in oklch, var(--emerald) 12%, transparent)',
    ring: 'color-mix(in oklch, var(--emerald) 25%, transparent)',
  },
};
