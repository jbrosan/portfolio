// server/api/auth/me.get.ts
import { auth } from "#server/utils/auth";
import { db } from "#server/db/client";
import { user } from "#server/db/schema/auth";
import { eq } from "drizzle-orm";

type SessionMe = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    emailVerified: boolean;
    status: "pending" | "active" | "disabled";
    role?: string | null;
    roles?: string[] | null;
    authorities?: string[] | null;
  };
  session: {
    token: string;
    createdAt: string;
    expiresAt: string;
  };
};

export default defineEventHandler(async (event): Promise<SessionMe | null> => {
  const result = await auth.api.getSession({ headers: event.headers });
  if (!result?.user?.id || !result?.session) return null;

  // ✅ DB is the source of truth for approval/verification/role
  const row = await db.query.user.findFirst({
    where: eq(user.id, result.user.id),
    columns: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      status: true,
      role: true,
    },
  });

  if (!row) return null;

  // Optional: keep extra fields from session if you populate them elsewhere
  const sessionUser = result.user as {
    roles?: string[];
    authorities?: string[];
  };

  return {
    user: {
      id: row.id,
      email: row.email,
      name: row.name ?? null,
      emailVerified: row.emailVerified,
      status: row.status,
      role: row.role ?? null,
      roles: sessionUser.roles ?? null,
      authorities: sessionUser.authorities ?? null,
    },
    session: {
      token: result.session.token,
      createdAt: new Date(result.session.createdAt).toISOString(),
      expiresAt: new Date(result.session.expiresAt).toISOString(),
    },
  };
});
