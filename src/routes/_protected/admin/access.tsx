import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { changeUserAccessStatus, listManagedUsers } from "../../../lib/admin-access.functions";

export const Route = createFileRoute("/_protected/admin/access")({
  beforeLoad: ({ context }) => {
    if (context.access.role !== "admin") {
      throw redirect({ to: "/portfolio" });
    }
  },
  loader: () => listManagedUsers(),
  component: AdminAccessPage,
});

function AdminAccessPage() {
  const users = Route.useLoaderData();
  const router = useRouter();
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(userId: string, status: "active" | "disabled") {
    setBusyUserId(userId);
    setError(null);

    try {
      await changeUserAccessStatus({
        data: {
          userId,
          status,
        },
      });
      await router.invalidate();
    } catch {
      setError("Unable to update access. Please try again.");
    } finally {
      setBusyUserId(null);
    }
  }

  return (
    <main className="min-h-svh bg-background px-6 py-16 text-foreground">
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">
            Dale Waugh
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Access requests</h1>
          <p className="max-w-2xl text-neutral-600">
            Approve verified users for portfolio access or disable an existing request.
          </p>
        </div>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          {users.length === 0 ? (
            <p className="p-6 text-sm text-neutral-600">No access requests yet.</p>
          ) : (
            <div className="divide-y divide-neutral-200">
              {users.map((managedUser) => {
                const busy = busyUserId === managedUser.id;

                return (
                  <article
                    className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                    key={managedUser.id}
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{managedUser.name}</p>
                      <p className="text-sm text-neutral-600">{managedUser.email}</p>
                      <p className="text-xs uppercase tracking-wide text-neutral-500">
                        {managedUser.emailVerified ? "Verified" : "Unverified"} ·{" "}
                        {managedUser.status}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="rounded-md bg-neutral-950 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                        disabled={busy || !managedUser.emailVerified}
                        onClick={() => updateStatus(managedUser.id, "active")}
                        type="button"
                      >
                        Approve
                      </button>
                      <button
                        className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium disabled:opacity-50"
                        disabled={busy}
                        onClick={() => updateStatus(managedUser.id, "disabled")}
                        type="button"
                      >
                        Disable
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
