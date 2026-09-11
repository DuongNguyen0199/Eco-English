/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: '#000000',
          card: '#1c1c1e',
          cardHover: '#2c2c2e',
          text: '#ffffff',
          secondary: '#8e8e93',
          blue: '#0a84ff',
          purple: '#bf5af2',
          pink: '#ff375f',
          indigo: '#5e5ce6',
          green: '#30d158',
          orange: '#ff9f0a'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orb-glow': 'orbGlow 4s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        orbGlow: {
          '0%': { transform: 'scale(1) rotate(0deg)', filter: 'blur(20px) brightness(1)' },
          '50%': { transform: 'scale(1.15) rotate(180deg)', filter: 'blur(25px) brightness(1.3)' },
          '100%': { transform: 'scale(1) rotate(360deg)', filter: 'blur(20px) brightness(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wave: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '28px' },
        }
      }
    },
  },
  plugins: [],
}
