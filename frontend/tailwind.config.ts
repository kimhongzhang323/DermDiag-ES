import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f5f1ea",
        "bg-2": "#ebe5da",
        paper: "#fbf8f3",
        ink: "#1b1a17",
        "ink-2": "#3a3733",
        "ink-3": "#6b6660",
        line: "#cdc6bb",
        "line-2": "#ddd5c8",
        accent: "oklch(0.52 0.06 165)",
        "accent-2": "oklch(0.42 0.06 165)",
        "accent-soft": "oklch(0.94 0.025 165)",
        warn: "oklch(0.58 0.13 35)",
        "warn-soft": "oklch(0.94 0.04 40)",
        good: "oklch(0.55 0.10 145)",
      },
      fontFamily: {
        serif: ['"Newsreader"', '"Iowan Old Style"', "Georgia", "serif"],
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      maxWidth: { content: "1240px" },
    },
  },
  plugins: [],
} satisfies Config;
