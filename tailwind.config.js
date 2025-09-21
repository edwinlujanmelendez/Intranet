/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts,css,scss}",      // ? todos los templates y lógica
    "./src/styles.css",                   // ? tu hoja global
    "./src/app/**/*.{html,ts}"            // ? aseguramos todos los componentes en /app
  ],
  theme: {
    extend: {
      screens: {
        'xxl': '1400px',
      },
      fontSize: {
        'xss': '0.70rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      colors: {
        orange: {
          500: "#ff6719", // tu naranja personalizado
          600: "#e75b15", // un tono más oscuro para hover
        }
      }
    },
  },
  plugins: [],
}