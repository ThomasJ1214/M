/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'm-black': '#000000',
        'm-white': '#F5F5F0',
        'm-blue': '#1C69D4',
        'm-purple': '#6B2D8B',
        'm-red': '#C1001F',
        'm-gray': {
          900: '#0D0D0D',
          700: '#1A1A1A',
          400: '#666666',
        },
      },
      fontFamily: {
        display: ['Barlow Condensed', 'Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      fontSize: {
        hero: 'clamp(80px, 15vw, 200px)',
        section: 'clamp(40px, 6vw, 96px)',
        subhead: 'clamp(24px, 3vw, 40px)',
      },
      backgroundImage: {
        'm-stripe': 'linear-gradient(90deg, #1C69D4, #6B2D8B, #C1001F)',
        'm-chrome': 'linear-gradient(135deg, #C0C0C0, #808080, #C0C0C0)',
      },
      animation: {
        'cursor-pulse': 'cursorPulse 1.5s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'grain': 'grain 8s steps(10) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        cursorPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      transitionTimingFunction: {
        'm': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'launch': 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
        'brake': 'cubic-bezier(0.4, 0.0, 0.0, 1.0)',
      },
      backdropBlur: {
        'nav': '20px',
      },
    },
  },
  plugins: [],
}
