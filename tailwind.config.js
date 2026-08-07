import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                forest: {
                    DEFAULT: '#1F4D3A',
                    dark: '#153B2D',
                },
                sun: '#F5A623',
                sand: '#F2E6D2',
                cream: '#FFF7E6',
                wood: '#8B5A2B',
                base: '#FAF7F1',
                ink: '#1E2823',
                muted: '#747A76',
                success: '#3B8C5A',
                danger: '#D84A3A',
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                script: ['Caveat', 'cursive'],
            },
            borderRadius: {
                card: '16px',
            },
        },
    },

    plugins: [forms],
};
