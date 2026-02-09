import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        serif: ['"EB Garamond"', "Georgia", '"Times New Roman"', "serif"],
        heading: ['"EB Garamond"', "Georgia", "serif"],
      },
      colors: {
        accent: {
          DEFAULT: "#df4a2c",
          hover: "#c43d22",
        },
        primary: "#138496",
        muted: "#999999",
        secondary: "#555555",
        border: "#e1e1ff",
        "border-light": "#eceff8",
        "bg-secondary": "#f4f5f9",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08)",
        dropdown: "0 10px 40px rgba(0,0,0,0.1)",
        glass: "0 18px 60px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "5px",
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "1.4" }],
        xs: ["12px", { lineHeight: "1.5" }],
        sm: ["14px", { lineHeight: "1.6" }],
        base: ["15px", { lineHeight: "1.7" }],
        lg: ["18px", { lineHeight: "1.5" }],
        xl: ["20px", { lineHeight: "1.4" }],
        "2xl": ["24px", { lineHeight: "1.3" }],
        "3xl": ["30px", { lineHeight: "1.2" }],
        "4xl": ["36px", { lineHeight: "1.15" }],
        "5xl": ["48px", { lineHeight: "1.1" }],
      },
    },
  },
  plugins: [typography],
} satisfies Config;
