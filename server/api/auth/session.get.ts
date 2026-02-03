// server/api/auth/session.get.ts
import { auth } from "#server/utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  // Nuxt wants a defined value so SSR payload is stable
  return session ?? null;
});
