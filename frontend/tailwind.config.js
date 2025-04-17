// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: { "pulse-slow": "pulse 8s linear infinite",
        shimmer: "shimmer 2s linear infinite",},
      colors: {
        primary: '#62BFED',
        background: '#E8E9EB',
        backdropBlur: {
          sm: '4px',
        }
      },
      borderRadius: {
        xl: '1rem',
      },
    
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        }},
  },
  plugins: [],
}}
