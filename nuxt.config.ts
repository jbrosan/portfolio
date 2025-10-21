// https://nuxt.com/docs/api/configuration/nuxt-config

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import env from "./app/utils/env";

const dbUrl = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`;
// Get the directory of the current file (project root)
const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: dbUrl,

  },
  typescript: { strict: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/ui",
    "motion-v/nuxt",
    "nuxt-ripple",
  ],
  css: ["@/assets/css/main.css", "@/assets/css/palettes.css"],
  eslint: {
    config: {
      standalone: false,
    },
  },
  alias: {
    "#db": join(currentDir, "./server/db"),
    "#server": join(currentDir, "./server"),
  },
  colorMode: {
    preference: "dark",
    fallback: "light",

  },
  plugins: ["~/plugins/strip-facebook-hash.client"],
  app: {
    head: {
      title: "Dale Waugh · Portfolio",
    },
  },
});
