/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        glitch: ["'Rubik Glitch'", "cursive"],
        roboto: ["'Roboto Serif'"]
      },
      dropShadow: {
        cyan: [
          "0 15px 15px #35C6DD",
          "0 15px 30px #35C6DD",
          "0 15px 45px #35C6DD",
        ],
      },
      textShadow: {
        cyan: `
    0 15px 20px rgba(53,198,221,0.6),
    0 15px 35px rgba(53,198,221,0.4),
    0 15px 50px rgba(53,198,221,0.25)
  `,
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const newUtilities = Object.entries(theme("textShadow")).map(([key, value]) => {
        return [`.text-shadow-${key}`, { textShadow: value }];
      });
      addUtilities(Object.fromEntries(newUtilities));
    },
  ],
};
