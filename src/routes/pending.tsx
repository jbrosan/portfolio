import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSessionAccess } from "../lib/auth.functions";

export const Route = createFileRoute("/pending")({
  beforeLoad: async () => {
    const access = await getSessionAccess();

    if (!access) {
      throw redirect({ to: "/login" });
    }

    if (access.status === "active") {
      throw redirect({ to: "/portfolio" });
    }

    return { access };
  },
  component: PendingPage,
});

function PendingPage() {
  const { access } = Route.useRouteContext();

  const disabled = access.status === "disabled";

  return (
    <main className="min-h-svh bg-background px-6 py-16 text-foreground">
      <section className="mx-auto max-w-xl space-y-5 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
          Dale Waugh
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {disabled ? "Access is disabled" : "Access request pending"}
        </h1>
        <p className="leading-7 text-neutral-600">
          {disabled
            ? "This account does not currently have portfolio access."
            : `Thanks, ${access.user.name}. Your email is verified and your request is waiting for Dale's approval.`}
        </p>
      </section>
    </main>
  );
}
