/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    'formkit.theme.ts',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f7f5fa",
          100: "#dacee7",
          200: "#bda7d3",
          300: "#a081c0",
          400: "#835aac",
          500: "#663399",
          600: "#572b82",
          700: "#47246b",
          800: "#381c54",
          900: "#29143d",
          950: "#1a0d26",
          DEFAULT: '#663399',
        },
      },
    },
  },
  plugins: [],
}

