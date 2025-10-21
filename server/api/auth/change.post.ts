// server/api/auth/password/change.post.ts
import type { H3Event } from "h3";

import { auth } from "#server/utils/auth";
import { getRequestHeaders } from "h3";
import { z } from "zod";

const Body = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(12),
  revokeOtherSessions: z.boolean().optional().default(true),
});

export default defineEventHandler(async (event: H3Event) => {
  const session = await auth.api.getSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const { currentPassword, newPassword, revokeOtherSessions } = Body.parse(
    await readBody(event),
  );

  // Convert H3 headers -> Headers (drop undefineds)
  const raw = getRequestHeaders(event); // Record<string, string | undefined>
  const headers = new Headers();
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string")
      headers.set(k, v);
  }

  await auth.api.changePassword({
    body: { currentPassword, newPassword, revokeOtherSessions },
    headers, // satisfies HeadersInit
  });

  return { ok: true };
});
