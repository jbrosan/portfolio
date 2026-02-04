// server/utils/email.ts
import { useRuntimeConfig } from "#imports";
import nodemailer from "nodemailer";

export type SendEmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const config = useRuntimeConfig();

  const hasAuth =
    typeof config.smtpUser === "string" &&
    config.smtpUser.length > 0 &&
    typeof config.smtpPass === "string" &&
    config.smtpPass.length > 0;

  transporter = nodemailer.createTransport({
    host: String(config.smtpHost),
    port: Number(config.smtpPort),
    secure: Boolean(config.smtpSecure), // false for 587, true for 465
    ...(hasAuth
      ? {
        auth: {
          user: String(config.smtpUser),
          pass: String(config.smtpPass),
        },
      }
      : {}),
  });

  return transporter;
}

function extractEmailAddress(input: string): string {
  // Supports:
  // - "Name <email@domain>"
  // - "email@domain"
  const trimmed = input.trim();
  const angle = trimmed.match(/<([^>]+)>/);
  return (angle?.[1] ?? trimmed).trim();
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const config = useRuntimeConfig();
  const transport = getTransporter();

  // Prefer split env vars
  const fromAddressRaw = String((config as any).smtpFromAddress ?? "").trim();
  const fromNameRaw = String((config as any).smtpFromName ?? "").trim();

  // Fallback to smtpFrom if split vars aren't present
  const smtpFromRaw = String(config.smtpFrom ?? "").trim();

  // ✅ Envelope-from address must be plain email (ASCII)
  const fromAddress = extractEmailAddress(fromAddressRaw || smtpFromRaw);

  if (!fromAddress || !fromAddress.includes("@")) {
    throw new Error(
      `Invalid SMTP_FROM_ADDRESS / SMTP_FROM. Got: ${JSON.stringify({
        smtpFrom: smtpFromRaw,
        smtpFromAddress: fromAddressRaw,
      })}`,
    );
  }

  // ✅ Header display name (can be unicode; Nodemailer will encode it)
  const fromName = fromNameRaw.length > 0 ? fromNameRaw : undefined;

  console.log("[sendEmail] sending to", options.to);
  console.log(
    "[sendEmail] envelope/header from =",
    JSON.stringify({ fromAddress, fromName, smtpFromRaw }),
  );

  await transport.sendMail({
    // ✅ Envelope (what SMTP uses)
    envelope: {
      from: fromAddress,
      to: options.to,
    },

    // ✅ Header (what the user sees)
    // Only include `name` when defined to satisfy TS typings.
    from: fromName
      ? { name: fromName, address: fromAddress }
      : fromAddress,

    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  console.log("[sendEmail] message queued");
}
