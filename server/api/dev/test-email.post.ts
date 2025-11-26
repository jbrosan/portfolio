// server/api/dev/test-email.post.ts
import type { H3Event } from "h3";

import { sendEmail } from "#server/utils/email";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<{ to?: string }>(event);

  if (!body?.to) {
    throw createError({
      statusCode: 400,
      statusMessage: "`to` is required",
    });
  }

  await sendEmail({
    to: body.to,
    subject: "Test email from Nuxt v4",
    text: "If you received this, Google SMTP relay + Nuxt are working.",
  });

  return { ok: true };
});
