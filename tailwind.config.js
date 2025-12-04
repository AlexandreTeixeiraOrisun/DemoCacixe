import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // Assure la prise en compte de App.tsx
  ],
  theme: {
    extend: {
      colors: {
        // Exemple si tu utilises des couleurs personnalisées
        primary: {
          50:  "#f5f7ff",
          100: "#e1e7ff",
          200: "#c2caff",
          300: "#9aa6ff",
          400: "#6f7dff",
          500: "#4b59f0",
          600: "#3a45c4",
          700: "#2b3493",
          800: "#1e2468",
          900: "#141844",
        },
        danger: {
          500: "#ef4444",
        },
        success: {
          500: "#22c55e",
        },
      },
      fontFamily: {
        // Si tu utilises une police spécifique dans App.tsx
        sans: ["system-ui", "sans-serif"],
      },
      // Ajoute ici tes tailles, ombres, etc. si tu as utilisé des classes custom
    },
  },
  plugins: [],
}

export default config
