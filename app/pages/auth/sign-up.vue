<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";

import * as z from "zod";

import { authClient } from "@/utils/auth-client";

definePageMeta({ layout: false });

const toast = useToast();

const fields = ref<AuthFormField[]>([
  { name: "name", label: "Full name", type: "text", placeholder: "Ada Lovelace", required: true },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
  { name: "password", label: "Password", type: "password", placeholder: "At least 8 characters", required: true },
]);

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Valid email required"),
  password: z.string().min(8, "Must be at least 8 characters"),
});
type Schema = z.output<typeof schema>;

const pending = ref(false);
const errorMsg = ref<string | null>(null);

async function onSubmit(ev: FormSubmitEvent<Schema>) {
  errorMsg.value = null;
  const parsed = schema.safeParse(ev.data);
  if (!parsed.success) {
    errorMsg.value = parsed.error.issues[0]?.message ?? "Invalid input";
    return;
  }

  pending.value = true;
  const { error } = await authClient.signUp.email({
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password,
    callbackURL: "/auth/verify-email",
  });
  pending.value = false;

  if (error) {
    errorMsg.value = error.message ?? "Sign up failed";
    return;
  }

  toast.add({
    color: "success",
    title: "Check your email",
    description: "We sent you a verification link. You’ll need it to continue.",
  });

  await navigateTo("/auth/verify-email");
}

function oauth(provider: "google" | "facebook") {
  return authClient.signIn.social({
    provider,
    callbackURL: "/",
    errorCallbackURL: "/auth/login?oauth=error",
  });
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Create account"
        description="It only takes a moment."
        icon="i-lucide-user-plus"
        :fields="fields"
        class="max-w-md"
        :loading="pending"
        @submit="onSubmit"
      />
      <p v-if="errorMsg" class="mt-2 text-sm text-red-600">
        {{ errorMsg }}
      </p>

      <!-- Divider -->
      <div class="my-6 flex items-center gap-3">
        <div class="h-px bg-neutral-200 w-full" />
        <span class="text-xs text-neutral-500">or</span>
        <div class="h-px bg-neutral-200 w-full" />
      </div>

      <!-- Custom provider buttons with perfect alignment -->
      <!-- Replace just the social buttons block -->
      <div class="grid gap-3">
        <UButton
          variant="outline"
          color="neutral"
          size="lg"
          class="w-full justify-center"
          @click="() => { toast.add({ title: 'Google', description: 'Continue with Google' }); oauth('google'); }"
        >
          <span class="grid w-full grid-cols-[1.25rem_1fr_1.25rem] items-center gap-3">
            <UIcon name="i-simple-icons-google" class="w-5 h-5 justify-self-start shrink-0" />
            <span class="text-center">Continue with Google</span>
            <span class="w-5 h-5 justify-self-end" aria-hidden="true" />
          </span>
        </UButton>

        <UButton
          variant="outline"
          color="neutral"
          size="lg"
          class="w-full justify-center"
          @click="() => { toast.add({ title: 'Facebook', description: 'Continue with Facebook' }); oauth('facebook'); }"
        >
          <span class="grid w-full grid-cols-[1.25rem_1fr_1.25rem] items-center gap-3">
            <UIcon name="i-simple-icons-facebook" class="w-5 h-5 justify-self-start shrink-0" />
            <span class="text-center">Continue with Facebook</span>
            <span class="w-5 h-5 justify-self-end" aria-hidden="true" />
          </span>
        </UButton>
      </div>

      <p class="mt-6 text-sm text-neutral-600 text-center">
        Already have an account?
        <NuxtLink to="/auth/sign-in" class="font-medium underline underline-offset-4">
          Sign in
        </NuxtLink>
      </p>
    </UPageCard>
  </div>
</template>

<style scoped>
/* 3-column grid: [icon | centered label | spacer] */
.social-btn {
  display: grid;
  grid-template-columns: 1.25rem 1fr 1.25rem; /* keep these equal for perfect balance */
  align-items: center;
  width: 100%;
  gap: 0.75rem; /* equals Tailwind gap-3 */
}
/* Force identical icon box so different logos occupy same space */
.icon {
  display: inline-block;
  width: 1.25rem; /* 20px */
  height: 1.25rem; /* 20px */
  justify-self: start;
}
/* Center the label in the middle column */
.label {
  text-align: center;
  justify-self: center;
}
/* Right-side spacer matches icon width to keep label centered */
.spacer {
  width: 1.25rem;
  height: 1.25rem;
  justify-self: end;
}
</style>
