/** HISTORIA design tokens */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#111315", 2: "#1B1D1F", 3: "#25282B", line: "#2E3134" },
        gold: { DEFAULT: "#C5A46D", soft: "#D8BF94", deep: "#9C7F4E" },
        ivory: { DEFAULT: "#F2EBDD", dim: "#CFC8BA" },
        mute: "#929292",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      letterSpacing: { caps: "0.22em" },
      borderRadius: { DEFAULT: "2px" },
      maxWidth: { page: "1320px" },
    },
  },
  plugins: [],
};
