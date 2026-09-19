import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <main className="min-h-svh bg-background px-6 py-16 text-foreground">
      <section className="mx-auto max-w-md space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Dale Waugh
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        </div>

        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);
            setIsSubmitting(true);

            const form = new FormData(event.currentTarget);
            const email = String(form.get("email") ?? "");
            const password = String(form.get("password") ?? "");

            const result = await authClient.signIn.email({
              email,
              password,
            });

            setIsSubmitting(false);

            if (result.error) {
              setError(
                result.error.status === 403
                  ? "Verify your email first. A new verification email has been sent."
                  : (result.error.message ?? "Unable to sign in."),
              );
              return;
            }

            await navigate({ to: "/portfolio" });
          }}
        >
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Email</span>
            <input
              autoComplete="email"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
              name="email"
              required
              type="email"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Password</span>
            <input
              autoComplete="current-password"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
              name="password"
              required
              type="password"
            />
          </label>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <button
            className="w-full rounded-md bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-neutral-600">
          Need access?{" "}
          <Link className="font-medium text-neutral-950 underline" to="/signup">
            Request access
          </Link>
        </p>
      </section>
    </main>
  );
}
