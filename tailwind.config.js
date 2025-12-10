/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['"Product Sans"', '"Inter"', '"Helvetica Neue"', '"Proxima Nova"', '"Gill Sans"', 'sans-serif'],
    },
    extend: {
      colors: {
        // Elegant Palette: #000, #FFD700, #FFF
        elegant: {
          black: '#000000',
          gold: '#FFD700',
          white: '#FFFFFF',
          ivory: '#FFFFF0',
          beige: '#F5F5DC',
        },
        // Modern Palette: #0D47A1, #E1F5FE, #F44336
        modern: {
          navy: '#0D47A1',
          lightBlue: '#E1F5FE',
          red: '#F44336',
        },
        // 60-30-10 Rule Colors
        neutral: {
          50: '#FAFAF9',
          100: '#F5F5F0',
          200: '#E8E8E0',
          300: '#D4D4C8',
          400: '#A8A890',
          500: '#7C7C68',
          600: '#606050',
          700: '#444438',
          800: '#282820',
          900: '#1C1C18',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          gold: '#FFD700',
          red: '#F44336',
          green: '#4CAF50',
          peach: '#FFB380',
        },
        // Fashion-forward colors - deep, rich, not too bright
        fashion: {
          burgundy: '#8B2E3D',
          wine: '#722F37',
          emerald: '#2D5F4A',
          forest: '#1B4332',
          navy: '#1E3A5F',
          royal: '#2C5282',
          terracotta: '#B85C38',
          rust: '#8B4513',
          violet: '#5B4B8A',
          amethyst: '#6B46C1',
          bronze: '#CD7F32',
          amber: '#D97706',
        },
      },
      fontFamily: {
        heading: ['"Product Sans"', '"Bodoni Moda"', '"Didot"', '"Futura"', 'serif'],
        body: ['"Product Sans"', '"Proxima Nova"', '"Helvetica Neue"', '"Inter"', '"Gill Sans"', 'sans-serif'],
        elegant: ['"Product Sans"', '"Inter"', 'sans-serif'],
        'product-sans': ['"Product Sans"', 'sans-serif'],
      },
      fontWeight: {
        normal: '500',
        medium: '600',
        semibold: '700',
        bold: '800',
        extrabold: '900',
      },
      borderRadius: {
        'creative': '2rem 0.5rem 2rem 0.5rem',
        'creative-lg': '3rem 1rem 3rem 1rem',
        'geometric': '1.5rem 0 1.5rem 0',
        '4xl': '2rem',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in': 'slide-in 0.6s ease-out',
        'blob': 'blob 7s infinite',
        'scale-up': 'scale-up 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
              boxShadow: {
                'elegant': '0 10px 40px rgba(0, 0, 0, 0.1)',
                'elegant-lg': '0 20px 60px rgba(0, 0, 0, 0.15)',
                'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
              },
              spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
              },
    },
  },
  plugins: [],
}

