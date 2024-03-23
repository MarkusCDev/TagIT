/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans"],
      redHatText: ["Red Hat Text", "sans"],
    },
    extend: {
      colors: {
        // Using modern `rgb`, custom colors, docs: https://tailwindcss.com/docs/customizing-colors#using-css-variables
        primary: 'rgb(var(--primary-color) / <alpha-value>)',
        secondary: 'rgb(var(--secondary-color) / <alpha-value>)',
        action: 'rgb(var(--action-color) / <alpha-value>)',
      }
    },
  },
  plugins: [],
};

