import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f1',
          100: '#dcf1df',
          200: '#bbe2c2',
          300: '#8fcc9d',
          400: '#5eaf73',
          500: '#3d9354',
          600: '#2d7741',
          700: '#255f36',
          800: '#1f4c2d',
          900: '#1a3f27',
          950: '#0e2316',
        },
        gold: {
          50: '#fbfaf4',
          100: '#f4f1de',
          200: '#e9e1bd',
          300: '#dac78f',
          400: '#cca95f',
          500: '#bf8e3f',
          600: '#a67232',
          700: '#8a582c',
          800: '#714829',
          900: '#5d3c25',
          950: '#341f12',
        }
      },
    },
  },
  plugins: [],
};
export default config;
