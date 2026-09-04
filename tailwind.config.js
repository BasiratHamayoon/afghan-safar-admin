const plugin = require("tailwindcss/plugin");
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xxl: { min: "1900px" },
        xl: { max: "1420px" },
        smLg: { max: "1243px" },
        large: { max: "1290px" },
        tablet: { max: "1000px" },
        small: { max: "600px" },
        smaller: { max: "350px" },
      },
      colors: {
        "brand-2nd-clr": "#FF6F00",
        "brand-2nd-clr-50": "#FF6F0080",
        "brand-1st-clr": "#007BFF",
        "gray-1": "#333333",
        "gray-6": "#F2F2F2",
        "gray-5": "#E0E0E0",
        "gray-3": "#828282",
        "line-1": "#DDDDDD",
        "line-2": "#E0E0E0",
        "light-gray": "#F7F7F7",
        "primary-black": "#222222",
        "primary-gray": "#6A6A6A",
        disableClr: "#AAAAAA",
        "error-1": "#D72C0D",
        "success-1": "#008060",
      },
      fontFamily: {
        "air-font": "var(--air-font)",
        "play-font": "var(--play-font)",
      },
    },
  },

  plugins: [
    plugin(function ({ addUtilities, theme }) {
      addUtilities({
        ".flex-center": {
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
        },
      });
    }),
  ],
};
