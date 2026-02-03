// app/composables/use-auth-me.ts
export type SessionMe = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    roles?: string[];
    authorities?: string[];
  };
  session: {
    token: string;
    createdAt: string;
    expiresAt: string;
  };
};

export function useAuthMe() {
  return useAsyncData<SessionMe | null>(
    "auth-me",
    async () => {
      const data = await $fetch<SessionMe | null>("/api/auth/me");
      // ✅ Nuxt SSR requirement: never undefined
      return data ?? null;
    },
    {
      server: true,
      lazy: false,
    },
  );
}
