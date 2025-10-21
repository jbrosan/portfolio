// server/api/account/sessions/revoke.post.ts
import type { H3Event } from "h3";

import { db } from "#db/client";
import { session as sessionTable } from "#db/schema/auth"; // alias to avoid name clash
import { auth } from "#server/utils/auth";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const Body = z.object({ token: z.string().min(8) });

export default defineEventHandler(async (event: H3Event) => {
  const authSession = await auth.api.getSession(event);
  if (!authSession?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const { token } = Body.parse(await readBody(event));

  // Prevent deleting the *current* session from this endpoint
  const currentToken = authSession.session?.token;
  if (token === currentToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot revoke current session here",
    });
  }

  const deleted = await db
    .delete(sessionTable)
    .where(
      and(
        eq(sessionTable.token, token),
        eq(sessionTable.userId, authSession.user.id),
      ),
    )
    .returning({ token: sessionTable.token });

  // If you want to signal "not found", you could 404 when deleted.length === 0
  return { ok: true, revoked: deleted.length };
});
