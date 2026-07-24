/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050607",
          900: "#0b0e10",
          800: "#111417",
          700: "#1a1f23",
        },
        sand: {
          50: "#fcf8f2",
          100: "#f4ece0",
          200: "#dccbb4",
        },
        brand: {
          100: "#f7dfb4",
          200: "#f1d3a0",
          300: "#d58e59",
        },
        moss: {
          400: "#6d8f84",
          500: "#335248",
        },
        mist: {
          300: "#d7e4f4",
          400: "#9eb7cf",
        },
      },
      fontFamily: {
        body: ["Franklin Gothic Regular", "Arial", "sans-serif"],
        display: ["Franklin Gothic Heavy Regular", "Arial Black", "sans-serif"],
      },
      boxShadow: {
        panel: "0 28px 100px rgba(0, 0, 0, 0.28)",
      },
      backgroundImage: {
        "shell-gradient":
          "radial-gradient(circle at top left, rgba(214,167,92,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(47,88,73,0.2), transparent 24%), linear-gradient(180deg, #0a0c0d 0%, #111416 40%, #0b0d0e 100%)",
      },
    },
  },
  plugins: [],
};
