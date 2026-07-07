import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Wedding palette
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#C9A84C",   // primary gold
          600: "#B8960A",
          700: "#92740A",
          800: "#78610A",
          900: "#5C4A08",
        },
        blush: {
          50: "#fff5f7",
          100: "#ffe4ea",
          200: "#ffc9d5",
          300: "#ffa3b8",
          400: "#f97ca0",
          500: "#E8A0B0",   // soft pink
          600: "#d4748a",
          700: "#b85a70",
          800: "#9c4459",
          900: "#7d3247",
        },
        cream: {
          50: "#FDFAF4",
          100: "#FAF5E8",
          200: "#F5EDD4",
          300: "#EDE2C2",
          400: "#E0D2AC",
          500: "#CFC08F",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        script: ["Great Vibes", "cursive"],
      },
      boxShadow: {
        "wedding": "0 4px 40px rgba(201, 168, 76, 0.15)",
        "wedding-lg": "0 8px 60px rgba(201, 168, 76, 0.25)",
        "card": "0 2px 20px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.12)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C 0%, #E8D5A3 50%, #C9A84C 100%)",
        "blush-gradient": "linear-gradient(135deg, #fff5f7 0%, #fce4ec 50%, #fff5f7 100%)",
        "hero-gradient": "linear-gradient(160deg, #FDFAF4 0%, #fff5f7 40%, #FFF8F0 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(253,250,244,0.95) 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 168, 76, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(201, 168, 76, 0)" },
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
