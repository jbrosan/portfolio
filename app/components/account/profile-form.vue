<script setup lang="ts">
import { z } from "zod";

// Zod v4 schema (keeps empty string allowed for URL)
const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  imageUrl: z.url("Must be a valid URL").optional().or(z.literal("").transform(() => undefined)),
  timezone: z.string().min(1, "Select a timezone"),
});
type ProfileValues = z.infer<typeof profileSchema>;

// Type the /api/session/me shape (adjust if your route returns more)
type MeResponse = {
  user?: {
    id?: string;
    name?: string | null;
    image?: string | null;
    timezone?: string | null;
  };
};

const state = reactive<ProfileValues>({
  name: "",
  imageUrl: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
});

const loading = ref(false);
const toast = useToast();

onMounted(async () => {
  // Idiomatic useFetch with a generic & default to avoid {} type
  const { data } = await useFetch<MeResponse>("/api/session/me", {
    default: () => ({} as MeResponse),
    // no need to watch anything here; one-time fetch on mount
    watch: false,
  });
  const me = data.value?.user;
  if (me) {
    state.name = me.name ?? "";
    state.imageUrl = me.image ?? "";
    state.timezone = me.timezone ?? state.timezone;
  }
});

async function onSubmit() {
  const parsed = profileSchema.safeParse(state);
  if (!parsed.success) {
    toast.add({ title: "Fix validation errors", color: "warning" });
    return;
  }

  try {
    loading.value = true;
    // Mutation-style useFetch (idiomatic Nuxt), not $fetch
    const { error } = await useFetch("/api/account/profile", {
      method: "POST",
      body: parsed.data,
      watch: false,
      immediate: true,
    });
    if (error.value)
      throw error.value;

    toast.add({ title: "Profile updated", color: "success" });
  }
  catch (e: unknown) {
    toast.add({
      title: "Update failed",
      description: (e as Error)?.message ?? String(e),
      color: "error",
    });
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <UForm
    :state="state"
    class="space-y-6"
    @submit.prevent="onSubmit"
  >
    <UFormField label="Full Name" name="name">
      <UInput v-model="state.name" placeholder="Your name" />
    </UFormField>

    <UFormField
      label="Avatar URL"
      name="imageUrl"
      hint="Publicly accessible image URL"
    >
      <UInput v-model="state.imageUrl" placeholder="https://…" />
    </UFormField>

    <UFormField label="Timezone" name="timezone">
      <USelect
        v-model="state.timezone"
        :options="[
          'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
          'Europe/London', 'Europe/Berlin', 'Asia/Tokyo', 'Australia/Sydney',
        ]"
      />
    </UFormField>

    <div class="flex gap-3">
      <UButton type="submit" :loading="loading">
        Save changes
      </UButton>
      <UButton variant="soft" @click="$router.go(-1)">
        Cancel
      </UButton>
    </div>
  </UForm>
</template>
