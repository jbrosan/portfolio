// https://nuxt.com/docs/api/configuration/nuxt-config

import env from "./app/utils/env";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
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
  ],
  css: ["@/assets/css/main.css"],
  eslint: {
    config: {
      standalone: false,
    },
  },
  alias: {
    '#db': join(currentDir, './server/db'),
  },
});
