import { asc, eq, ne } from "drizzle-orm";

import { db } from "../db/client";
import { user } from "../db/schema/auth";

export async function requireActiveAdminByUserId(userId: string) {
  const [actor] = await db
    .select({
      id: user.id,
      status: user.status,
      role: user.role,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (actor?.status !== "active" || actor.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return actor;
}

export async function listManagedUsersForAdmin(actorUserId: string) {
  const actor = await requireActiveAdminByUserId(actorUserId);

  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(ne(user.id, actor.id))
    .orderBy(asc(user.createdAt));
}

export async function changeUserAccessStatusForAdmin(input: {
  actorUserId: string;
  userId: string;
  status: "active" | "disabled";
}) {
  const actor = await requireActiveAdminByUserId(input.actorUserId);

  if (input.userId === actor.id) {
    throw new Error("ADMIN_SELF_CHANGE_BLOCKED");
  }

  const [updated] = await db
    .update(user)
    .set({
      status: input.status,
      updatedAt: new Date(),
    })
    .where(eq(user.id, input.userId))
    .returning({
      id: user.id,
      status: user.status,
    });

  if (!updated) {
    throw new Error("USER_NOT_FOUND");
  }

  return updated;
}
