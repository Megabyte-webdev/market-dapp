/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns:{
        'auto': "repeat(auto-fill, minmax(300px, 1fr))",
        'responsive2': "repeat(auto-fill, minmax(250px, 1fr))",
        'responsive-sm': "repeat(auto-fill, minmax(200px, 1fr))"
      },
      width:{
        peak: "1400px",
      }
    },
  },
  plugins: [],
}

