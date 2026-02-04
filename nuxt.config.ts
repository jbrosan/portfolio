// nuxt.config.ts (root)
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import env from "./app/utils/env";

const dbUrl = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`;
const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: dbUrl,

    // SMTP base config
    smtpHost: env.SMTP_HOST || "smtp-relay.gmail.com",
    smtpPort: Number(env.SMTP_PORT ?? 587),
    smtpSecure: env.SMTP_SECURE === "true",

    // ✅ NEW: split "from"
    smtpFromAddress: env.SMTP_FROM_ADDRESS || "no-reply@dwportfolio.me",
    smtpFromName: env.SMTP_FROM_NAME || "Dale Waugh · Portfolio",

    // Keep smtpFrom only as a fallback for old setups
    smtpFrom: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_ADDRESS}>`,

    smtpUser: env.SMTP_USER || "",
    smtpPass: env.SMTP_PASS || "",
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
  eslint: { config: { standalone: false } },
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
