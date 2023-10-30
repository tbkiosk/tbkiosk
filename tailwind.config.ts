import { nextui } from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{ts,tsx}', './src/app/**/*.{ts,tsx}'],
  plugins: [require('tailwindcss-animate'), nextui()],
}
