// server/db/client.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema/index";

let _pool: Pool | undefined = (globalThis as any).__appPgPool;
if (!_pool) {
  const cfg = useRuntimeConfig();
  _pool = new Pool({ connectionString: cfg.databaseUrl })
  ; (globalThis as any).__appPgPool = _pool;
}

export const pool = _pool!;
export const db = drizzle(pool, {
  schema,
});
