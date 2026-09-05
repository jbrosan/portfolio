import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const globalForDb = globalThis as typeof globalThis & {
  portfolioPgPool?: Pool;
};

const pool =
  globalForDb.portfolioPgPool ??
  new Pool({
    connectionString: databaseUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.portfolioPgPool = pool;
}

export const db = drizzle(pool, { schema });
