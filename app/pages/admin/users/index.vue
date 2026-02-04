<script setup lang="ts">
import { authClient } from "~/utils/auth-client";

definePageMeta({ layout: "admin" });

type AdminUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  emailVerified?: boolean | null;
  status?: string | null;
  createdAt?: string | null;
};

const pending = ref(false);
const error = ref<string | null>(null);
const users = ref<AdminUser[]>([]);

// UI state
const searchValue = ref("");
const searchField = ref<"name" | "email">("email");

async function load() {
  pending.value = true;
  error.value = null;

  try {
    const res = await authClient.admin.listUsers({
      query: {
        ...(searchValue.value.trim()
          ? {
              searchValue: searchValue.value.trim(),
              searchField: searchField.value,
              searchOperator: "contains",
            }
          : {}),
        limit: 50,
        offset: 0,
      },
    });

    // Some better-auth client calls return { data, error } without throwing
    const err = (res as any)?.error;
    if (err) {
      error.value = typeof err === "string" ? err : err?.message ?? "Failed to load users";
      users.value = [];
      return;
    }

    const raw = res as any;

    // Common shapes: { data: { users: [] } }, { users: [] }, { data: [] }
    const list =
      raw?.data?.users ??
      raw?.data?.items ??
      raw?.users ??
      raw?.items ??
      raw?.data ??
      raw;

    users.value = Array.isArray(list) ? list : [];

    // Debug if still empty
    // console.log("listUsers raw:", raw);
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Failed to load users";
    users.value = [];
  } finally {
    pending.value = false;
  }
}

onMounted(load);

function onSearch() {
  // reset paging if you add it later
  load();
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-xl font-semibold">Users</h1>

      <div class="flex items-center gap-2">
        <USelect
          v-model="searchField"
          :options="[
            { label: 'Email', value: 'email' },
            { label: 'Name', value: 'name' },
          ]"
          class="w-28"
        />
        <UInput
          v-model="searchValue"
          placeholder="Search…"
          class="w-64"
          @keydown.enter="onSearch"
        />
        <UButton
          size="sm"
          color="neutral"
          variant="soft"
          :loading="pending"
          @click="onSearch"
        >
          Search
        </UButton>
        <UButton
          size="sm"
          color="neutral"
          variant="ghost"
          :disabled="pending"
          @click="() => { searchValue = ''; load(); }"
        >
          Clear
        </UButton>
      </div>
    </div>

    <p v-if="pending">Loading…</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else class="space-y-2">
      <div
        v-for="u in users"
        :key="u.id"
        class="rounded-xl border border-[var(--border)] p-3 flex items-center gap-3"
      >
        <div class="min-w-0 flex-1">
          <div class="font-medium truncate">
            {{ u.name || u.email || u.id }}
          </div>
          <div class="text-xs opacity-70 truncate">
            {{ u.email }}
            <span v-if="u.role"> • {{ u.role }}</span>
            <span v-if="u.status"> • {{ u.status }}</span>
            <span v-if="u.emailVerified === false"> • email not verified</span>
          </div>
        </div>

        <UButton
          size="sm"
          color="primary"
          variant="soft"
          :to="`/admin/users/${u.id}/sessions`"
        >
          Sessions
        </UButton>
      </div>

      <p v-if="users.length === 0" class="text-sm opacity-70">No users found.</p>
    </div>
  </div>
</template>
