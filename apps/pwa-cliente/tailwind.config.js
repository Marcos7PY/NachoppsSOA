const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', // emerald-500
          foreground: '#ffffff',
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          900: '#064e3b',
        },
        background: '#f8fafc', // slate-50
        foreground: '#0f172a', // slate-900
        card: '#ffffff',
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b'
        },
        border: '#e2e8f0',
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff'
        }
      }
    },
  },
  plugins: [],
};
