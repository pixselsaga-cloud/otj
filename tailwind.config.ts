import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#050607",
          secondary: "#080A0B",
          tertiary: "#0D1112",
          card: "rgba(13, 17, 18, 0.7)",
        },
        lime: {
          accent: "#A3E635",
          glow: "#BEF264",
          dark: "#65A30D",
          muted: "rgba(163, 230, 53, 0.12)",
        },
        surface: {
          border: "rgba(255, 255, 255, 0.08)",
          "border-hover": "rgba(163, 230, 53, 0.3)",
          glass: "rgba(255, 255, 255, 0.03)",
          "glass-hover": "rgba(255, 255, 255, 0.06)",
        },
        foreground: {
          DEFAULT: "#F5F7F2",
          secondary: "#9CA3AF",
          muted: "#6B7280",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        display: ["'Space Grotesk'", "'Inter'", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glow-lime": "radial-gradient(circle at center, rgba(163, 230, 53, 0.15) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
