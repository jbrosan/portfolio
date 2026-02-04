// app/composables/use-auth-state.ts
import type { SessionMe } from "~/composables/use-sessions";

const AUTH_STATE_KEY = "auth-me-state";

export function useAuthState() {
  const me = useState<SessionMe | null>(AUTH_STATE_KEY, () => null);
  const pending = useState<boolean>("auth-me-pending", () => false);

  async function refreshMe() {
    pending.value = true;
    try {
      // will be null when logged out, object when logged in
      const data = await $fetch<SessionMe | null>("/api/auth/me", {
        credentials: "include",
      });
      me.value = data ?? null;
      return me.value;
    } finally {
      pending.value = false;
    }
  }

  const isAuthed = computed(() => Boolean(me.value?.user?.id));

  return { me, pending, isAuthed, refreshMe };
}
