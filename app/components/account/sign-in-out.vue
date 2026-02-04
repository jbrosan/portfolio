<script setup lang="ts">
import { authClient } from "~/utils/auth-client";
import { useAuthState } from "~/composables/use-auth-state";

const { isAuthed, refreshMe, pending } = useAuthState();

// always sync when the header appears
onMounted(async () => {
  await refreshMe();
});

async function handleAuthClick() {
  if (isAuthed.value) {
    try {
      await authClient.signOut();
      await refreshMe();
      await navigateTo("/");
    } finally {
      // pending is managed by refreshMe()
    }
    return;
  }

  await navigateTo("/auth/sign-in");
}
</script>

<template>
  <UButton
    :loading="pending"
    color="neutral"
    variant="ghost"
    @click="handleAuthClick"
  >
    {{ isAuthed ? "Sign out" : "Sign in" }}
  </UButton>
</template>
