<script setup lang="ts">
const toast = useToast();

async function deleteAccount() {
  // Intentionally not implemented: destructive action should be gated (re-auth, email confirm).
  toast.add({ title: "Account deletion flow not implemented yet", color: "warning" });
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-muted-foreground">
      Permanently delete your account and all associated data. This action cannot be undone.
    </p>
    <UAlert
      color="error"
      variant="subtle"
      title="Danger Zone"
      description="Proceed with caution."
    />
    <UButton
      color="error"
      variant="solid"
      @click="deleteAccount"
    >
      Delete account
    </UButton>
  </div>
</template>
