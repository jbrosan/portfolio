import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";

import { db } from "../db/client";
import { user } from "../db/schema/auth";
import { auth } from "./auth.server";

export type AccessStatus = "pending" | "active" | "disabled";

export const getSessionAccess = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return null;
  }

  const [access] = await db
    .select({
      status: user.status,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
    },
    status: (access?.status ?? "pending") as AccessStatus,
  };
});
