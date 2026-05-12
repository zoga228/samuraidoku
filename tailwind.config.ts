import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#F7F0E6",
          100: "#F3EBDD",
          200: "#E6DCCB",
          300: "#D8CCBA"
        },
        ink: {
          900: "#24231F",
          800: "#33312C",
          700: "#46433B"
        },
        sakura: {
          200: "#E8B7B7",
          300: "#DFA6A6",
          500: "#B76569"
        },
        steel: {
          100: "#D6D2C8",
          200: "#B8B8B0",
          500: "#777B7C"
        },
        error: "#9E2A2B",
        success: "#6B8F71"
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        ink: "0 20px 60px rgba(36, 35, 31, 0.16)",
        glow: "0 0 0 4px rgba(223, 166, 166, 0.32)"
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-3px)" },
          "80%": { transform: "translateX(3px)" }
        },
        floatDown: {
          "0%": { transform: "translate3d(0,-12vh,0) rotate(0deg)", opacity: "0" },
          "12%": { opacity: "0.55" },
          "100%": { transform: "translate3d(var(--petal-drift),110vh,0) rotate(300deg)", opacity: "0" }
        }
      },
      animation: {
        shake: "shake 0.34s ease-in-out",
        floatDown: "floatDown var(--petal-duration) linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
