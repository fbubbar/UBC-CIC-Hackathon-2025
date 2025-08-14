/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        oswald: ['var(--font-oswald)', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
        urbanist: ['var(--font-urbanist)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
