#!/usr/bin/env bash
set -euo pipefail

echo "→ Running database migrations"
node server/scripts/migrate.mjs

echo "→ Starting Nuxt"
exec "$@"
