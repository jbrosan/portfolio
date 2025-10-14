// server/db/client.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import env from "../../app/utils/env";
import * as schema from "./schema/index";

// Minimal runtime-config shim so this file works both in Nuxt and in CLI
type RuntimeCfg = { databaseUrl?: string };
function getRuntimeConfig(): RuntimeCfg {
  // ts-expect-error - in Nuxt/Nitro, this exists at runtime
  if (typeof useRuntimeConfig === "function") {
    // ts-expect-error
    return useRuntimeConfig();
  }
  // esling-u
  return { databaseUrl: env.DATABASE_URL };
}

let _pool: Pool | undefined = (globalThis as any).__appPgPool;
if (!_pool) {
  const { databaseUrl } = getRuntimeConfig();
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL (or runtimeConfig.databaseUrl) is not set. "
      + "Set DATABASE_URL for CLI, or configure runtimeConfig.databaseUrl for Nuxt.",
    );
  }
  _pool = new Pool({ connectionString: databaseUrl });
  (globalThis as any).__appPgPool = _pool;
}

export const pool = _pool!;
export const db = drizzle(pool, { schema });
