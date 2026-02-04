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

function toAsciiSafeName(input: string): string {
  // Strip non-ASCII to avoid SMTP encoding issues.
  // (If you want to allow unicode later, do it only in headers, not envelope.)
  return input.replace(/[^\x20-\x7E]/g, "").trim();
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const config = useRuntimeConfig();
  const transport = getTransporter();

  // Prefer split env vars
  const fromAddressRaw = String((config as any).smtpFromAddress ?? "").trim();
  const fromNameRaw = String((config as any).smtpFromName ?? "").trim();

  // Fallback to smtpFrom if split vars aren't present
  const smtpFromRaw = String(config.smtpFrom ?? "").trim();

  // Determine envelope-from address
  const fromAddress =
    fromAddressRaw ||
    // If smtpFromRaw is like: Name <email@domain>
    (smtpFromRaw.match(/<([^>]+)>/)?.[1]?.trim() ?? "") ||
    // If smtpFromRaw is just an email
    smtpFromRaw;

  if (!fromAddress || !fromAddress.includes("@")) {
    throw new Error(
      `Invalid SMTP_FROM_ADDRESS / SMTP_FROM. Got: ${JSON.stringify({
        smtpFrom: smtpFromRaw,
        smtpFromAddress: fromAddressRaw,
      })}`,
    );
  }

  // Header "From" (pretty name allowed, but we keep it ASCII-safe)
  const fromName = toAsciiSafeName(fromNameRaw) || undefined;

  console.log("[sendEmail] sending to", options.to);
  console.log(
    "[sendEmail] envelope/header from =",
    JSON.stringify({ fromAddress, fromName, smtpFromRaw }),
  );

  await transport.sendMail({
    // ✅ Force RFC-safe envelope sender (this fixes your Gmail 555)
    envelope: {
      from: fromAddress,
      to: options.to,
    },

    // ✅ Header From (safe + branded)
    from: fromName ? { name: fromName, address: fromAddress } : fromAddress,

    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  console.log("[sendEmail] message queued");
}
