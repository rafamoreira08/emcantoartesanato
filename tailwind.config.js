/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:   '#FAFAF8',
        green:   { DEFAULT: '#4A7A3C', light: '#6FAE5F', dark: '#355C2B' },
        sand:    '#8B7355',
        ink:     '#1A1A1A',
        muted:   '#6B6B6B',
        border:  '#E8E4DF',
      },
      fontFamily: {
        serif:  ['"Playfair Display"', 'Georgia', 'serif'],
        sans:   ['"Jost"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
}
