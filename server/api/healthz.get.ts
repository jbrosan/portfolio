import { db } from "#db/client";
import { user } from "#db/schema";

export default defineEventHandler(async (_event) => {
  const results = await db.select().from(user);
  return results;
});
