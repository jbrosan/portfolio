import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "../db/client";
import { account, session, user, verification } from "../db/schema/auth";
import { getServerEnv } from "./env.server";
import { sendMail } from "./mail.server";

const env = getServerEnv();

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      account,
      session,
      user,
      verification,
    },
  }),
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user: authUser, url }) {
      await sendMail({
        to: authUser.email,
        subject: "Verify your Dale Waugh Portfolio access request",
        text: [
          `Hi ${authUser.name},`,
          "",
          "Please verify your email address to continue your portfolio access request:",
          url,
          "",
          "After verification, your request will remain pending until Dale approves access.",
        ].join("\n"),
      });
    },
  },
  plugins: [tanstackStartCookies()],
});
