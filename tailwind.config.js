/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    colors: {
      purple: "#7e5bef",
      funpurple: "#8B66FF",
      funbrightpurple: "#80B2FF",
      funmidpurple: "#8788F8",
      funlightpurple: "rgba(139, 102, 255, 0.1)",
      lightgrey: "#737B7D",
      extralightgrey: "rgba(0, 0, 0, 0.1)",
    },
    fontFamily: {
      fontFamily: "Open Sans",
      sans: ["Open Sans", "sans-serif"],
    },
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "rgba(31,148,238,1)",
          "primary-content": "#FFFFFF",
          secondary: "#F000B8",
          accent: "#37CDBE",
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
          funpurple: "#8B66FF",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
