const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,ts,jsx,js}"],
  theme: {
    fontSize: {
      xxs: "0.625rem",
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      xxl: "2rem",
    },
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#ffffff",
        black: "#000000",
        label: "#999999",
        hover: "#e9e9e9",
        point: "#D6061C",
        "point-sub": "#c42b29",
        footer: "#2c2c2c",
        warning: "#fb9600",
        line: "#999999",
        primary: "#1a1a1a",
        "dark-medium": "#4f4f4f",
      },
      boxShadow: {
        button: "0px 6.6px 6.6px 0px rgba(0, 0, 0, 0.25)",
        dropdown: "0px 4px 24px 0px rgba(0, 0, 0, 0.50)",
      },
      minWidth: {
        button: "8.875rem",
      },
    },
    fontFamily: {
      pretendard: ["Pretendard", "sans-serif"],
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const hideScrollbar = {
        ".scrollbar-hide": {
          "scrollbar-width": "none",
          "-ms-overflow-style": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      }
      addUtilities(hideScrollbar)
    }),
    plugin(function ({ addUtilities }) {
      const absoluteCenter = {
        ".absolute-center": {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
      }
      addUtilities(absoluteCenter)
    }),
  ],
}
