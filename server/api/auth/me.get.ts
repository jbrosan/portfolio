// server/api/auth/me.get.ts
import { auth } from "#server/utils/auth";

type SessionMe = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    emailVerified?: boolean;
    status?: "pending" | "active" | "disabled";
    role?: "admin" | "member";
    roles?: string[];
    authorities?: string[];
  };
  session: {
    token: string;
    createdAt: string;
    expiresAt: string;
  };
};

export default defineEventHandler(async (event): Promise<SessionMe | null> => {
  const result = await auth.api.getSession({ headers: event.headers });
  if (!result?.user || !result?.session) return null;

  const u = result.user as {
    emailVerified?: boolean;
    status?: "pending" | "active" | "disabled";
    role?: "admin" | "member";
    roles?: string[];
    authorities?: string[];
  };

  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name ?? null,
      emailVerified: u.emailVerified,
      status: u.status,
      role: u.role,
      roles: u.roles,
      authorities: u.authorities,
    },
    session: {
      token: result.session.token,
      createdAt: new Date(result.session.createdAt).toISOString(),
      expiresAt: new Date(result.session.expiresAt).toISOString(),
    },
  };
});
