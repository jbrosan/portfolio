// app/middleware/auth.ts
import { authClient } from "@/utils/auth-client";

export default defineNuxtRouteMiddleware(async (to) => {
    // SSR-safe session lookup (Better Auth Nuxt integration)
    const { data: session } = await authClient.useSession(useFetch);

    if (!session.value) {
        // optional: preserve return URL
        return navigateTo(`/auth/sign-in?next=${encodeURIComponent(to.fullPath)}`);
    }
});
