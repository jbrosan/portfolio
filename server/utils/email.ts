import { useRuntimeConfig } from "#imports";
// server/utils/email.ts
import nodemailer from "nodemailer";

export type SendEmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter)
    return transporter;

  const config = useRuntimeConfig();

  const hasAuth
    = typeof config.smtpUser === "string"
    && config.smtpUser.length > 0
    && typeof config.smtpPass === "string"
    && config.smtpPass.length > 0;

  transporter = nodemailer.createTransport({
    host: config.smtpHost as string,
    port: config.smtpPort as number,
    secure: Boolean(config.smtpSecure), // usually false for 587
    ...(hasAuth
      ? {
        auth: {
          user: config.smtpUser as string,
          pass: config.smtpPass as string,
        },
      }
      : {}),
  });

  return transporter;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const config = useRuntimeConfig();
  const transport = getTransporter();

  console.log("[sendEmail] sending to", options.to);

  await transport.sendMail({
    from: config.smtpFrom as string,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  console.log("[sendEmail] message queued");
}
