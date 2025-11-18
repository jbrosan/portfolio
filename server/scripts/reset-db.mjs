// server/scripts/reset-db.mjs
/* eslint-disable no-console */
import "dotenv/config";
import pg from "pg";

// eslint-disable-next-line node/no-process-env
const { DATABASE_URL, NODE_ENV, ALLOW_DB_RESET } = process.env;

if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1); // this *is* a real error
}

const isProd = NODE_ENV === "production";
const allowReset = ALLOW_DB_RESET === "true";

// Safety guard: only reset when ALLOW_DB_RESET="true"
// (both in prod and non-prod)
if (!allowReset) {
    console.error(
        `Skipping DB reset: ALLOW_DB_RESET must be "true" (NODE_ENV=${NODE_ENV}, ALLOW_DB_RESET=${ALLOW_DB_RESET})`,
    );
    process.exit(0); // no-op, not an error
}

if (isProd) {
    console.error(
        "⚠ WARNING: Running DB reset in NODE_ENV=\"production\" because ALLOW_DB_RESET=\"true\"",
    );
}
else {
    console.log("⚠ Resetting database schema 'public'…");
}

const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    max: 1,
});

const client = await pool.connect();

try {
    await client.query("BEGIN");

    await client.query(`
    DROP SCHEMA IF EXISTS public CASCADE;
    CREATE SCHEMA public;
  `);

    await client.query(`
    DROP SCHEMA IF EXISTS drizzle CASCADE;
   `);

    await client.query("COMMIT");
    console.log("✔ Database reset complete");
}
catch (err) {
    await client.query("ROLLBACK");
    console.error("✖ Failed to reset database:", err);
    process.exit(1);
}
finally {
    client.release();
    await pool.end();
}
