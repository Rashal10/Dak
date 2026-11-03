/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: '#e9d4a0', deep: '#dcc38a', soft: '#faf5ea' },
        ink: { DEFAULT: '#2a1d17', soft: '#5b4637', faded: '#806b58' },
        vermilion: { DEFAULT: '#c8402a', deep: '#a3311f' },
        oxblood: '#6e1f1c',
        saffron: '#e58a1f',
        marigold: '#f0b43c',
        peacock: { DEFAULT: '#0f6e6e', deep: '#0b5252' },
        emerald: '#1f6b47',
        indigo: { DEFAULT: '#26305e', deep: '#1a2046' },
        brass: '#a8874a',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        deva: ['"Tiro Devanagari Hindi"', '"Noto Serif Devanagari"', 'serif'],
      },
      boxShadow: {
        paper: '0 1px 1px rgba(60,35,20,.08), 0 6px 14px -6px rgba(60,35,20,.28)',
        lift: '0 2px 2px rgba(60,35,20,.08), 0 18px 30px -12px rgba(60,35,20,.4)',
      },
    },
  },
  plugins: [],
}
