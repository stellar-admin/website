const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    purge: {
        content: ["./input/**/*.cshtml"],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
            typography: {
                DEFAULT: {
                    css: {
                        "code::before": {content: "none"},
                        "code::after": {content: "none"},
                    },
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
