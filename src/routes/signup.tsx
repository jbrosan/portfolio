import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
});

function SignUpPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (submitted) {
    return (
      <AuthShell title="Check your email">
        <p className="text-sm leading-6 text-neutral-600">
          We sent you a verification link. Open Mailpit during local development, verify your email,
          and you will be signed in to your pending access request.
        </p>
        <Link className="text-sm font-medium underline" to="/login">
          Back to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Request portfolio access">
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          setIsSubmitting(true);

          const form = new FormData(event.currentTarget);
          const name = String(form.get("name") ?? "");
          const email = String(form.get("email") ?? "");
          const password = String(form.get("password") ?? "");

          const result = await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: "/pending",
          });

          setIsSubmitting(false);

          if (result.error) {
            setError(result.error.message ?? "Unable to create your access request.");
            return;
          }

          setSubmitted(true);
        }}
      >
        <Field label="Name" name="name" type="text" autoComplete="name" />
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field label="Password" name="password" type="password" autoComplete="new-password" />

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <button
          className="w-full rounded-md bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Submitting…" : "Request access"}
        </button>
      </form>

      <p className="text-sm text-neutral-600">
        Already requested access?{" "}
        <Link className="font-medium text-neutral-950 underline" to="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        autoComplete={autoComplete}
        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
        name={name}
        required
        type={type}
      />
    </label>
  );
}

function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-svh bg-background px-6 py-16 text-foreground">
      <section className="mx-auto max-w-md space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Dale Waugh
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
        {children}
      </section>
    </main>
  );
}
