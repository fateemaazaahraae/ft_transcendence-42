/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        primary: "#35C6DD",
        secondary: "#D934B0",
        redRemove: "#D44444",
        greenAdd: "#76E998",
      },
      fontFamily: {
        glitch: ["'Rubik Glitch'", "cursive"],
        roboto: ["'Roboto Serif'", "serif"],
      },
       dropShadow: {
        cyan: "0 0 10px #35C6DD",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
