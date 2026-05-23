// Design tokens for the Terminal palette. Matches CSS variables in globals.css.
// Import in components as: `import { T } from "@/lib/tokens"`.

export const T = {
  ink:     "#0a0d0c",
  ink2:    "#0f1310",
  card:    "#141813",
  line:    "rgba(155,220,170,0.10)",
  line2:   "rgba(155,220,170,0.22)",
  text:    "#dfe4dc",
  dim:     "#7d877a",
  dim2:    "#525a4e",
  accent:  "#7dd99a",
  accent2: "#3fb070",
  warn:    "#e3c178",
  danger:  "#e07a6a",
  mono:    'var(--font-mono), "JetBrains Mono", ui-monospace, monospace',
  sans:    'var(--font-sans), "Space Grotesk", ui-sans-serif, system-ui, sans-serif',
} as const;

export type Tokens = typeof T;
