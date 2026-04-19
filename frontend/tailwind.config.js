/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-light": "#EEE3FF", // Lavanda suave
        "brand-primary": "#8054C7", // Morado principal
        "brand-dark": "#5A3696", // Morado profundo
        "brand-success": "#63D838", // Verde vibrante (perfecto para botones de acción)
      },
      fontFamily: {
        greycliff: ["GreycliffCF", "sans-serif"],
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};
