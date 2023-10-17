import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './node_modules/@nextui-org/theme/dist/components/(button|input|image|spinner|select|dropdown|modal|table).js',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  plugins: [require('tailwindcss-animate'), nextui()],
}
