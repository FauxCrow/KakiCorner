/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: 'calc(0.75rem * var(--font-scale, 1))',
        sm: 'calc(0.875rem * var(--font-scale, 1))',
        base: 'calc(1rem * var(--font-scale, 1))',
        lg: 'calc(1.125rem * var(--font-scale, 1))',
        xl: 'calc(1.25rem * var(--font-scale, 1))',
        '2xl': 'calc(1.5rem * var(--font-scale, 1))',
      },
    },
  },
  plugins: [],
}

