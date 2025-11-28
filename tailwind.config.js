/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./types/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html",
    "./index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "SimSun", "宋体", "serif"],
        mono: ["Fira Code", "Monaco", "Consolas", "monospace"]
      },
      colors: {
        // Vant主题色兼容
        'van-primary': '#8B4513',
        'van-success': '#8FBC8F',
        'van-warning': '#DAA520',
        'van-danger': '#DC143C',
        'van-info': '#4682B4'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      }
    }
  },
  plugins: [],
  darkMode: 'class'
};
