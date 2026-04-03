/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        forest: {
          50: "#f0faf2",
          100: "#d6f0db",
          200: "#a8d8ae",
          300: "#7eda5a",
          400: "#4db847",
          500: "#2d7a3a",
          600: "#1a5c2e",
          700: "#0d3319",
          800: "#0a2212",
          900: "#061609",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out both",
        "slide-up": "slideUp 0.4s ease-out both",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
