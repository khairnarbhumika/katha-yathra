/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vedic: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          900: '#78350f',
        },
        mythic: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          gold: '#facc15',
          flame: '#f97316',
          sky: '#38bdf8',
          magic: '#a855f7'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'bounce-soft': 'bounceSoft 2s infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' }
        }
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(250, 204, 21, 0.4)',
        'glow-flame': '0 0 25px -5px rgba(249, 115, 22, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.4)'
      }
    },
  },
  plugins: [],
}
