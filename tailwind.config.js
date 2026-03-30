/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
        },
        border: {
          DEFAULT: 'var(--border-subtle)',
          light: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        brand: {
          purple: 'var(--brand-purple)',
          teal: 'var(--brand-teal)',
        },
        status: {
          warning: 'var(--warning)',
          savings: 'var(--success)',
          danger: 'var(--danger)',
          info: 'var(--brand-teal)',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'var(--brand-gradient)',
        'card-gradient': 'linear-gradient(145deg, var(--bg-card), var(--bg-elevated))',
        'purple-glow': 'radial-gradient(circle at 50% 50%, var(--brand-purple), transparent 70%)',
      },
      boxShadow: {
        'card': 'var(--shadow-md)',
        'glow-purple': '0 0 20px var(--brand-purple)',
        'glow-teal': '0 0 20px var(--brand-teal)',
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
