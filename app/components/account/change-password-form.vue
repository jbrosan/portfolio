<script setup lang="ts">
import { z } from "zod";

const schema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(12, "Use at least 12 characters"),
  confirm: z.string().min(12),
  revokeOtherSessions: z.boolean().optional().default(true),
}).refine(v => v.newPassword === v.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

type Values = z.infer<typeof schema>;

const state = reactive<Values>({
  currentPassword: "",
  newPassword: "",
  confirm: "",
  revokeOtherSessions: true,
});

const toast = useToast();
const { mutate, pending } = useChangePassword();

async function onSubmit() {
  const parsed = schema.safeParse(state);
  if (!parsed.success) {
    toast.add({ title: "Fix validation errors", color: "warning" });
    return;
  }

  try {
    await mutate({
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
      revokeOtherSessions: parsed.data.revokeOtherSessions,
    });
    toast.add({ title: "Password updated", color: "success" });
    state.currentPassword = "";
    state.newPassword = "";
    state.confirm = "";
  }
  catch (err: unknown) {
    toast.add({
      title: "Password change failed",
      description: (err as Error)?.message ?? String(err),
      color: "error",
    });
  }
}
</script>

<template>
  <UForm
    :state="state"
    class="space-y-6"
    @submit.prevent="onSubmit"
  >
    <UFormField label="Current password" name="currentPassword">
      <UInput
        v-model="state.currentPassword"
        type="password"
        autocomplete="current-password"
      />
    </UFormField>

    <UFormField
      label="New password"
      name="newPassword"
      hint="Use a long, unique passphrase"
    >
      <UInput
        v-model="state.newPassword"
        type="password"
        autocomplete="new-password"
      />
    </UFormField>

    <UFormField label="Confirm new password" name="confirm">
      <UInput
        v-model="state.confirm"
        type="password"
        autocomplete="new-password"
      />
    </UFormField>

    <UFormField name="revokeOtherSessions">
      <div class="flex items-center gap-3">
        <UCheckbox v-model="state.revokeOtherSessions" />
        <span class="text-sm">Sign out of my other sessions</span>
      </div>
    </UFormField>

    <UButton type="submit" :loading="pending">
      Update password
    </UButton>
  </UForm>
</template>
