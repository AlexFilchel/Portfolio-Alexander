/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 20px 60px rgba(15, 23, 42, 0.18)',
        window: '0 22px 55px rgba(15, 23, 42, 0.22)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'window-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(22px) scale(0.96)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'window-in': 'window-in 220ms ease-out',
        float: 'float 8s ease-in-out infinite',
      },
      colors: {
        windows: {
          sky: '#d7ebff',
          blue: '#7ab7ff',
          accent: '#1f7cff',
          panel: 'rgba(255,255,255,0.72)',
          border: 'rgba(255,255,255,0.42)',
        },
      },
    },
  },
  plugins: [],
};
