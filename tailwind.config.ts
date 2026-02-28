import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: '#1a2850',
          50: '#f0f2f7',
          100: '#dde1ec',
          200: '#b8c1d6',
          300: '#8491b5',
          400: '#526391',
          500: '#3a4a75',
          600: '#2d3a5f',
          700: '#1a2850',
          800: '#151f3f',
          900: '#0f1729',
        },
        charcoal: {
          DEFAULT: '#2c3e50',
          50: '#f5f7f9',
          100: '#e8ebed',
          200: '#c8ced5',
          300: '#a1acb7',
          400: '#6d7c8f',
          500: '#4f5f73',
          600: '#3e4d5f',
          700: '#2c3e50',
          800: '#253242',
          900: '#1d2633',
        },
        ivory: {
          DEFAULT: '#faf8f5',
          50: '#fefefe',
          100: '#fdfcfb',
          200: '#faf8f5',
          300: '#f5f1eb',
          400: '#ede7dd',
          500: '#e3dac9',
          600: '#d4c7b0',
          700: '#bfad92',
          800: '#a5906f',
          900: '#8b7655',
        },
        gold: {
          DEFAULT: '#b8956a',
          50: '#faf8f5',
          100: '#f2ede3',
          200: '#e6d9c4',
          300: '#d4be9b',
          400: '#c8ab80',
          500: '#b8956a',
          600: '#a07f58',
          700: '#86694a',
          800: '#6d5640',
          900: '#5a4735',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
