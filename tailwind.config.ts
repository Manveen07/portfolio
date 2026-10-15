import type { Config } from "tailwindcss";

// Only Tailwind's base reset is used. The site's own styles are in app/globals.css.
const config: Config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};

export default config;
