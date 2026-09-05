// Design tokens for the Control Panel palette. Matches CSS variables in globals.css.
// Import in components as: `import { T } from "@/lib/tokens"`.

export const T = {
  bg:       "#0f1113",
  panel:    "#171a1e",
  panel2:   "#1d2126",
  bevel:    "#2b3138",
  bevelHi:  "#3a424b",
  text:     "#e6e3dc",
  dim:      "#8a9099",
  dim2:     "#565c66",
  yellow:   "#ffd60a",
  green:    "#3ddc84",
  red:      "#ff4d3d",
  cond:     'var(--font-cond), "Barlow Condensed", "Arial Narrow", Impact, sans-serif',
  sans:     'var(--font-sans), "Barlow", "Helvetica Neue", Arial, sans-serif',
  mono:     'var(--font-mono), "IBM Plex Mono", "Courier New", ui-monospace, monospace',
} as const;

export type Tokens = typeof T;
