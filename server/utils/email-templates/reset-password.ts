// server/utils/email-templates/reset-password.ts

type ResetPasswordTemplateParams = {
    resetUrl: string;
};

function escapeHtml(input: string): string {
    return input
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export function resetPasswordEmailTemplate(
    params: ResetPasswordTemplateParams,
) {
    const safeUrl = escapeHtml(params.resetUrl);

    return {
        subject: "Reset your password",

        text: `
You requested a password reset.

Use the link below to set a new password:
${params.resetUrl}

If you didn’t request this, you can safely ignore this email.
`.trim(),

        html: `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">Reset your password</h2>

        <p style="margin: 0 0 16px;">
          You requested a password reset. Click the button below to set a new password.
        </p>

        <p style="margin: 0 0 24px;">
          <a
            href="${safeUrl}"
            style="
              display: inline-block;
              padding: 10px 14px;
              border-radius: 8px;
              text-decoration: none;
              background: #111827;
              color: #ffffff;
              font-weight: 500;
            "
          >
            Reset password
          </a>
        </p>

        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>
    `.trim(),
    };
}
