/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
       
        agency:['Agency', 'sans-serif']
      },
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        muted: '#a1a1aa',
        border: 'rgba(255, 255, 255, 0.1)',
        card: 'rgba(255, 255, 255, 0.05)',
        accent: '#3b82f6',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  
}

