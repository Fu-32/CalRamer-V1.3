import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{css,scss,sass,less,styl}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#570df8',
          secondary: '#f000b8',
          tertiary: '#72767d', // Custom color
          accent: '#37cdbe',
          neutral: '#3d4451',
          'base-100': '#ffffff',
          info: '#3abff8',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272',
        },
      },
      {
        mytheme: {
          primary: '#22272B',
          secondary: '#283A3D',
          tertiary: '#283A3D', // Custom color
          accent: '#62C2AF',
          neutral: '#2e2328',
          'base-100': '#222222',
          info: '#00b1d3',
          success: '#00b37f',
          warning: '#ff9700',
          error: '#e03c61',
        },
      },
      'dark', // DaisyUI built-in dark theme
      'cupcake', // DaisyUI built-in cupcake theme
    ],
  },
};

export default config;
