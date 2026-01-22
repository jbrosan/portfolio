<!-- /app/pages/auth/sign-in.vue -->
<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import { authClient } from "@/utils/auth-client";

definePageMeta({ layout: false });

const toast = useToast();
const route = useRoute();

const fields = ref<AuthFormField[]>([
  { name: "email", type: "email", label: "Email", placeholder: "Enter your email", required: true },
  { name: "password", label: "Password", type: "password", placeholder: "Enter your password", required: true },
  { name: "remember", label: "Remember me", type: "checkbox" },
]);

const schema = z.object({
  email: z.email("Valid email required"),
  password: z.string("Password is required").min(8, "Must be at least 8 characters"),
});
type Schema = z.output<typeof schema>;

const pending = ref(false);
const errorMsg = ref<string | null>(null);

/**
 * Only allow local, same-site paths to prevent open-redirects.
 */
function getSafeNext(): string {
  const q = route.query.next;
  if (typeof q !== "string") return "/";

  // must be a relative path like "/account"
  if (!q.startsWith("/")) return "/";
  // block protocol-relative "//evil.com"
  if (q.startsWith("//")) return "/";

  return q;
}

const nextPath = computed(() => getSafeNext());

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  errorMsg.value = null;

  const parsed = schema.safeParse(payload.data);
  if (!parsed.success) {
    errorMsg.value = parsed.error.issues[0]?.message ?? "Invalid input";
    return;
  }

  pending.value = true;
  const { error } = await authClient.signIn.email({
    email: parsed.data.email,
    password: parsed.data.password,
    callbackURL: nextPath.value, // ✅ use next
  });
  pending.value = false;

  if (error) {
    errorMsg.value = error.message ?? "Login failed";
    return;
  }

  // ✅ After successful login, go where the user intended
  await navigateTo(nextPath.value);
}

function oauth(provider: "google" | "facebook") {
  return authClient.signIn.social({
    provider,
    callbackURL: nextPath.value, // ✅ use next
    errorCallbackURL: `/auth/sign-in?oauth=error&next=${encodeURIComponent(nextPath.value)}`,
  });
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Sign In"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        class="max-w-md"
        :loading="pending"
        @submit="onSubmit"
      />

      <p v-if="errorMsg" class="mt-2 text-sm text-red-600">
        {{ errorMsg }}
      </p>

      <div class="my-6 flex items-center gap-3">
        <div class="h-px bg-neutral-200 w-full" />
        <span class="text-xs text-neutral-500">or</span>
        <div class="h-px bg-neutral-200 w-full" />
      </div>

      <div class="grid gap-3">
        <UButton
          variant="outline"
          color="neutral"
          size="lg"
          class="w-full justify-center"
          @click="() => { toast.add({ title: 'Google', description: 'Login with Google' }); oauth('google'); }"
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
          @click="() => { toast.add({ title: 'Facebook', description: 'Login with Facebook' }); oauth('facebook'); }"
        >
          <span class="grid w-full grid-cols-[1.25rem_1fr_1.25rem] items-center gap-3">
            <UIcon name="i-simple-icons-facebook" class="w-5 h-5 justify-self-start shrink-0" />
            <span class="text-center">Continue with Facebook</span>
            <span class="w-5 h-5 justify-self-end" aria-hidden="true" />
          </span>
        </UButton>
      </div>

      <p class="mt-6 text-sm text-neutral-600 text-center">
        Don't have and account?
        <NuxtLink to="/auth/sign-up" class="font-medium underline underline-offset-4">
          Sign up
        </NuxtLink>
      </p>
    </UPageCard>
  </div>
</template>
