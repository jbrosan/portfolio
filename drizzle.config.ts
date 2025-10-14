import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import env from "./app/utils/env";

const host = env.DB_HOST ?? "127.0.0.1";
const port = Number(env.DB_PORT ?? 5432);
const user = env.DB_USER ?? "postgres";
const password = env.DB_PASSWORD ?? "";
const database = env.DB_DATABASE ?? "postgres";

const url
  = env.DATABASE_URL
    ?? `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;

if (!url) {
  throw new Error("Database credentials are missing. Check your .env.");
}

export default defineConfig({
  schema: "./server/db/schema/index.ts",
  out: "./server/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  casing: "snake_case",
  strict: true,
  verbose: true,
  migrations: { prefix: "index" },
  tables: {
    default: {
      columns: {
        casing: "snake",
      },
    },
  },
});
