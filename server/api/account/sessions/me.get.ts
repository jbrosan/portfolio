// server/api/account/sessions/me.get.ts
import { auth } from "#server/utils/auth";
import { toWebRequest } from "h3";

export default defineEventHandler(async (event) => {
  const { headers } = toWebRequest(event); // WHATWG Headers
  const sessionData = await auth.api.getSession({ headers });

  if (!sessionData) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }


  return {
    user: sessionData.user,
    session: {
      token: sessionData.session.token,
      createdAt: sessionData.session.createdAt,
      expiresAt: sessionData.session.expiresAt,
    },
  };
});
