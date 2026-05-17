import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/domain/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 16px 40px rgba(15, 23, 42, 0.08)"
      },
      colors: {
        industrial: {
          ink: "#172033",
          panel: "#F7F8FA",
          line: "#D9DEE7",
          copper: "#A65F2A",
          signal: "#0F766E"
        }
      }
    }
  },
  plugins: []
};

export default config;
