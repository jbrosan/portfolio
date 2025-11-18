#!/usr/bin/env bash
set -euo pipefail

echo "→ NODE_ENV=${NODE_ENV:-unset}"
echo "→ DATABASE_URL=${DATABASE_URL:+set}"

# Optional: dangerous reset, only for dev/staging or intentional prod nukes
if [ "${DB_RESET_ON_START:-false}" = "true" ]; then
  echo "⚠ WARNING: DB_RESET_ON_START=true – resetting database schema"
  node server/scripts/reset-db.mjs
fi

# Run migrations (recommended: default = true)
if [ "${MIGRATE_ON_START:-true}" = "true" ]; then
  echo "→ Running database migrations"
  node server/scripts/migrate.mjs
else
  echo "→ Skipping migrations (MIGRATE_ON_START=false)"
fi

# Optional seeding
if [ "${SEED_ON_START:-false}" = "true" ]; then
  # 1) Seed admin (idempotent)
  if [ -n "${ADMIN_EMAIL:-}" ]; then
    echo "→ Seeding admin user"
    npx tsx server/scripts/seed-admin.ts
  else
    echo "→ Skipping admin seed (ADMIN_EMAIL is not set)"
  fi

  # 2) Seed app data (competencies, categories, etc.)
  echo "→ Seeding database"
  node server/scripts/seed.mjs
else
  echo "→ Skipping seed (SEED_ON_START not true)"
fi

echo "→ Starting Nuxt"
exec "$@"
