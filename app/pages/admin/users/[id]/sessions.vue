<script setup lang="ts">
import { authClient } from "~/utils/auth-client";

definePageMeta({ layout: "admin" });

const route = useRoute();
const userId = computed(() => String(route.params.id));

const pending = ref(false);
const error = ref<string | null>(null);
const sessions = ref<any[]>([]);

console.log("route param id:", route.params.id);
console.log("computed userId:", userId.value);

async function load() {
  pending.value = true;
  error.value = null;

  try {
    const res = await authClient.admin.listUserSessions({
      userId: userId.value,
      // if your types require query wrapper, adjust like listUsers did
      // query: { limit: 50, offset: 0 },
    });

    const err = (res as any)?.error;
    if (err) {
      error.value = typeof err === "string" ? err : err?.message ?? "Failed to load sessions";
      sessions.value = [];
      return;
    }

    const raw = res as any;

    const list =
      raw?.data?.sessions ??
      raw?.data?.items ??
      raw?.sessions ??
      raw?.items ??
      raw?.data ??
      raw;

    sessions.value = Array.isArray(list) ? list : [];

    // Debug if still empty
    // console.log("listUserSessions raw:", raw);
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Failed to load sessions";
    sessions.value = [];
  } finally {
    pending.value = false;
  }
}


onMounted(load);
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold">User Sessions</h1>

    <p v-if="pending" class="mt-4">Loading…</p>
    <p v-else-if="error" class="mt-4 text-red-600">{{ error }}</p>

    <div v-else class="mt-4 space-y-3">
      <div v-for="s in sessions" :key="s.id ?? s.sessionToken ?? JSON.stringify(s)" class="rounded border p-3">
        <div class="text-sm">{{ s.userAgent || "Unknown device" }}</div>
        <div class="text-xs opacity-70">
          {{ s.ipAddress || "—" }}
          <span v-if="s.createdAt"> • created {{ s.createdAt }}</span>
        </div>
      </div>

      <p v-if="sessions.length === 0" class="text-sm opacity-70">
        No sessions found for this user.
      </p>
    </div>
  </div>
</template>
