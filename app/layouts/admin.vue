<script setup lang="ts">
import { useRoute } from "#app";
import { computed, onMounted, ref } from "vue";

import AdminSidebar from "@/components/layout/admin/admin-sidebar.vue";
import ColorModeButton from "~/components/color-mode-button.vue";

const sidebarOpen = ref(true);
const isClient = ref(false);
onMounted(() => {
  isClient.value = true;
});

const route = useRoute();
const crumbs = computed(() => {
  const segs = route.path.split("/").filter(Boolean);
  const arr: { label: string; to: string }[] = [];
  let path = "";
  for (const s of segs) {
    path += `/${s}`;
    arr.push({ label: s.replace(/-/g, " ").replace(/\b\w/g, m => m.toUpperCase()), to: path });
  }
  return [{ label: "Dashboard", to: "/admin" }, ...arr];
});
</script>

<template>
  <div
    class="min-h-dvh text-foreground"
    style="--sidebar-width: 19rem; --sidebar-gap: 1rem; --shadow-alpha: 0.15;"
  >
    <!-- Sidebar -->
    <aside
      class="fixed left-[var(--sidebar-gap)] top-[var(--sidebar-gap)] bottom-[var(--sidebar-gap)]
             w-[var(--sidebar-width)]
             border border-[var(--border)] bg-[var(--sidebar-bg)]
             rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,var(--shadow-alpha))]
             transition-transform duration-300 z-40 isolate"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(var(--sidebar-width)+2rem)]'"
      aria-label="Sidebar"
    >
      <div class="h-16 flex items-center px-4 border-b border-[var(--border)] bg-[var(--sidebar-header-bg)] rounded-t-2xl">
        <NuxtLink to="/admin" class="flex items-center gap-2 font-semibold">
          <span class="i-lucide-layout-dashboard" />
          <span>Admin</span>
        </NuxtLink>
      </div>

      <div class="h-[calc(100%-4rem)] overflow-y-auto">
        <AdminSidebar @navigate="sidebarOpen = false" />
      </div>
    </aside>

    <!-- Right canvas -->
    <div
      class="transition-[margin] duration-300 m-[var(--sidebar-gap)]
             rounded-2xl border border-[var(--border)] bg-[var(--main-bg)]
             shadow-[0_10px_30px_rgba(0,0,0,var(--shadow-alpha))]
             relative z-10 isolate overflow-hidden"
      :class="sidebarOpen
        ? 'md:ml-[calc(var(--sidebar-width)+calc(var(--sidebar-gap)*2))]'
        : 'md:ml-[var(--sidebar-gap)]'"
      :style="{ height: 'calc(100dvh - (var(--sidebar-gap) * 2))' }"
    >
      <header class="sticky top-0 z-30 bg-[var(--main-header-bg)] border-b border-[var(--border)] px-4 rounded-t-2xl">
        <div class="flex h-16 items-center gap-2">
          <UButton
            class="-ml-1"
            size="sm"
            color="neutral"
            variant="ghost"
            :icon="sidebarOpen ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left-open'"
            aria-label="Toggle sidebar"
            :aria-expanded="sidebarOpen"
            @click="sidebarOpen = !sidebarOpen"
          />
          <div class="w-px h-4 bg-[var(--border)]/60 mr-2" />

          <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-muted-foreground">
            <NuxtLink
              v-for="(c, i) in crumbs"
              :key="c.to + i"
              :to="c.to"
              class="hover:text-foreground transition-colors"
              :class="i === crumbs.length - 1 ? 'text-foreground font-medium pointer-events-none' : ''"
            >
              {{ c.label }}
              <span v-if="i < crumbs.length - 1" class="mx-2 text-muted-foreground/60">/</span>
            </NuxtLink>
          </nav>

          <div class="ml-auto flex items-center gap-2">
            <ClientOnly>
              <ColorModeButton />
            </ClientOnly>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>

    <!-- Mobile overlay -->
    <button
      v-if="sidebarOpen && isClient"
      class="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] md:hidden"
      aria-label="Close sidebar overlay"
      @click="sidebarOpen = false"
    />
  </div>
</template>
