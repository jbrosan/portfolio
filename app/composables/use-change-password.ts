import { z } from "zod";

export const ChangePasswordInput = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(12),
  revokeOtherSessions: z.boolean().optional().default(true),
});
export type ChangePasswordInput = z.infer<typeof ChangePasswordInput>;

type ChangePasswordResult = { ok: true };

export function useChangePassword() {
  const error = shallowRef<Error | null>(null);
  const data = shallowRef<ChangePasswordResult | null>(null);
  const pending = ref(false);

  async function mutate(input: ChangePasswordInput) {
    const body = ChangePasswordInput.parse(input);
    pending.value = true;
    error.value = null;

    const { data: result, error: fetchError } = await useFetch<ChangePasswordResult>(
      "/api/auth/password/change",
      {
        method: "POST",
        body,
        watch: false, // prevent automatic re-fetch on reactive deps
        immediate: true,
      },
    );

    if (fetchError.value) {
      error.value = fetchError.value;
      pending.value = false;
      throw fetchError.value;
    }

    data.value = result.value ?? null;
    pending.value = false;
    return data.value;
  }

  return { mutate, data, error, pending };
}
