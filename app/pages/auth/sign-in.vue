<script setup lang="ts">
import type { AuthFormField, ButtonProps, FormSubmitEvent } from "@nuxt/ui";

import * as z from "zod";

import { authClient } from "@/utils/auth-client";

definePageMeta({ layout: false });

const toast = useToast();

const fields = ref<AuthFormField[]>([{
  name: "email",
  type: "email",
  label: "Email",
  placeholder: "Enter your email",
  required: true,
}, {
  name: "password",
  label: "Password",
  type: "password",
  placeholder: "Enter your password",
  required: true,
}, {
  name: "remember",
  label: "Remember me",
  type: "checkbox",
}]);

const providers = ref<ButtonProps[]>([{
  label: "Google",
  icon: "i-simple-icons-google",
  color: "neutral",
  variant: "outline",
  onClick: () => {
    toast.add({ title: "Google", description: "Login with Google" });
    oauth("google");
  },
}, {
  label: "Facebook",
  icon: "i-simple-icons-facebook",
  color: "neutral",
  variant: "outline",
  onClick: () => {
    toast.add({ title: "Facebook", description: "Login with Facebook" });
    oauth("facebook");
  },
}]);

const schema = z.object({
  email: z.email("Valid email required"),
  password: z.string("Password is required").min(8, "Must be at least 8 characters"),

});

type Schema = z.output<typeof schema>;

const pending = ref(false);
const errorMsg = ref<string | null>(null);

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
    callbackURL: "/",
  });
  pending.value = false;

  if (error) {
    errorMsg.value = error.message ?? "Login failed";
    return;
  }
  await navigateTo("/");
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
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        :providers="providers"
        class="max-w-md"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>
