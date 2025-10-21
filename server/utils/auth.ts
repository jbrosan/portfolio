// server/utils/auth.ts

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import env from "@/utils/env";

import { db } from "../db/client";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  // ✅ FIX: Consolidate all provider configurations under the 'providers' key
  socialProviders: {
    // 1. Social Providers
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
      accessType: "offline",
    },
    facebook: {
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
      scopes: ["email", "public_profile", "user_age_range", "user_birthday"],
    },

  },
  // 2. Email/Password Provider
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "facebook"],
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
});
