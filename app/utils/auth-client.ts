import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  // baseURL optional if your auth is served by the same Nuxt instance at /api/auth
  //  baseURL: env.NUXT_PUBLIC_BASE_URL, // optional
});
