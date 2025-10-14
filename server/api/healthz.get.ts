import { db } from "#db/client";
import { career } from "#db/schema";
export default defineEventHandler(async (event) => {

  const results = await db.select().from(career);
  console.log(results)
  return results
});
