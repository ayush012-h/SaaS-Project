/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0A0F',
          surface: '#0F0F1A',
          card: '#13131F',
          elevated: '#1A1A2E',
        },
        border: {
          DEFAULT: '#1E1E2E',
          light: '#2A2A3E',
        },
        text: {
          primary: '#E8E8F0',
          secondary: '#9999BB',
          muted: '#666680',
        },
        brand: {
          purple: '#6C63FF',
          teal: '#3ECFCF',
        },
        status: {
          warning: '#FFD700',
          savings: '#4CFF8F',
          danger: '#FF6363',
          info: '#63B3FF',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
        'card-gradient': 'linear-gradient(145deg, #13131F, #1A1A2E)',
        'purple-glow': 'radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0.15), transparent 70%)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(30,30,46,0.8)',
        'glow-purple': '0 0 20px rgba(108, 99, 255, 0.3)',
        'glow-teal': '0 0 20px rgba(62, 207, 207, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
