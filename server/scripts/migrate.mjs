import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const pool = new pg.Pool({
    connectionString: dbUrl,
    max: 1,
    idleTimeoutMillis: 2000,
});

const db = drizzle(pool);

(async () => {
    try {
        const migrationsFolder = resolve(__dirname, "../db/migrations");
        console.log(`→ Running Drizzle migrations from: ${migrationsFolder}`);
        await migrate(db, { migrationsFolder });
        console.log("✔ Migrations completed");
    }
    catch (err) {
        console.error("✖ Migration failed:", err);
        process.exit(1);
    }
    finally {
        await pool.end();
    }
})();
