import type { NavigationMenuItem } from "@nuxt/ui";

export const navLinks: NavigationMenuItem[] = [{
  label: "Intro",
  icon: "i-lucide-home",
  to: "/",
}, {
  label: "Bio",
  icon: "i-lucide-folder",
  to: "/bio",
}, {
  label: "Career",
  icon: "i-lucide-file-text",
  to: "/career",
}, {
  label: "Skills",
  icon: "i-lucide-mic",
  to: "/skills",
}, {
  label: "Projects",
  icon: "i-lucide-user",
  to: "/projects",
}, {
  label: "Education",
  icon: "i-lucide-user",
  to: "/education",
}, {
  label: "Testimonials",
  icon: "i-lucide-user",
  to: "/testimonials",
}, {
  label: "Publications",
  icon: "i-lucide-user",
  to: "/publications",
}, {
  label: "Account",
  icon: "i-lucide-account-cog",
  to: "/account",
}];
