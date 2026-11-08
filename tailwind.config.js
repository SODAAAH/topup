export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCFB',
          100: '#F7F6F2',
          200: '#EFECE6',
          300: '#E5E1D8',
          400: '#D5D0C5',
          500: '#B8B2A5',
        },
        charcoal: {
          900: '#1C1C1C',
          800: '#292929',
          700: '#42403D',
          600: '#5C5853',
          500: '#74716D',
          400: '#98948D',
          300: '#BDB9B1',
          200: '#D8D5CD',
          100: '#E9E6E0',
          50: '#F4F2EC',
        },
        crimson: {
          DEFAULT: '#B52E45',
          hover: '#9E243A',
          deep: '#8E3146',
          subtle: '#FDF2F4',
          border: '#F8D2D9',
        },
        gold: {
          DEFAULT: '#BE9B57',
          deep: '#9D7E3F',
          subtle: '#FBF8F0',
          border: '#EFE2C6',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
