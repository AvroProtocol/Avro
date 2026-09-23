/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ffffff",
          coral: "#ffffff",
          hover: "#e5e5e5",
          dark: "#050505",
          surface: "#0d0d0d",
          border: "rgba(255, 255, 255, 0.11)",
        },
      },
      boxShadow: {
        "avro": "0 26px 70px rgba(0,0,0,.42)",
      },
    },
  },
  plugins: [],
}
