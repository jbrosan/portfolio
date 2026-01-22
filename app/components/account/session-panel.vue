<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

import type { SessionRow } from "@/composables/use-sessions";

import { useSessions } from "@/composables/use-sessions";
import { authClient } from "@/utils/auth-client";

const toast = useToast();
const { sessions, load, revoke, revokeOthers, pending, error, currentSession } = useSessions();

const columns: TableColumn<SessionRow>[] = [
  { accessorKey: "createdAt", header: "Created" },
  { accessorKey: "lastActiveAt", header: "Last Active" },
  { accessorKey: "userAgent", header: "User Agent" },
  { accessorKey: "ipAddress", header: "IP" },
  { accessorKey: "current", header: "Current" },
  { id: "actions", header: "Actions" },
];

const hasOtherSessions = computed(() =>
  sessions.value.some(s => !s.current),
);

onMounted(async () => {
  try {
    await load();
  }
  catch (e: unknown) {
    toast.add({
      title: "Failed to load sessions",
      description: (e as Error)?.message ?? String(e),
      color: "error",
    });
  }
});

watch(error, (e) => {
  if (!e)
    return;
  toast.add({
    title: "Session error",
    description: (e as Error)?.message ?? String(e),
    color: "error",
  });
});

async function handleRevoke(token: string) {
  try {
    await revoke(token);
    toast.add({ title: "Session revoked", color: "success" });
  }
  catch (e: unknown) {
    toast.add({
      title: "Revoke failed",
      description: (e as Error)?.message ?? String(e),
      color: "error",
    });
  }
}

async function handleRevokeOthers() {
  try {
    await revokeOthers();
    toast.add({ title: "Signed out of other sessions", color: "success" });
  }
  catch (e: unknown) {
    toast.add({
      title: "Sign out failed",
      description: (e as Error)?.message ?? String(e),
      color: "error",
    });
  }
}

async function handleSignOutHere() {
  try {
    await authClient.signOut();
    await navigateTo("/auth/sign-in");
  }
  catch (e: unknown) {
    toast.add({
      title: "Sign out failed",
      description: (e as Error)?.message ?? String(e),
      color: "error",
    });
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-muted-foreground">
        Manage your active login sessions.
      </p>

      <div class="flex flex-wrap items-center gap-2">
        <UButton
          variant="soft"
          :disabled="!hasOtherSessions || pending"
          @click="handleRevokeOthers"
        >
          Sign out of other sessions
        </UButton>

        <UButton
          color="neutral"
          variant="ghost"
          :disabled="pending || !currentSession"
          @click="handleSignOutHere"
        >
          Sign out
        </UButton>
      </div>
    </div>

    <UTable
      :data="sessions"
      :columns="columns"
      :loading="pending"
    >
      <template #createdAt-cell="{ row }">
        {{ new Date(row.original.createdAt).toLocaleString() }}
      </template>

      <template #lastActiveAt-cell="{ row }">
        {{ new Date(row.original.lastActiveAt).toLocaleString() }}
      </template>

      <template #current-cell="{ row }">
        <UBadge :color="row.original.current ? 'success' : 'neutral'">
          {{ row.original.current ? "This device" : "—" }}
        </UBadge>
      </template>

      <template #actions-cell="{ row }">
        <UButton
          v-if="!row.original.current"
          size="xs"
          variant="ghost"
          :disabled="pending"
          @click="handleRevoke(row.original.token)"
        >
          Revoke
        </UButton>

        <span v-else class="text-sm text-muted-foreground">—</span>
      </template>
    </UTable>
  </div>
</template>
