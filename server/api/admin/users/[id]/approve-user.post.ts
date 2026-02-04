// server/api/admin/users/[id]/approve.post.ts
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "#server/utils/auth";
import { db } from "#db/client";
import { user } from "#db/schema/auth";

const ParamsSchema = z.object({
  id: z.uuid(),
});

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  const u = session?.user as { id?: string; role?: string } | undefined;

  if (!u?.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  if (u.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const params = ParamsSchema.parse(event.context.params);

  await db
    .update(user)
    .set({ status: "active" }) // <-- your column
    .where(eq(user.id, params.id));

  return { ok: true };
});
