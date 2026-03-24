import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        bg: '#070b10',
        bg2: '#0d1520',
        bg3: '#111e2e',
        panel: '#0a1628',
        cyan: '#00b4ff',
        cyan2: '#00e5ff',
        amber: '#ffb700',
        danger: '#ff3d5a',
        success: '#00e676',
      },
    },
  },
  plugins: [],
}
export default config
