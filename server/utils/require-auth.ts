// server/utils/require-auth.ts
import type { EventHandler, H3Event } from "h3";
import { createError } from "h3";
import { auth } from "./auth"; // your Better Auth server instance

export const requireAuth: EventHandler = async (event: H3Event) => {
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  // stash it so your handler can use it
  event.context.auth = session;
};
