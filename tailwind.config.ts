import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        noir: {
          DEFAULT: "#08070a",
          soft: "#111014",
          raised: "#18161c",
        },
        cuir: {
          DEFAULT: "#b3161c",
          bright: "#e21f26",
          deep: "#6e0f14",
        },
        brume: {
          DEFAULT: "#5b6b82",
          soft: "#8a97ab",
          pale: "#c4cddb",
        },
        ivoire: "#f4efe6",
      },
      fontFamily: {
        display: ["'Neue Machina'", "'Space Grotesk'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
        "key-gradient": "linear-gradient(160deg, #18161c 0%, #08070a 60%)",
      },
      boxShadow: {
        "red-glow": "0 0 40px -8px rgba(226,31,38,0.55)",
        "cold-glow": "0 0 60px -10px rgba(91,107,130,0.45)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseKey: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.85" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        pulseKey: "pulseKey 2.4s ease-in-out infinite",
        floatSlow: "floatSlow 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
