// server/utils/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, multiSession } from "better-auth/plugins";

import env from "@/utils/env";
import { db } from "../db/client";

import { sendEmail } from "./email";
import { resetPasswordEmailTemplate } from "./email-templates/reset-password";
import { verifyEmailTemplate } from "./email-templates/verify-email";

type EmailTaskData = {
  user: { email: string };
  url: string;
  token: string;
};

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),

  socialProviders: {
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

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    // ✅ Password reset stays here
    sendResetPassword: async ({ user, url }: EmailTaskData) => {
      const tpl = resetPasswordEmailTemplate({ resetUrl: url });

      await sendEmail({
        to: user.email,
        subject: tpl.subject,
        text: tpl.text,
        html: tpl.html,
      });
    },
  },

  // ✅ Email verification is configured HERE (top-level)
  emailVerification: {
    sendVerificationEmail: async ({ user, url }: EmailTaskData) => {
      const tpl = verifyEmailTemplate({ url });

      await sendEmail({
        to: user.email,
        subject: tpl.subject,
        text: tpl.text,
        html: tpl.html,
      });
    },
  },

  user: {
    changeEmail: { enabled: true },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "facebook"],
    },
  },

  plugins: [admin(), multiSession()],

  advanced: {
    database: { generateId: "uuid" },
  },
});
