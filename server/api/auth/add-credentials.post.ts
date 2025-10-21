// server/api/auth/add-credentials.post.ts
import type { H3Event } from "h3";

import { auth } from "#server/utils/auth";
import { createError, defineEventHandler, getRequestHeaders, readBody } from "h3";
import { z } from "zod";

const Body = z.object({
  password: z.string().min(8).max(128),
});

// Convert Node's IncomingHttpHeaders -> WHATWG Headers (typed, no implicit any)
function headersFromEvent(event: H3Event): Headers {
  const raw = getRequestHeaders(event) as Record<string, string | string[] | undefined>;
  const headers = new Headers();

  for (const key of Object.keys(raw)) {
    const value = raw[key];
    if (typeof value === "string") {
      headers.append(key, value);
    }
    else if (Array.isArray(value)) {
      for (const val of value as string[]) {
        headers.append(key, val);
      }
    }
    // undefined -> skip
  }
  return headers;
}

export default defineEventHandler(async (event) => {
  const { password } = Body.parse(await readBody(event));
  const headers = headersFromEvent(event);

  // Better-Auth v1.3 expects headers (or a Request), not the H3 event
  const session = await auth.api.getSession({ headers });
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  // Link/set credentials for the current user
  await auth.api.setPassword({
    headers,
    method: "POST",
    body: { newPassword: password },
  });

  return { ok: true };
});
