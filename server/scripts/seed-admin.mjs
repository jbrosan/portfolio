// server/scripts/seed-admin.mjs
/* eslint-disable no-console */
import "dotenv/config";
import pg from "pg";
import { z } from "zod";

const { DATABASE_URL } = process.env;

const SeedEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ADMIN_EMAIL: z.email(),
  ADMIN_NAME: z.string().optional(),
});

const env = SeedEnvSchema.parse(process.env);

const adminEmail = env.ADMIN_EMAIL;
const adminName = env.ADMIN_NAME ?? "Administrator";

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 1,
});

const client = await pool.connect();

try {
  await client.query("BEGIN");

  const { rows: existingRows } = await client.query(
    `SELECT id, role, status, email_verified
       FROM "user"
      WHERE email = $1
      LIMIT 1`,
    [adminEmail],
  );

  if (existingRows.length > 0) {
    const id = existingRows[0].id;

    await client.query(
      `UPDATE "user"
          SET name = $2,
              role = 'admin',
              email_verified = true,
              status = 'active',
              updated_at = now()
        WHERE id = $1`,
      [id, adminName],
    );

    await client.query("COMMIT");
    console.log(`[seed-admin] Updated existing admin user ${adminEmail} (id=${id}).`);
  } else {
    const { rows } = await client.query(
      `INSERT INTO "user" (name, email, role, email_verified, status)
       VALUES ($1, $2, 'admin', true, 'active')
       RETURNING id`,
      [adminName, adminEmail],
    );

    await client.query("COMMIT");
    console.log(`[seed-admin] Created admin user ${adminEmail} (id=${rows[0]?.id}).`);
  }
} catch (err) {
  await client.query("ROLLBACK");
  console.error("[seed-admin] Failed:", err);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
