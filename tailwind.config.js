/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        glitch: ["'Rubik Glitch'", "cursive"],
      },
       dropShadow: {
        cyan: "0 0 10px #35C6DD", // custom drop shadow
      },
    },
  },
  plugins: [],
};
