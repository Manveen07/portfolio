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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Mission Control palette
        'mc': {
          cyan: '#00e5ff',
          'cyan-dim': '#006d7a',
          amber: '#ffb800',
          surface: '#0d1220',
          deep: '#080c16',
        }
      },
      animation: {
        "float": "float-gentle 6s ease-in-out infinite",
        "float-slow": "float-gentle 10s ease-in-out infinite",
        "mesh-1": "mesh-drift-1 25s ease-in-out infinite",
        "mesh-2": "mesh-drift-2 30s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "data-flow": "data-flow 1s linear infinite",
        "aurora": "aurora-shift 22s ease-in-out infinite",
        "aurora-r": "aurora-shift 18s ease-in-out infinite reverse",
        "aurora-slow": "aurora-shift 32s ease-in-out infinite 6s",
        "aurora-slow-r": "aurora-shift 28s ease-in-out infinite 3s reverse",
        "aurora-xs": "aurora-shift 16s ease-in-out infinite 2s",
        "shimmer": "shimmer-sweep 3s ease-in-out infinite",
        "levitate": "levitate 8s ease-in-out infinite",
        "border-glow": "border-glow-rotate 4s ease-in-out infinite",
      },
      keyframes: {
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "mesh-drift-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -30px) scale(1.06)" },
          "66%": { transform: "translate(-25px, 15px) scale(0.94)" },
        },
        "mesh-drift-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-35px, 25px) scale(1.04)" },
          "66%": { transform: "translate(20px, -20px) scale(0.96)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 6px #00e5ff" },
          "50%": { boxShadow: "0 0 12px #00e5ff, 0 0 4px #00e5ff" },
        },
        "data-flow": {
          "0%": { strokeDashoffset: "20" },
          "100%": { strokeDashoffset: "0" },
        },
        "aurora-shift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.7" },
          "20%": { transform: "translate(30px, -40px) scale(1.09)", opacity: "0.9" },
          "50%": { transform: "translate(-22px, 20px) scale(0.91)", opacity: "0.6" },
          "75%": { transform: "translate(38px, 10px) scale(1.05)", opacity: "0.85" },
        },
        "shimmer-sweep": {
          "0%": { left: "-120%" },
          "100%": { left: "160%" },
        },
        "levitate": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-14px) rotate(1.5deg)" },
          "66%": { transform: "translateY(-7px) rotate(-0.8deg)" },
        },
        "border-glow-rotate": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0, 229, 255, 0.2), 0 0 20px rgba(0, 229, 255, 0.06)" },
          "50%": { boxShadow: "0 0 14px rgba(124, 58, 237, 0.25), 0 0 30px rgba(124, 58, 237, 0.08)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;