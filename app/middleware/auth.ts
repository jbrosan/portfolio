// app/middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
    // Public routes
    if (to.path === "/" || to.path.startsWith("/auth")) return;

    const { data } = await useFetch("/api/auth/me");
    const me = data.value;

    // Not logged in
    if (!me?.user) {
        return navigateTo(`/auth/sign-in?next=${encodeURIComponent(to.fullPath)}`);
    }

    // Email not verified
    if (!me.user.emailVerified) {
        return navigateTo("/auth/verify-email");
    }

    // Account not approved
    if (me.user.status !== "active") {
        return navigateTo("/auth/pending");
    }
});
