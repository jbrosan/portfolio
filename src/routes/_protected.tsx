import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";

import { LogoutButton } from "../components/logout-button";
import { getSessionAccess } from "../lib/auth.functions";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ location }) => {
    const access = await getSessionAccess();

    if (!access) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (access.status !== "active") {
      throw redirect({ to: "/pending" });
    }

    return { access };
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { access } = Route.useRouteContext();

  return (
    <>
      <div className="fixed right-6 top-6 z-50 flex items-center gap-2">
        {access.role === "admin" ? (
          <Link
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50"
            to="/admin/access"
          >
            Manage Access
          </Link>
        ) : null}
        <LogoutButton />
      </div>
      <Outlet />
    </>
  );
}
