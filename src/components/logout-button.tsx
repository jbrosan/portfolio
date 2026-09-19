import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
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
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
      disabled={busy}
      onClick={logout}
      type="button"
    >
      <LogOut aria-hidden="true" size={16} />
      {busy ? "Logging out..." : "Log out"}
    </button>
  );
}
