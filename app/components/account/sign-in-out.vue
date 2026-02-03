<script setup lang="ts">
import { authClient } from "~/utils/auth-client";
import { useAuthMe } from "~/composables/use-auth-me";

const loading = ref(false);

const { data: me, refresh } = await useAuthMe();

const isAuthed = computed(() => Boolean(me.value?.user?.id));

async function handleAuthClick() {
  if (isAuthed.value) {
    loading.value = true;
    try {
      await authClient.signOut();
      await refresh(); // ✅ update header immediately
      await navigateTo("/");
    } finally {
      loading.value = false;
    }
    return;
  }

  await navigateTo("/auth/sign-in");
}
</script>

<template>
  <UButton
    :loading="loading"
    color="neutral"
    variant="ghost"
    @click="handleAuthClick"
  >
    {{ isAuthed ? "Sign out" : "Sign in" }}
  </UButton>
</template>
