/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vigil: {
          dark: "#0B1120",
          card: "#0F172A",
          border: "#1E293B",
          accent: "#38BDF8",
          green: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
          purple: "#A855F7"
        }
      }
    },
  },
  plugins: [],
}
