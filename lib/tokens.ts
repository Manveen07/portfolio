// Red pen on paper. Matches the CSS variables in app/globals.css.
// Import in components as: `import { T } from "@/lib/tokens"`.

export const T = {
  paper: "#f4f1ea",
  wash:  "#ebe6da",
  ink:   "#1d1d1d",
  dim:   "#5a5750",
  rule:  "#d9d3c5",
  red:   "#c4161c",
  sans:  'var(--font-sans), Archivo, "Helvetica Neue", Arial, sans-serif',
  mono:  'var(--font-mono), "IBM Plex Mono", "Courier New", ui-monospace, monospace',
} as const;

export type Tokens = typeof T;
