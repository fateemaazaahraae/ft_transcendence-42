/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        primary: "#35C6DD",
        secondary: "#F40CA4",
      },
      fontFamily: {
        glitch: ["'Rubik Glitch'", "cursive"],
        roboto: ["'Roboto Serif'", "serif"],
      },
      dropShadow: {
        cyan: ["0px 0px 10px #35C6DD"],
        cyann: ["0px 0px 12px #00DCFF"],
        pink: ["0px 0px 10px #F40CA4"],
        white: ["0 0 70px #FFFFFF"],
        blue: ["0 0 30px rgba(53,198,221,0.6)"],
        green: ["0 0 100px #00FFA8"],
        red: ["0 0 50px #C4393C"],
        purple: ["0 0 100px #710AFF"],
      },
      textShadow: {
        cyan: `
          0 12px 20px rgba(53,198,221,0.6),
          0 12px 35px rgba(53,198,221,0.4),
          0 12px 50px rgba(53,198,221,0.25)
        `,
        white: `
          0 12px 20px rgb(255,255,255),
          0 12px 35px rgba(255,255,255,0.4),
          0 12px 50px rgba(255,255,255,0.25)
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
    require('tailwind-scrollbar')({ nocompatible: true }),
    function ({ addBase }) {
      addBase({
        '::-webkit-scrollbar-button': {
          display: 'none',
        },
      });
    },
  ],
};
