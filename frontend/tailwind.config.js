/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Primary Brand Colors ───────────────────────────
        primary: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        // ─── Dark Theme Colors ───────────────────────────────
        dark: {
          100: "#1e1e2e",
          200: "#181825",
          300: "#11111b",
          400: "#313244",
          500: "#45475a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl:  "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.12)",
        glow: "0 0 20px rgba(34, 197, 94, 0.3)",
      },
      animation: {
        "fade-in":   "fadeIn 0.3s ease-in-out",
        "slide-in":  "slideIn 0.3s ease-in-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%":   { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)",     opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};