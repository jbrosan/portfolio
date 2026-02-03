<!-- app/pages/auth/forgot-password.vue -->
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import { ref } from "vue";
import * as z from "zod";

import { authClient } from "@/utils/auth-client";

definePageMeta({
  layout: false,
  title: "Forgot password",
});

const toast = useToast();

const schema = z.object({
  email: z.email("Enter a valid email address"),
});

type ForgotPasswordForm = z.infer<typeof schema>;

const state = ref<ForgotPasswordForm>({
  email: "",
});

const pending = ref(false);

function validate(values: ForgotPasswordForm): FormError<string>[] {
  const result = schema.safeParse(values);
  if (result.success) return [];
  return result.error.issues.map(issue => ({ message: issue.message } as FormError<string>));
}

async function onSubmit(event: FormSubmitEvent<ForgotPasswordForm>) {
  const parsed = schema.safeParse(event.data);
  if (!parsed.success) return;

  pending.value = true;

  // Build absolute URL to the reset page (Better-Auth typically wants absolute)
  const origin = window.location.origin;
  const redirectTo = `${origin}/auth/reset-password`;

  const { error } = await authClient.requestPasswordReset({
    email: parsed.data.email,
    redirectTo,
  });

  pending.value = false;

  // Show a generic message (avoid account enumeration)
  toast.add({
    color: error ? "warning" : "success",
    title: "Check your email",
    description:
      "If an account exists for that email, you’ll receive a reset link shortly.",
  });

  // Clear email field on submit
  state.value.email = "";
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-950">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="space-y-1">
          <h1 class="text-lg font-semibold">Forgot your password?</h1>
          <p class="text-sm text-gray-500">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>
      </template>

      <UForm
        :state="state"
        :validate="validate"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            type="email"
            autocomplete="email"
            inputmode="email"
            placeholder="you@example.com"
          />
        </UFormField>

        <div class="mt-6 flex justify-end gap-2">
          <UButton to="/auth/sign-in" variant="ghost">
            Back to sign in
          </UButton>

          <UButton type="submit" color="primary" :loading="pending">
            Send reset link
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
