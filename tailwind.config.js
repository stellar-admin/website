const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: {
    enabled: false,
    content: ["./input/**/*.cshtml"],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/ui'),
  ],
};
