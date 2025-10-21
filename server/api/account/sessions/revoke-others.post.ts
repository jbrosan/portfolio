// server/api/account/sessions/revoke-others.post.ts
import type { H3Event } from "h3";

import { db } from "#db/client";
import { session as sessionTable } from "#db/schema/auth"; // <-- alias table to avoid name clash
import { auth } from "#server/utils/auth";
import { and, eq, ne } from "drizzle-orm";

export default defineEventHandler(async (event: H3Event) => {
  // Better-Auth session for the current request
  const authSession = await auth.api.getSession(event);
  if (!authSession?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  // We must know the current session token to avoid revoking it
  const currentToken = authSession.session?.token;
  if (!currentToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "Current session token not available",
    });
  }

  // Delete every session for this user except the current one
  const deleted = await db
    .delete(sessionTable)
    .where(
      and(
        eq(sessionTable.userId, authSession.user.id),
        ne(sessionTable.token, currentToken),
      ),
    )
    .returning({ token: sessionTable.token });

  return { ok: true, revoked: deleted.length };
});
