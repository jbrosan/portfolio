<script setup lang="ts">
import type { SessionRow } from "@/composables/use-sessions";

import { useSessions } from "@/composables/use-sessions";

const toast = useToast();
const { sessions, load, revoke, revokeOthers, pending, error } = useSessions();

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
  if (e) {
    toast.add({
      title: "Session error",
      description: (e as Error)?.message ?? String(e),
      color: "error",
    });
  }
});

async function handleRevoke(token: string) {
  try {
    await revoke(token);
    toast.add({ title: "Session revoked", color: "success" });
  }
  catch (e: unknown) {
    toast.add({ title: "Revoke failed", description: String(e), color: "error" });
  }
}

async function handleRevokeOthers() {
  try {
    await revokeOthers();
    toast.add({ title: "Other sessions revoked", color: "success" });
  }
  catch (e: unknown) {
    toast.add({ title: "Revoke failed", description: String(e), color: "error" });
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-sm text-muted-foreground">
        Manage your active login sessions.
      </p>
      <UButton variant="soft" @click="handleRevokeOthers">
        Sign out of other sessions
      </UButton>
    </div>

    <!-- Let UTable infer columns from data; avoids strict TableColumn typing issues -->
    <UTable :rows="sessions" :loading="pending">
      <!-- createdAt -->
      <template #cell-createdAt="{ row }">
        <span>{{ new Date((row as unknown as SessionRow).createdAt).toLocaleString() }}</span>
      </template>

      <!-- lastActiveAt -->
      <template #cell-lastActiveAt="{ row }">
        <span>{{ new Date((row as unknown as SessionRow).lastActiveAt).toLocaleString() }}</span>
      </template>

      <!-- current -->
      <template #cell-current="{ row }">
        <UBadge :color="(row as unknown as SessionRow).current ? 'success' : 'neutral'">
          {{ (row as unknown as SessionRow).current ? 'This device' : '—' }}
        </UBadge>
      </template>

      <!-- actions -->
      <template #cell-actions="{ row }">
        <UButton
          v-if="!(row as unknown as SessionRow).current"
          size="xs"
          variant="ghost"
          @click="handleRevoke((row as unknown as SessionRow).token)"
        >
          Revoke
        </UButton>
      </template>
    </UTable>
  </div>
</template>
