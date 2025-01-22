import { heroui } from "@heroui/react";

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    color: {
      primary: {
        DEFAULT: "#2D2D2A",
        100: "#F4F4F1",
        200: "#E9E9E3",
        300: "#BFBFB8",
        400: "#81817A",
        500: "#2D2D2A",
        600: "#202015",
        700: "#1A1A0D",
      },
    },
    extend: {},
    fontFamily: { GowunBatang: ["gowunBatang"] },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#FFF8E7",
            primary: {
              DEFAULT: "#2D2D2A",
              100: "#F4F4F1",
              200: "#E9E9E3",
              300: "#BFBFB8",
              400: "#81817A",
              500: "#2D2D2A",
              600: "#202015",
              700: "#1A1A0D",
            },
            secondary: {
              DEFAULT: "#2B2118",
              100: "#F4EDDE",
              200: "#E9DAC0",
              300: "#7F6B55",
              400: "#7F6B55",
              500: "#2B2118",
              600: "#1E130C",
              700: "#180D07",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#F4F4F1",
              100: "#F4F4F1",
              200: "#E9E9E3",
              300: "#BFBFB8",
              400: "#81817A",
              500: "#2D2D2A",
              600: "#202015",
              700: "#1A1A0D",
            },
            secondary: {
              DEFAULT: "#E9DAC0",
              100: "#F4EDDE",
              200: "#E9DAC0",
              300: "#7F6B55",
              400: "#7F6B55",
              500: "#2B2118",
              600: "#1E130C",
              700: "#180D07",
            },
          },
        },
      },
    }),
  ],
};
