import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // next/font supplies the runtime values via --font-sans / --font-mono
        sans: ["var(--font-sans)", "Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        // Terminal palette — direct hex so utilities like text-ink / bg-accent
        // resolve without HSL var indirection. CSS vars also exist in globals.
        ink:    "#0a0d0c",
        ink2:   "#0f1310",
        card:   "#141813",
        text:   "#dfe4dc",
        dim:    "#7d877a",
        dim2:   "#525a4e",
        accent: "#7dd99a",
        accent2:"#3fb070",
        warn:   "#e3c178",
        danger: "#e07a6a",
        // shadcn-ish HSL token contract kept intact for any legacy
        // components/utilities elsewhere in the project.
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":      { opacity: "0.55", transform: "scale(0.88)" },
        },
        "blink": {
          "0%, 49%":   { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "blink-soft": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.35" },
        },
        "edge-flow": {
          "0%":   { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-24" },
        },
        "log-in": {
          "from": { opacity: "0", transform: "translate3d(-6px, 0, 0)" },
          "to":   { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "fade-up": {
          "from": { opacity: "0", transform: "translate3d(0, 14px, 0)" },
          "to":   { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "boot-fill": {
          "0%":   { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "pulse-dot":  "pulse-dot 1.6s ease-in-out infinite",
        "pulse-slow": "pulse-dot 2.6s ease-in-out infinite",
        "blink":      "blink 1s steps(1, end) infinite",
        "blink-soft": "blink-soft 2.4s ease-in-out infinite",
        "edge-flow":  "edge-flow 1.6s linear infinite",
        "log-in":     "log-in 0.32s cubic-bezier(.22,1,.36,1) both",
        "fade-up":    "fade-up 0.55s cubic-bezier(.22,1,.36,1) both",
        "boot-fill":  "boot-fill 1.4s cubic-bezier(.22,1,.36,1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
