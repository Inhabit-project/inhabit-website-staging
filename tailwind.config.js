/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        light: 'var(--color-light)',
        'green-soft': 'var(--color-green-soft)',
        background: 'var(--color-background)',
        accent: 'var(--color-accent)',
        text: 'var(--color-text)',
        orange: 'var(--color-orange)',
      },
      keyframes: {
        videoPulse: {
          '0%, 100%': {
            transform: 'scale(1)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 1)',
          },
          '50%': {
            transform: 'scale(1.1)',
            backgroundColor: 'rgba(255, 166, 0, 0.2)',
            borderColor: 'rgb(255, 166, 0)',
          },
        },
      },
      animation: {
        videoPulse: 'videoPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.5rem',
        },
        screens: {
          sm: '480px',
          md: '768px',
          lg: '992px',
          xl: '1440px',
          '2xl': '1920px',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        nunito: ['Nunito Sans', 'sans-serif'],
        'ibm-mono': ['IBM Plex Mono', 'monospace'],
        'ibm-sans': ['IBM Plex Sans Condensed', 'sans-serif'],
        prompt: ['Prompt', 'sans-serif'],
      },
      fontSize: {
        '4xl': 'var(--font-size-4xl)',
        '3xl': 'var(--font-size-3xl)',
        '2xl': 'var(--font-size-2xl)',
        'xl': 'var(--font-size-xl)',
        'lg': 'var(--font-size-lg)',
        'base': 'var(--font-size-base)',
        'sm': 'var(--font-size-sm)',
        'xs': 'var(--font-size-xs)',
        'body-L': 'var(--body-L)',
        'body-M': 'var(--body-M)',
        'body-S': 'var(--body-S)',
        'eyebrow': 'var(--eyebrow)',
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
      },
      backdropBlur: {
        '18.9': '18.9px',
      },
      borderRadius: {
        'xl': '1.25rem',     // 20px
        '2xl': '1.5rem',     // 24px
        '3xl': '1.75rem',    // 28px
        '4xl': '3.75rem',    // 60px
        'button': '4.0625rem', // 65px
        'input': '0.625rem',  // 10px
      },
      maxWidth: {
        container: '100rem', // 1600px
      },
    },
  },
  plugins: [],
} 