<script setup lang="ts">
definePageMeta({
  layout: false,
  title: "Verify your email",
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UPageCard class="max-w-md w-full text-center space-y-4">
      <h1 class="text-xl font-semibold">Verify your email</h1>

      <p class="text-sm text-neutral-600">
        You need to verify your email address before accessing the site.
      </p>

      <p class="text-sm text-neutral-600">
        Please check your inbox for a verification link.
      </p>

      <UButton to="/auth/sign-in" variant="outline">
        Back to sign in
      </UButton>
    </UPageCard>
  </div>
</template>
