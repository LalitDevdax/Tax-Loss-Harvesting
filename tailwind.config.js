/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#3b82f6', // blue-500
          DEFAULT: '#1e40af', // blue-800
          dark: '#1e3a8a', // blue-900
          accent: '#2563eb', // blue-600
        },
        success: {
          DEFAULT: '#10b981', // emerald-500
          text: '#047857', // emerald-700
          bg: '#ecfdf5', // emerald-50
        },
        danger: {
          DEFAULT: '#ef4444', // red-500
          text: '#b91c1c', // red-700
          bg: '#fef2f2', // red-50
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
