/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zomato: {
          red: '#FF3333', // Vibrant red
          dark: '#000000', // Pure black for maximum contrast
          darker: '#1A1A1A', // Deep dark for headings
          lightRed: '#FF5252',
          gray: '#666666', // Medium gray
          lightGray: '#FAFAFA', // Clean light background
          borderGray: '#DDDDDD', // Subtle borders
          orange: '#FF6B6B', // Vibrant coral
          pink: '#FF8E9B', // Bright pink accent
          darkRed: '#FF1A1A', // Deep vibrant red
          white: '#FFFFFF',
          textDark: '#000000', // Maximum contrast
          textSecondary: '#444444', // Secondary text
          accent: '#FF4757', // Bright accent red
          gradientStart: '#FF3333', // Gradient start
          gradientEnd: '#FF6B6B', // Gradient end
          cream: '#FFF5F5', // Warm cream/light pink
          rose: '#FFE5E5', // Light rose
          lightPink: '#FFF0F0', // Very light pink
        },
      },
      backgroundImage: {
        'food-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23E23744\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}

