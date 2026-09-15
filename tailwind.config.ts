import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink:    { DEFAULT: '#17160F', 2: '#3B372B', 3: '#4C4739' },
        paper:  '#F4F1EA',
        rule:   { DEFAULT: '#E0DACB', 2: '#EFEAE0', 3: '#C9C2B8', dark: '#33302A' },
        muted:  { DEFAULT: '#8C8677', 2: '#6E6858', 3: '#B4AE9E' },
        orange: { DEFAULT: '#E2670B', deep: '#A0512A' },
        sand:   { DEFAULT: '#FBEAD8', rule: '#F3D9BE' },
        teal:   { DEFAULT: '#0B4F4A', 2: '#8FB3BB', 3: '#A8C9C4', line: '#1A6159', soft: '#5E9B93' },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: { shell: '1440px' },
      boxShadow: { menu: '0 24px 48px -24px rgba(23,22,15,.22)' },
    },
  },
  plugins: [],
} satisfies Config;
