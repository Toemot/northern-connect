import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef4ff",
          100: "#d9e8ff",
          500: "#1e5799",
          600: "#1a4a85",
          700: "#143a6b",
          900: "#0d2444",
        },
      },
      fontFamily: {
        sans: ["Segoe UI", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
