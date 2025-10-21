// tailwind.config.ts
import type { Config } from "tailwindcss";

import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class", "[data-theme=\"dark\"]"],
  content: [
    "./app.vue",
    "./layouts/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./components/**/*.{vue,js,ts}",
    "./plugins/**/*.{js,ts}",
  ],
  theme: {},
  plugins: [typography],
} satisfies Config;
