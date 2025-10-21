<script setup lang="ts">
const emit = defineEmits<{ (e: "navigate"): void }>();
const nav = [
  { label: "Overview", icon: "i-lucide-gauge", to: "/admin" },
  { label: "Users", icon: "i-lucide-users", to: "/admin/users" },
  { label: "Projects", icon: "i-lucide-folder", to: "/admin/projects" },
  { label: "Content", icon: "i-lucide-file-text", to: "/admin/content" },
  { label: "Settings", icon: "i-lucide-settings", to: "/admin/settings" },
];
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Brand -->
    <div class="h-16 flex items-center px-4 border-b border-default">
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
        <span class="i-lucide-layout-dashboard" />
        <span>Portfolio Site</span>
      </NuxtLink>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto p-2">
      <ul class="space-y-1">
        <li v-for="item in nav" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm
                   hover:bg-muted/70 hover:text-foreground transition-colors
                   data-[active=true]:bg-muted data-[active=true]:text-foreground"
            :data-active="$route.path === item.to || $route.path.startsWith(`${item.to}/`)"
            @click="emit('navigate')"
          >
            <span class="shrink-0" :class="[item.icon]" />
            <span class="truncate">{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="border-t border-default p-3">
      <UButton
        to="/logout"
        color="neutral"
        variant="ghost"
        icon="i-lucide-log-out"
        class="w-full justify-start"
      >
        Sign out
      </UButton>
    </div>
  </div>
</template>
