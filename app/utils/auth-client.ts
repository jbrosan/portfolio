// app/utils/auth-client.ts
import { adminClient, multiSessionClient } from "better-auth/client/plugins";
import { multiSession } from "better-auth/plugins";
import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    multiSessionClient(),
  ],
});
