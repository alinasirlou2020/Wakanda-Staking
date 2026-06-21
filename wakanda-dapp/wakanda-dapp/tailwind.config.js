/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        wakanda: {
          bg: "#0a0612",
          surface: "#130a24",
          panel: "#1a0f33",
          purple: "#6b21a8",
          violet: "#8b3ce0",
          cyan: "#22d3ee",
          gold: "#c9a86a",
          danger: "#ef4444",
        },
      },
      boxShadow: {
        glow: "0 0 24px rgba(34, 211, 238, 0.35)",
        "glow-purple": "0 0 24px rgba(139, 60, 224, 0.45)",
      },
      backgroundImage: {
        "panther-gradient":
          "radial-gradient(circle at 20% 20%, rgba(139,60,224,0.25), transparent 50%), radial-gradient(circle at 80% 0%, rgba(34,211,238,0.15), transparent 40%), #0a0612",
      },
    },
  },
  plugins: [],
};
