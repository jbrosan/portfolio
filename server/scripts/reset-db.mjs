// server/scripts/reset-db.mjs
/* eslint-disable no-console */

import pg from "pg";

// eslint-disable-next-line node/no-process-env
const { DATABASE_URL, NODE_ENV, ALLOW_DB_RESET } = process.env;

if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

// Hard safety guard: require explicit flag and disallow in production
if (NODE_ENV === "production" || ALLOW_DB_RESET !== "true") {
    console.error(
        `Refusing to reset DB. NODE_ENV=${NODE_ENV}, ALLOW_DB_RESET=${ALLOW_DB_RESET}`,
    );
    process.exit(1);
}

console.log("⚠ Resetting database schemas…");

const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    max: 1,
});

const client = await pool.connect();

try {
    await client.query("BEGIN");

    // Adjust schemas as needed: public/auth/drizzle/etc.
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
