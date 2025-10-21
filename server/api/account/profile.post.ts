// server/api/account/profile.post.ts
import type { H3Event } from "h3";

import { db } from "#db/client";
import { user as userTable } from "#db/schema/auth"; // <-- alias to avoid pluralization errors
import { auth } from "#server/utils/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const BodySchema = z.object({
  name: z.string().min(2),
  imageUrl: z.url().optional(), // zod v4
});

export default defineEventHandler(async (event: H3Event) => {
  const authSession = await auth.api.getSession(event);
  if (!authSession?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody(event);
  const parsed = BodySchema.parse(body);

  await db
    .update(userTable)
    .set({
      name: parsed.name,
      image: parsed.imageUrl,
      updatedAt: new Date(),
    })
    .where(eq(userTable.id, authSession.user.id));

  return { ok: true };
});
