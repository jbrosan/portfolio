// server/api/account/sessions/me.get.ts
import { auth } from "#server/utils/auth";
import { toWebRequest } from "h3";

export default defineEventHandler(async (event) => {
  const { headers } = toWebRequest(event); // WHATWG Headers
  const session = await auth.api.getSession({ headers });

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  return {
    user: session.user,
    session: {
      token: session.session.token,
      createdAt: session.session.createdAt,
      expiresAt: session.session.expiresAt,
    },
  };
});
