module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#c1292e',
        'brand-background': '#ffffff',
        'brand-header-background': '#e2e1e1',
        'white-hover': '#f2f2f2',
        'red-hover': '#a81f26',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
