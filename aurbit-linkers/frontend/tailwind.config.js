/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EEF1F8',
          100: '#D6DEEE',
          200: '#A9BBDC',
          300: '#7C97C9',
          400: '#4F73B6',
          500: '#2C4F8E',
          600: '#16356B',
          700: '#0F2A5C',
          800: '#0A1A3C',
          900: '#07122B',
        },
        gold: {
          50: '#FBF6EC',
          100: '#F4E8CC',
          200: '#E9D09C',
          300: '#DDB86C',
          400: '#D2A24B',
          500: '#C9974A',
          600: '#B07F35',
          700: '#8E632A',
          800: '#6B4A20',
          900: '#4A3316',
        },
        ink: '#1C1C1C',
        slate: {
          muted: '#5B6472',
        },
        cream: '#F7F5F0',
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(10, 26, 60, 0.12)',
        gold: '0 8px 30px -8px rgba(201, 151, 74, 0.45)',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #0A1A3C 0%, #16356B 60%, #0F2A5C 100%)',
      },
    },
  },
  plugins: [],
}
