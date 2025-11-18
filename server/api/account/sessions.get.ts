// server/api/account/sessions.get.ts
import type { H3Event } from "h3";

import { db } from "#db/client";
import { session as sessionTable } from "#db/schema/auth";
import { auth } from "#server/utils/auth";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event: H3Event) => {
  const authSession = await auth.api.getSession(event);
  console.log("Auth Session:", authSession);
  if (!authSession?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const rows = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.userId, authSession.user.id));

  const currentToken = authSession.session?.token ?? null;

  return rows.map(s => ({
    token: s.token,
    userAgent: s.userAgent ?? null,
    ipAddress: s.ipAddress ?? null,
    createdAt: new Date(s.createdAt).toISOString(),
    lastActiveAt: new Date(s.updatedAt ?? s.createdAt).toISOString(),
    current: currentToken ? s.token === currentToken : false,
  }));
});
