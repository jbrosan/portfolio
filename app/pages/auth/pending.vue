<script setup lang="ts">
definePageMeta({
  layout: false,
  title: "Pending approval",
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UPageCard class="max-w-md w-full text-center space-y-4">
      <h1 class="text-xl font-semibold">Account pending approval</h1>

      <p class="text-sm text-neutral-600">
        Your email has been verified, but your account has not yet been approved.
      </p>

      <p class="text-sm text-neutral-600">
        Once approved by the site owner, you’ll have full access.
      </p>

      <UButton to="/" variant="ghost">
        Back to homepage
      </UButton>
    </UPageCard>
  </div>
</template>
