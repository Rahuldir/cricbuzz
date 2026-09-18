/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        pitch: {
          dark: "#05160E",
          card: "#0D281C",
          surface: "#143D2B",
          border: "#1E583E",
          accent: "#10B981",
          gold: "#F59E0B",
          goldLight: "#FDE68A",
          red: "#EF4444",
          blue: "#3B82F6",
          purple: "#8B5CF6",
        },
      },
    },
  },
  plugins: [],
};
