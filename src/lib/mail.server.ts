import nodemailer from "nodemailer";

import { getServerEnv } from "./env.server";

type SendMailInput = {
  to: string;
  subject: string;
  text: string;
};

export async function sendMail({ to, subject, text }: SendMailInput) {
  const env = getServerEnv();

  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth:
      env.SMTP_USER && env.SMTP_PASSWORD
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD,
          }
        : undefined,
  });

  await transport.sendMail({
    from: env.MAIL_FROM,
    to,
    subject,
    text,
  });
}
