const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: {
    enabled: true,
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
