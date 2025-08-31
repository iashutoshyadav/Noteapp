import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
     extend: {
    fontFamily: {
        sans: ["Poppins", "sans-serif"], // ✅ Default sans is now Poppins
      },
   },
},
  plugins: [],
} satisfies Config;
