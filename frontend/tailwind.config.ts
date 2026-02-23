import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        dm: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        'bg-primary': '#0A0A0F',
        'bg-secondary': '#111118',
        'bg-tertiary': '#16161F',
        'accent-primary': '#7C3AED',
        'accent-bright': '#9B5CF6',
        'text-primary': '#F4F4F5',
        'text-muted': 'rgba(255, 255, 255, 0.45)',
        'border-color': 'rgba(255, 255, 255, 0.07)',
        'success': '#10B981',
        'destructive-custom': '#EF4444',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-violet': 'radial-gradient(900px circle at var(--mx) var(--my), rgba(124, 58, 237, 0.12) 0%, transparent 60%)',
        'gradient-violet-static': 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124, 58, 237, 0.18) 0%, transparent 70%)',
      },
      borderColor: {
        'white-7': 'rgba(255, 255, 255, 0.07)',
        'white-12': 'rgba(255, 255, 255, 0.12)',
        'white-20': 'rgba(255, 255, 255, 0.20)',
      },
      backdropBlur: {
        xl: '20px',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(124, 58, 237, 0.3)',
        'glow-sm': '0 0 20px rgba(124, 58, 237, 0.2)',
      },
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-inline-start))',
      },
    },
  },
  plugins: [
    plugin(function({ addBase }) {
      addBase({
        'body': {
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        }
      })
    })
  ],
} satisfies Config

export default config
