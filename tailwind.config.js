/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'translate-y-0',
    '-translate-y-full',
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
            transform: 'scale3d(1, 1, 1)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 1)',
          },
          '50%': {
            transform: 'scale3d(1.1, 1.1, 1)',
            backgroundColor: 'rgba(255, 166, 0, 0.2)',
            borderColor: 'rgb(255, 166, 0)',
          },
        },
        dropIn: {
          '0%': {
            transform: 'translate3d(0, -100%, 0)',
            opacity: '0'
          },
          '100%': {
            transform: 'translate3d(0, 0, 0)',
            opacity: '1'
          }
        },
        scroll: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(calc(-25%), 0, 0)' }
        },
        loaderPulse: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale3d(1, 1, 1)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale3d(0.98, 0.98, 1)',
          },
        },
        loaderPulseMobile: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale3d(1, 1, 1)',
          },
          '50%': {
            opacity: '0.9',
            transform: 'scale3d(0.99, 0.99, 1)',
          },
        },
        loaderRotate: {
          '0%': {
            transform: 'rotate3d(0, 0, 1, 0deg)',
          },
          '100%': {
            transform: 'rotate3d(0, 0, 1, 360deg)',
          },
        },
        loaderRotateMobile: {
          '0%': {
            transform: 'rotate3d(0, 0, 1, 0deg)',
          },
          '100%': {
            transform: 'rotate3d(0, 0, 1, 180deg)',
          },
        },
        loaderFadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translate3d(0, 20px, 0)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
        }
      },
      animation: {
        videoPulse: 'videoPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        scroll: 'scroll 50s linear infinite',
        loaderPulse: 'loaderPulse 2s ease-in-out infinite',
        loaderPulseMobile: 'loaderPulseMobile 3s ease-in-out infinite',
        loaderRotate: 'loaderRotate 20s linear infinite',
        loaderRotateMobile: 'loaderRotateMobile 30s linear infinite',
        loaderFadeIn: 'loaderFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        dropIn: 'dropIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
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
        montserrat: ['Montserrat', 'Montserrat Fallback', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        nunito: ['Nunito Sans', 'Nunito Sans Fallback', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        abel: ['Abel', 'Abel Fallback', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        'abel': '0.08rem',
        'tight': '-0.04em',
        'normal': '0',
        'wide': '0.02em',
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
        '6xl': '77rem',
        container: '100rem', // 1600px
      },
    },
  },
  plugins: [],
}; 