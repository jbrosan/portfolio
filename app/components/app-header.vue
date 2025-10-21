<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

defineProps<{
  links: NavigationMenuItem[];
}>();
</script>

<template>
  <UNavigationMenu
    :items="links"
    variant="link"
    color="neutral"
    class="bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-4 border border-muted/50 shadow-lg shadow-neutral-950/5"
    :ui="{
      link: 'px-2 py-1',
      linkLeadingIcon: 'hidden',
    }"
  >
    <template #list-trailing>
      <ClientOnly>
        <ColorModeButton />
      </ClientOnly>
    </template>
  </UNavigationMenu>
</template>
