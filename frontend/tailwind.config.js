/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#F6F4F1',
          white: '#FFFFFF',
        },
        primary: {
          DEFAULT: '#000000',
        },
        error: {
          DEFAULT: '#FF0000',
          light: '#FFF3F3',
        },
        success: {
          DEFAULT: '#10C3A9',
          light: '#F2FFFD',
        },
        sidebar: {
          DEFAULT: '#D7D7D7',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

