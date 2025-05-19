/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,tsx,ts,jsx}',
    './src/app/**/*.{js,tsx,ts,jsx}',
    './components/**/*.{js,tsx,ts,jsx}',
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#BAFD52",
        secondary: "#4686E3",
        grayWhite: "#E5E9FF",
        darkGray: "#17161B"
    },
    fontFamily: {
      GilroyRegular: ["Gilroy-Regular", "sans-serif"],
      GilroyMedium: ["Gilroy-Medium", "sans-serif"],
      GilroySemiBold: ["Gilroy-SemiBold", "sans-serif"],
      GilroyExtraBold: ["Gilroy-ExtraBold", "sans-serif"],
    },
    backdropBlur: {
      mdx: "12px",
    },
  },
  },
  plugins: [],
}