/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"]
      },
    },
    /* Override default Tailwind colors to use CSS variables for full app theme control */
    colors: {
      /* Sky colors now map to secondary accent (was sky-blue, now cyan) - change --theme-secondary-accent in index.css */
      sky: {
        50: 'var(--secondary-50)',
        100: 'var(--secondary-100)',
        200: 'var(--secondary-200)',
        300: 'var(--secondary-300)',
        400: 'var(--secondary-400)',
        500: 'var(--secondary-500)',
        600: 'var(--secondary-600)',
        700: 'var(--secondary-700)',
        800: 'var(--secondary-800)',
        900: 'var(--secondary-900)',
      },
      /* Amber colors map to primary accent - change --theme-primary-accent in index.css */
      amber: {
        50: 'var(--primary-50)',
        100: 'var(--primary-100)',
        200: 'var(--primary-200)',
        300: 'var(--primary-300)',
        400: 'var(--primary-400)',
        500: 'var(--primary-500)',
        600: 'var(--primary-600)',
        700: 'var(--primary-700)',
        800: 'var(--primary-800)',
        900: 'var(--primary-900)',
      },
      /* Slate colors for neutral elements */
      slate: {
        50: 'var(--base-50)',
        100: 'var(--base-100)',
        200: 'var(--base-200)',
        300: 'var(--base-300)',
        400: 'var(--base-400)',
        500: 'var(--base-500)',
        600: 'var(--base-600)',
        700: 'var(--base-700)',
        800: 'var(--base-800)',
        900: 'var(--base-900)',
      },
    }
  },
  plugins: []
};