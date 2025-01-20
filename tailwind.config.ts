import { nextui } from "@nextui-org/react";

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: { GowunBatang: ["gowunBatang"] },
  },
  darkMode: "class",
  plugins: [nextui()],
};
