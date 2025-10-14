import { db } from "#db/client";
import { career } from "#db/schema";

export default defineEventHandler(async (_event) => {
  const results = await db.select().from(career);
  return results;
});
