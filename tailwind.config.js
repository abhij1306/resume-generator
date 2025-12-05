/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // ResumeEdge Palette
                edge: {
                    light: "#EBECF0", // Main Light Background
                    panel: "#EBECF0", // Neumorphic Surface
                    card: "#E1E2E5",  // Slightly darker for depth
                    mint: "#00D2A0",  // Vibrant Mint (Darker for light mode contrast)
                    "mint-dim": "rgba(0, 210, 160, 0.1)",
                    dark: "#2D3440",  // Dark Text
                    secondary: "#7C8188", // Secondary Text
                    text: {
                        main: "#2D3440",
                        muted: "#6B7280"
                    }
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
            },
            boxShadow: {
                'neumorphic': '9px 9px 18px #d1d9e6, -9px -9px 18px #ffffff',
                'neumorphic-sm': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
                'neumorphic-inset': 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
                'mint-glow': '0 0 15px rgba(0, 210, 160, 0.3)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                // Adidas Style Shadows
                'neu-card': '6px 6px 12px rgba(0,0,0,0.05), -6px -6px 12px rgba(255,255,255,0.9)',
                'neu-btn': '6px 6px 12px rgba(0,0,0,0.06), -6px -6px 12px rgba(255,255,255,0.7)',
                'neu-input': 'inset 3px 3px 6px rgba(0,0,0,0.05), inset -3px -3px 6px rgba(255,255,255,0.7)',
                'mint-glow': '0 4px 10px rgba(166, 235, 207, 0.4)',
                'mint-glow-hover': '0 8px 18px rgba(166, 235, 207, 0.6)',
                'preview-float': '0px 12px 35px rgba(0,0,0,0.12)'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
        plugins: [],
    }
