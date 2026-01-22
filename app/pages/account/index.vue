<script setup lang="ts">
import { computed, ref } from "vue";

import auth from "@/middleware/auth"

import ChangePasswordForm from "@/components/account/change-password-form.vue";
import DangerZone from "@/components/account/danger-zone.vue";
import ProfileForm from "@/components/account/profile-form.vue";
import SessionsPanel from "@/components/account/session-panel.vue";

definePageMeta({ layout: "default", title: "Account Settings", middleware:[auth] });

const tabs = [
  { value: "profile", label: "Profile" },
  { value: "security", label: "Security" },
  { value: "sessions", label: "Sessions" },
  { value: "danger", label: "Danger Zone" },
];

const route = useRoute();
const router = useRouter();

const active = ref<string>((route.query.tab as string) || "profile");
watch(active, v => router.replace({ query: { tab: v } }));

const current = computed(() => active.value);
</script>

<template>
  <UContainer class="py-8">
    <UPageHeader
      title="Account Settings"
      description="Manage your profile, security, and sessions."
    />

    <UTabs
      v-model="active"
      :items="tabs"
      :content="false"
      class="mt-6"
    />

    <div class="mt-6">
      <UCard v-if="current === 'profile'">
        <template #header>
          Profile
        </template>
        <ProfileForm />
      </UCard>

      <UCard v-else-if="current === 'security'">
        <template #header>
          Security
        </template>
        <ChangePasswordForm class="mb-8" />
      </UCard>

      <UCard v-else-if="current === 'sessions'">
        <template #header>
          Sessions
        </template>
        <SessionsPanel />
      </UCard>

      <UCard v-else-if="current === 'danger'">
        <template #header>
          Danger Zone
        </template>
        <DangerZone />
      </UCard>
    </div>
  </UContainer>
</template>
