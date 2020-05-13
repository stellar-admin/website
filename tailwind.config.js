module.exports = {
  purge: {
    enabled: true,
    content: ["./input/**/*.cshtml"],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('@tailwindcss/ui'),
  ],
};
