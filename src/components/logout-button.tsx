import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "../lib/auth-client";

export function LogoutButton() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);

    try {
      await authClient.signOut();
      await navigate({ to: "/login", replace: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:opacity-50"
      disabled={busy}
      onClick={logout}
      type="button"
    >
      {busy ? "Logging out..." : "Log out"}
    </button>
  );
}
