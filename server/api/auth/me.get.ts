// server/api/auth/me.get.ts
import { auth } from "#server/utils/auth";

type SessionMe = {
  user: {
    id: string;
    email: string;
    name?: string | null;
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
  const result = await auth.api.getSession({
    headers: event.headers,
  });

  if (!result?.user || !result?.session) return null;

  // Map to your shape (and stringify dates if Better-Auth returns Date objects)
  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name ?? null,
      // add these if you enrich user in customSession:
      roles: (result.user as { roles?: string[] }).roles,
      authorities: (result.user as { authorities?: string[] }).authorities,
    },
    session: {
      token: result.session.token,
      createdAt: new Date(result.session.createdAt).toISOString(),
      expiresAt: new Date(result.session.expiresAt).toISOString(),
    },
  };
});
