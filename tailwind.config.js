/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f7f7fb",
          100: "#eef0f8",
          200: "#d9e1f4",
          300: "#b2c6eb",
          400: "#7d9de2",
          500: "#4c73d9",
          600: "#3956b4",
          700: "#2d468c",
          800: "#243667",
          900: "#1f2d53"
        },
        accent: "#D5A02D",
        muted: "#E6E9F4"
      },
      boxShadow: {
        card: "0 10px 25px rgba(0, 0, 0, 0.12)"
      },
      borderRadius: {
        xl: "1rem"
      }
    }
  },
  plugins: []
};
