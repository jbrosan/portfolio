<script setup lang="ts">
import { authClient } from "~/utils/auth-client";

const loading = ref(true);
const { data: session } = await authClient.useSession(useFetch);
loading.value = false;

const handleAuthClick = async () => {
  if (session.value) {
    loading.value = true;
    try {
      await authClient.signOut();
      await navigateTo("/");
    } finally {
      loading.value = false;
    }
    return;
  }

  await navigateTo("/auth/sign-in");
};
</script>

<template>
  <UButton
    :loading="loading"
    color="neutral"
    variant="ghost"
    @click="handleAuthClick"
  >
    {{ session ? "Sign out" : "Sign in" }}
  </UButton>
</template>
