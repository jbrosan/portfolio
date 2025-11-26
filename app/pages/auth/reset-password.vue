<!-- app/pages/auth/reset-password.vue -->
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";

import { computed, ref } from "vue";
import * as z from "zod";

import { authClient } from "@/utils/auth-client";

definePageMeta({
  layout: false,
  title: "Reset password",
});

const toast = useToast();
const route = useRoute();
const router = useRouter();

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password must be at most 128 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine(
    values => values.password === values.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    },
  );

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const state = ref<ResetPasswordForm>({
  password: "",
  confirmPassword: "",
});

const pending = ref(false);

const token = computed(() => {
  const raw = route.query.token;
  return typeof raw === "string" && raw.length > 0 ? raw : undefined;
});

const tokenError = computed(() => {
  const rawError = route.query.error;
  const error
    = typeof rawError === "string" ? rawError.toLowerCase() : undefined;

  if (error === "invalid_token") {
    return "This reset link is invalid or has expired. Please request a new one.";
  }

  if (!token.value) {
    return "Missing reset token. Please use the link from your email or request a new one.";
  }

  return null;
});

// Nuxt UI expects: (state) => FormError<string>[]
function validate(values: ResetPasswordForm): FormError<string>[] {
  const result = resetPasswordSchema.safeParse(values);
  if (result.success)
    return [];

  // Your FormError<string> type doesn't have `path`, so we only set `message`.
  return result.error.issues.map(issue => ({
    message: issue.message,
  } as FormError<string>));
}

async function onSubmit(event: FormSubmitEvent<ResetPasswordForm>) {
  if (!token.value) {
    toast.add({
      color: "error",
      title: "Missing reset token",
      description:
        "The reset link is invalid or incomplete. Please request a new reset email.",
    });
    return;
  }

  const parsed = resetPasswordSchema.safeParse(event.data);
  if (!parsed.success) {
    // UForm will display messages from `validate`
    return;
  }

  pending.value = true;

  const { error } = await authClient.resetPassword({
    newPassword: parsed.data.password,
    token: token.value,
  });

  pending.value = false;

  if (error) {
    toast.add({
      color: "error",
      title: "Unable to reset password",
      description: error.message ?? "Something went wrong. Please try again.",
    });
    return;
  }

  toast.add({
    color: "success",
    title: "Password updated",
    description: "You can now sign in with your new password.",
  });

  // Adjust to "/auth/sign-in" if that's your route
  await router.push("/auth/sign-in");
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-950">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="space-y-1">
          <h1 class="text-lg font-semibold">
            Reset your password
          </h1>
          <p class="text-sm text-gray-500">
            Enter a new password for your account.
          </p>
        </div>
      </template>

      <div v-if="tokenError">
        <UAlert
          color="error"
          variant="subtle"
          :title="tokenError"
        />
        <div class="mt-4 flex justify-end">
          <UButton to="/auth/forgot-password" color="primary">
            Request new reset link
          </UButton>
        </div>
      </div>

      <UForm
        v-else
        :state="state"
        :validate="validate"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup
          label="New password"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            autocomplete="new-password"
          />
        </UFormGroup>

        <UFormGroup
          label="Confirm new password"
          name="confirmPassword"
        >
          <UInput
            v-model="state.confirmPassword"
            type="password"
            autocomplete="new-password"
          />
        </UFormGroup>

        <div class="mt-6 flex justify-end gap-2">
          <UButton
            to="/auth/sign-in"
            variant="ghost"
          >
            Back to sign in
          </UButton>

          <UButton
            type="submit"
            color="primary"
            :loading="pending"
          >
            Reset password
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
