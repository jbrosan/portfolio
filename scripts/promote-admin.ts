import { and, eq } from "drizzle-orm";

import { db } from "../src/db/client";
import { user } from "../src/db/schema/auth";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  throw new Error("Usage: bun run admin:promote -- <email>");
}

const [candidate] = await db
  .select({
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    status: user.status,
    role: user.role,
  })
  .from(user)
  .where(and(eq(user.email, email), eq(user.emailVerified, true)))
  .limit(1);

if (!candidate) {
  throw new Error(`No verified user found for ${email}`);
}

const [updated] = await db
  .update(user)
  .set({
    role: "admin",
    status: "active",
    updatedAt: new Date(),
  })
  .where(eq(user.id, candidate.id))
  .returning({
    id: user.id,
    email: user.email,
    status: user.status,
    role: user.role,
  });

console.log(updated);
