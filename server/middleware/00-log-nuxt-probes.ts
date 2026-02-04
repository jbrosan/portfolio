export default defineEventHandler((event) => {
  const path = event.path ?? "";

  if (path === "/_nuxt/" || path === "/_nuxt") {
    const ua = event.headers.get("user-agent") || "(no user-agent)";
    const ip =
      event.node?.req?.socket?.remoteAddress ||
      event.node?.req?.headers?.["x-forwarded-for"] ||
      "(unknown)";

    // eslint-disable-next-line no-console
    console.warn("[probe] /_nuxt requested", { ip, ua });
  }
});
