export const content = ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'];
export const theme = {
  extend: {
    colors: {
      primary: '#5a3921',
      secondary: '#d9b18c',
      background: '#f9f5f0',
      accent: '#8c6d46',
      subtle: '#e6ccb3',
      textDark: '#333333',
    },
    fontFamily: {
      heading: ['Playfair Display', 'serif'],
      body: ['Raleway', 'sans-serif'],
    },
    fontSize: {
      h1: '28px',
      h2: '24px',
      h3: '20px',
      body: '16px',
      small: '14px',
    },
    maxWidth: {
      container: '1200px',
    },
    spacing: {
      8: '8px',
      16: '16px',
      24: '24px',
      32: '32px',
      40: '40px',
      48: '48px',
    },
    gridTemplateColumns: {
      desktop: 'repeat(12, 1fr)',
      tablet: 'repeat(8, 1fr)',
      mobile: 'repeat(4, 1fr)',
    },
  },
  screens: {
    sm: '375px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
  },
};
export const plugins = [];
