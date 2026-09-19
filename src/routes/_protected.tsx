import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

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
  component: () => <Outlet />,
});
