/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  // Bootstrap's reboot handles the base reset; avoid double-resets and the `.container` clash.
  corePlugins: { preflight: false, container: false },
  theme: {
    extend: {
      colors: {
        // Theme tokens flip with [data-theme] (see globals.css): paper = page, surface = cards, ink = text.
        paper: 'rgb(var(--paper-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        mute: 'rgb(var(--mute-rgb) / <alpha-value>)',
        clay: 'rgb(var(--clay-rgb) / <alpha-value>)',
        sage: '#6f7d5c',
        ivory: '#f6f2ea',
        coal: '#161514',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { label: '0.22em' },
      keyframes: {
        ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        kenburns: { '0%': { transform: 'scale(1.08)' }, '100%': { transform: 'scale(1)' } },
      },
      animation: {
        ticker: 'ticker 40s linear infinite',
        kenburns: 'kenburns 7s ease-out both',
      },
    },
  },
  plugins: [],
};
