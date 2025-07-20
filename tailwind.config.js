/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        "primary-dark": "#003B46",
        primary: "#07575B",
        "primary-hover": "#054649",
        secondary: "#61A4AD",
        "secondary-light": "#C0DEE5",
        "secondary-hover": "#5397a0",
        success:"#4CAF50",
        error: "#E53935",
        alert: "#FFA500",
        "text-primary": "#003B46",
        "text-inverse": "#FFFFFF",
      },
      fontFamily:{
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        h1: ["24px", { lineHeight: "32px", fontWeight: "700" }],
        h2: ["18px", { lineHeight: "28px", fontWeight: "600" }],
        base: ["14px", { lineHeight: "22px" }],
        caption: ["12px", { lineHeight: "18px" }],
      },
      borderRadius: { //rounded
        lg: "8px",
        xl: "12px",
        full: "9999px",
      },
      spacing: {
        4: "1rem",
        6: "1.5rem",
        2: "0.5rem",
      }
    },
  },
  plugins: [],
};