// server/email-templates/verify-email.ts
export function verifyEmailTemplate(params: { url: string; brand?: string }) {
  const brand = params.brand ?? "Dale Waugh · Portfolio";
  const url = params.url;

  return {
    subject: `Verify your email for ${brand}`,
    text: `Verify your email: ${url}`,
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.5">
        <h2>Verify your email</h2>
        <p>Click the button below to verify your email address.</p>
        <p><a href="${url}" style="display:inline-block;padding:10px 14px;border-radius:8px;background:#111;color:#fff;text-decoration:none">Verify email</a></p>
        <p style="color:#666;font-size:12px">If you didn’t request this, you can ignore this email.</p>
      </div>
    `,
  };
}
