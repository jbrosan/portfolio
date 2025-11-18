// server/scripts/reset-db.mjs
/* eslint-disable no-console */

import pg from "pg";

// eslint-disable-next-line node/no-process-env
const { DATABASE_URL, NODE_ENV, ALLOW_DB_RESET } = process.env;

if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1); // this *is* a real error
}

const isProd = NODE_ENV === "production";
const allowReset = ALLOW_DB_RESET === "true";

// Safety guard:
// - In production: only reset if ALLOW_DB_RESET="true"
// - In non-prod: only reset if ALLOW_DB_RESET="true"
// In *both* cases, if not allowed, we just skip and exit(0)
if (!allowReset) {
    console.error(
        `Skipping DB reset: ALLOW_DB_RESET must be "true" (NODE_ENV=${NODE_ENV}, ALLOW_DB_RESET=${ALLOW_DB_RESET})`,
    );
    process.exit(0); // not an error, just a no-op
}

if (isProd) {
    console.error(
        "⚠ WARNING: Running DB reset in NODE_ENV=\"production\" because ALLOW_DB_RESET=\"true\"",
    );
}
else {
    console.log("⚠ Resetting database schemas…");
}

const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    max: 1,
});

const client = await pool.connect();

try {
    await client.query("BEGIN");

    await client.query(`
    DROP SCHEMA IF EXISTS auth CASCADE;
    DROP SCHEMA IF EXISTS public CASCADE;
    CREATE SCHEMA public;
    CREATE SCHEMA auth;
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
