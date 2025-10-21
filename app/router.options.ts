// app/router.options.ts
import type { RouterConfig } from "@nuxt/schema";

function safeSelect(hash: string): Element | null {
  try {
    const hasCssEscape
      = typeof (globalThis as any).CSS?.escape === "function";
    const selector = hasCssEscape
      ? `#${(globalThis as any).CSS.escape(hash.slice(1))}`
      : hash;
    return document.querySelector(selector);
  }
  catch {
    return null;
  }
}

export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition)
      return savedPosition;

    // Facebook OAuth quirk — clean and ignore
    if (to.hash === "#_=_") {
      history.replaceState(null, "", location.pathname + location.search);
      return { top: 0 };
    }

    if (to.hash) {
      const el = safeSelect(to.hash);
      if (el)
        return { el, behavior: "smooth" };
    }

    return { top: 0 };
  },
};
