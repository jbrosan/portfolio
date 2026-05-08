<script setup lang="ts">
import { authClient } from "~/utils/auth-client";

definePageMeta({ layout: "admin" });

type SearchField = "email" | "name";
type StatusFilter = "all" | "pending" | "active";

type AdminUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  emailVerified?: boolean | null;
  status?: string | null;
  createdAt?: string | null;
};

const pending = ref(false);
const error = ref<string | null>(null);
const users = ref<AdminUser[]>([]);
const actionUserId = ref<string | null>(null);
const actionError = ref<string | null>(null);

const searchValue = ref("");
const searchField = ref<SearchField>("email");
const statusFilter = ref<StatusFilter>("all");

const searchFieldOptions = [
  { label: "Email", value: "email" },
  { label: "Name", value: "name" },
] satisfies Array<{ label: string; value: SearchField }>;

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
] satisfies Array<{ label: string; value: StatusFilter }>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toOptionalString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function toOptionalBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function normalizeUser(value: unknown): AdminUser | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = value.id;
  if (typeof id !== "string" || id.trim().length === 0) {
    return null;
  }

  return {
    id,
    name: toOptionalString(value.name),
    email: toOptionalString(value.email),
    role: toOptionalString(value.role),
    emailVerified: toOptionalBoolean(value.emailVerified),
    status: toOptionalString(value.status),
    createdAt: toOptionalString(value.createdAt),
  };
}

function normalizeUsers(raw: unknown): AdminUser[] {
  if (Array.isArray(raw)) {
    return raw
      .map(normalizeUser)
      .filter((user): user is AdminUser => user !== null);
  }

  if (!isRecord(raw)) {
    return [];
  }

  const data = raw.data;

  const candidates: unknown[] = [
    isRecord(data) ? data.users : undefined,
    isRecord(data) ? data.items : undefined,
    raw.users,
    raw.items,
    data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
        .map(normalizeUser)
        .filter((user): user is AdminUser => user !== null);
    }
  }

  return [];
}

function getErrorMessage(raw: unknown): string | null {
  if (!isRecord(raw) || !("error" in raw)) {
    return null;
  }

  const err = raw.error;

  if (err == null) {
    return null;
  }

  if (typeof err === "string" && err.trim().length > 0) {
    return err;
  }

  if (isRecord(err) && typeof err.message === "string" && err.message.trim().length > 0) {
    return err.message;
  }

  return null;
}

function getStatusBadgeClasses(status: string | null | undefined): string {
  const normalized = (status ?? "").trim().toLowerCase();

  if (normalized === "pending") {
    return "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200";
  }

  if (normalized === "active") {
    return "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200";
  }

  if (normalized.length === 0) {
    return "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200";
  }

  return "bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-200";
}

function isPendingStatus(status: string | null | undefined): boolean {
  return (status ?? "").trim().toLowerCase() === "pending";
}

async function load() {
  pending.value = true;
  error.value = null;

  try {
    const query: Record<string, string | number | boolean> = {
      limit: 200,
      offset: 0,
    };

    if (searchValue.value.trim().length > 0) {
      query.searchValue = searchValue.value.trim();
      query.searchField = searchField.value;
      query.searchOperator = "contains";
    }

    if (statusFilter.value !== "all") {
      query.filterField = "status";
      query.filterValue = statusFilter.value;
      query.filterOperator = "eq";
    }

    const res = await authClient.admin.listUsers({ query });

    const err = getErrorMessage(res);
    if (err) {
      error.value = err;
      users.value = [];
      return;
    }

    users.value = normalizeUsers(res);
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Failed to load users";
    users.value = [];
  } finally {
    pending.value = false;
  }
}

async function activateUser(userId: string) {
  actionUserId.value = userId;
  actionError.value = null;

  try {
    const res = await authClient.admin.updateUser({
      userId,
      data: {
        status: "active",
      },
    });

    const err = getErrorMessage(res);
    if (err) {
      actionError.value = err;
      return;
    }

    await load();
  } catch (e: unknown) {
    actionError.value = e instanceof Error ? e.message : "Failed to activate user";
  } finally {
    actionUserId.value = null;
  }
}

onMounted(() => {
  void load();
});

function onSearch() {
  void load();
}

function clearFilters() {
  searchValue.value = "";
  searchField.value = "email";
  statusFilter.value = "all";
  void load();
}

function showPendingUsers() {
  statusFilter.value = "pending";
  void load();
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold">
        Users
      </h1>

      <div class="flex flex-wrap items-center gap-2">
        <USelect
          v-model="searchField"
          :items="searchFieldOptions"
          option-attribute="label"
          value-attribute="value"
          class="w-32"
        />

        <UInput
          v-model="searchValue"
          placeholder="Search users…"
          class="w-64"
          @keydown.enter="onSearch"
        />

        <USelect
          v-model="statusFilter"
          :items="statusFilterOptions"
          option-attribute="label"
          value-attribute="value"
          class="w-40"
        />

        <UButton
          size="sm"
          color="primary"
          :loading="pending"
          @click="onSearch"
        >
          Search
        </UButton>

        <UButton
          size="sm"
          color="neutral"
          variant="soft"
          :disabled="pending"
          @click="clearFilters"
        >
          Clear
        </UButton>

        <UButton
          size="sm"
          color="warning"
          variant="soft"
          :disabled="pending"
          @click="showPendingUsers"
        >
          Pending Users
        </UButton>
      </div>
    </div>

    <p v-if="pending">
      Loading…
    </p>

    <p
      v-else-if="error"
      class="text-red-600"
    >
      {{ error }}
    </p>

    <p
      v-if="actionError"
      class="text-red-600"
    >
      {{ actionError }}
    </p>

    <div
      v-if="!pending && !error"
      class="space-y-2"
    >
      <p class="text-sm opacity-70">
        Showing {{ users.length }} user{{ users.length === 1 ? "" : "s" }}
        <span v-if="statusFilter !== 'all'"> • status: {{ statusFilter }}</span>
      </p>

      <div
        v-for="u in users"
        :key="u.id"
        class="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3"
      >
        <div class="min-w-0 flex-1">
          <div class="truncate font-medium">
            {{ u.name || u.email || u.id }}
          </div>

          <div class="truncate text-xs opacity-70">
            {{ u.email || "No email" }}
            <span v-if="u.role"> • {{ u.role }}</span>
            <span v-if="u.emailVerified === false"> • email not verified</span>
          </div>
        </div>

        <div class="flex w-28 shrink-0 items-center justify-center">
          <span
            :class="getStatusBadgeClasses(u.status)"
            class="inline-flex items-center justify-center rounded-full px-3 py-1 text-center text-xs font-medium"
          >
            {{ u.status || "unknown" }}
          </span>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <UButton
            v-if="isPendingStatus(u.status)"
            size="sm"
            color="success"
            variant="soft"
            :loading="actionUserId === u.id"
            :disabled="actionUserId !== null"
            @click="activateUser(u.id)"
          >
            Activate
          </UButton>

          <UButton
            size="sm"
            color="primary"
            variant="soft"
            :to="`/admin/users/${u.id}/sessions`"
          >
            Sessions
          </UButton>
        </div>
      </div>

      <p
        v-if="users.length === 0"
        class="text-sm opacity-70"
      >
        No users found.
      </p>
    </div>
  </div>
</template>