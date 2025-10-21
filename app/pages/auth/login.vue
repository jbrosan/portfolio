<script setup lang="ts">
import { z } from "zod";

import { authClient } from "@/utils/auth-client";

definePageMeta({ layout: false });

const schema = z.object({
  email: z.email("Valid email required"),
  password: z.string("Password is required").min(8, "Must be at least 8 characters"),

});

const form = reactive({ email: "", password: "" });
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
  const { error } = await authClient.signIn.email({
    email: parsed.data.email,
    password: parsed.data.password,
    // optional redirect after email verification flows
    callbackURL: "/",
  });
  pending.value = false;

  if (error) {
    errorMsg.value = error.message ?? "Login failed";
    return;
  }
  await navigateTo("/"); // post-login route
}

function oauth(provider: "google" | "facebook") {
  // Redirect-based; Better-Auth manages the flow + cookies
  return authClient.signIn.social({
    provider,
    callbackURL: "/", // where to land after success
    errorCallbackURL: "/auth/login?oauth=error",
  });
}
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-neutral-50">
    <div class="w-full max-w-sm rounded-2xl bg-white shadow p-6">
      <h1 class="text-2xl font-semibold tracking-tight">
        Welcome back
      </h1>
      <p class="text-sm text-neutral-500 mt-1">
        Sign in to your account
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium mb-2">Email</label>
          <UInput
            v-model="form.email"
            size="lg"
            type="email"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Password</label>
          <UInput
            v-model="form.password"
            size="lg"
            type="password"
            placeholder="••••••••"
          />
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
          Sign in
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
        Don’t have an account?
        <NuxtLink to="/auth/signup" class="font-medium underline underline-offset-4">
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
