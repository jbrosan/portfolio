<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

import { navLinks } from "@/utils/links"; // adjust path if your file lives elsewhere

// If you need to compute/extend links later, keep this typed:
const links = navLinks as NavigationMenuItem[];
</script>

<template>
  <div class="min-h-dvh relative z-30">
    <header
      class="fixed inset-x-0 top-2 sm:top-4 z-50 flex justify-center pointer-events-none"
      aria-label="Main"
    >
      <div class="pointer-events-auto">
        <AppHeader :links="links" />
      </div>
    </header>

    <main class="pt-24 sm:pt-28 relative z-20">
      <UContainer>
        <slot />
      </UContainer>
    </main>
  </div>
</template>
