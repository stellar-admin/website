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
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        "code::before": {content: "none"},
                        "code::after": {content: "none"},
                        code: {
                            backgroundColor: theme('colors.gray.100'),
                            borderWidth: 1,
                            borderColor: theme('colors.gray.200'),
                            borderRadius: '.25rem',
                            padding: '2px 4px',
                            color: theme('colors.gray.600'),
                        },
                    },
                },
            }),
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
