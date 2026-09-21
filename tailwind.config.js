/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#fffdf8",
          900: "#f8f1e6",
          800: "#efe3d2",
          700: "#e2d2bc",
        },
        sand: {
          50: "#1d2a3d",
          100: "#516178",
          200: "#93a0b2",
        },
        brand: {
          100: "#c98a35",
          200: "#deb071",
          300: "#f2d3a2",
        },
        moss: {
          400: "#8bb7b1",
          500: "#4d8e87",
        },
        mist: {
          300: "#dde8f4",
          400: "#b2c3d9",
        },
      },
      fontFamily: {
        body: ["Manrope", "Arial", "sans-serif"],
        display: ["Sora", "Arial", "sans-serif"],
      },
      boxShadow: {
        panel: "0 24px 70px rgba(28, 36, 52, 0.12)",
        glow: "0 16px 40px rgba(201, 138, 53, 0.18)",
      },
      backgroundImage: {
        "shell-gradient":
          "radial-gradient(circle at 10% 10%, rgba(242,211,162,0.48), transparent 28%), radial-gradient(circle at 88% 12%, rgba(141,183,177,0.26), transparent 24%), radial-gradient(circle at 50% 100%, rgba(221,232,244,0.3), transparent 36%), linear-gradient(180deg, #fffdf8 0%, #fbf5ec 44%, #f4ecde 100%)",
      },
    },
  },
  plugins: [],
};
