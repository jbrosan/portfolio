// composables/use-sessions.ts
export type SessionRow = {
  token: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  lastActiveAt: string;
  current: boolean;
};

export type SessionMe = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    roles?: string[];
    authorities?: string[];
    // add any extra fields you enrich in the API
  };
  session: {
    token: string;
    createdAt: string;
    expiresAt: string;
  };
};

export function useSessions() {
  const sessions = ref<SessionRow[]>([]);
  const me = shallowRef<SessionMe | null>(null);

  const pending = ref(false);
  const error = shallowRef<unknown>(null);

  // Optional: avoid overlapping loads
  const controller = shallowRef<AbortController | null>(null);

  async function load() {
    if (controller.value)
      controller.value.abort();
    controller.value = new AbortController();

    pending.value = true;
    error.value = null;
    try {
      const data = await $fetch<SessionRow[]>("/api/account/sessions/me", {
        signal: controller.value.signal,
      });
      sessions.value = data ?? [];
    }
    catch (err) {
      error.value = err;
      throw err;
    }
    finally {
      pending.value = false;
    }
  }

  async function revoke(token: string) {
    pending.value = true;
    error.value = null;
    try {
      await $fetch("/api/account/sessions/revoke", {
        method: "POST",
        body: { token },
      });
      // Optimistic update: drop the revoked session locally
      sessions.value = sessions.value.filter(s => s.token !== token);
    }
    catch (err) {
      error.value = err;
      throw err;
    }
    finally {
      pending.value = false;
    }
  }

  async function revokeOthers() {
    pending.value = true;
    error.value = null;
    try {
      await $fetch("/api/account/sessions/revoke-others", { method: "POST" });
      // Keep only the current session locally
      sessions.value = sessions.value.filter(s => s.current);
    }
    catch (err) {
      error.value = err;
      throw err;
    }
    finally {
      pending.value = false;
    }
  }

  async function getMe() {
    pending.value = true;
    error.value = null;
    try {
      const data = await $fetch<SessionMe>("/api/account/sessions/me");
      me.value = data ?? null;
      return data;
    }
    catch (err) {
      error.value = err;
      throw err;
    }
    finally {
      pending.value = false;
    }
  }

  const currentSession = computed<SessionRow | null>(() =>
    sessions.value.find(s => s.current) ?? null,
  );

  return {
    // state
    sessions,
    me,
    currentSession,
    pending,
    error,
    // actions
    load,
    revoke,
    revokeOthers,
    getMe,
  };
}
