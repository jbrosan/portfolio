<!-- /app/pages/auth/signup.vue -->
<script setup lang="ts">
import { z } from "zod";

import { authClient } from "@/utils/auth-client"; // NOTE: if srcDir: 'app', use this path

definePageMeta({ layout: false });

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.email("Valid email required"),
  password: z.string().min(8, "Min 8 characters"),
});

type Form = z.infer<typeof schema>;

const form = reactive<Form>({ name: "", email: "", password: "" });
const pending = ref(false);
const errorMsg = ref<string | null>(null);

async function onSubmit() {
  errorMsg.value = null;
  const parsed = schema.safeParse(form);
  if (!parsed.success) {
    errorMsg.value = parsed.error.issues[0]?.message ?? "Invalid input";
    return;
  }

  pending.value = true;
  const { error } = await authClient.signUp.email({
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password,
    callbackURL: "/",
  });
  pending.value = false;

  if (error) {
    errorMsg.value = error.message ?? "Sign up failed";
    return;
  }

  await navigateTo("/");
}

function oauth(provider: "google" | "facebook"): void {
  void authClient.signIn.social({
    provider,
    callbackURL: "/",
    errorCallbackURL: "/auth/login?oauth=error",
  });
}
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-neutral-50">
    <div class="w-full max-w-sm rounded-2xl bg-white shadow p-6">
      <h1 class="text-2xl font-semibold tracking-tight">
        Create account
      </h1>
      <p class="text-sm text-neutral-500 mt-1">
        It only takes a moment
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium mb-2">Name</label>
          <UInput
            v-model="form.name"
            size="lg"
            placeholder="Ada Lovelace"
          />
        </div>

        <div>
          <label class="block text-sm text-neutral-700 mb-2">Email</label>
          <UInput
            v-model="form.email"
            size="lg"
            type="email"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-sm text-neutral-700 mb-2">Password</label>
          <UInput
            v-model="form.password"
            size="lg"
            type="password"
            placeholder="••••••••"
          />
          <p class="text-xs text-neutral-500 mt-1">
            At least 8 characters.
          </p>
        </div>

        <div v-if="errorMsg" class="text-sm text-red-600">
          {{ errorMsg }}
        </div>

        <UButton
          type="submit"
          size="lg"
          class="w-full"
          :loading="pending"
        >
          Create account
        </UButton>
      </form>

      <div class="my-6 flex items-center gap-3">
        <div class="h-px bg-neutral-200 w-full" />
        <span class="text-xs text-neutral-500">or</span>
        <div class="h-px bg-neutral-200 w-full" />
      </div>

      <div class="grid gap-3">
        <UButton
          variant="outline"
          size="lg"
          class="w-full"
          @click="oauth('google')"
        >
          <span class="i-simple-icons-google mr-2" aria-hidden="true" />
          Continue with Google
        </UButton>

        <UButton
          variant="outline"
          size="lg"
          class="w-full"
          @click="oauth('facebook')"
        >
          <span class="i-simple-icons-facebook mr-2" aria-hidden="true" />
          Continue with Facebook
        </UButton>
      </div>

      <p class="text-sm text-neutral-600 mt-6 text-center">
        Already have an account?
        <NuxtLink to="/auth/login" class="font-medium underline underline-offset-4">
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
