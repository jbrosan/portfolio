# --- Stage 1: Build ---
FROM node:24-slim AS builder
WORKDIR /app

RUN apk add --no-cache curl

# Minimal CA bundle for HTTPS fetches during npm installs
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Install prod+dev deps with lockfile for deterministic builds
COPY package.json package-lock.json* ./
RUN npm ci

# Build Nuxt
COPY . .
RUN npm run build

# --- Stage 2: Runtime ---
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

ENV HOST=0.0.0.0

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Only production deps
COPY --from=builder /app/package.json /app/package-lock.json* ./
RUN npm ci --omit=dev

# Copy app output + migrations + migration script
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/server/db/migrations ./server/db/migrations
COPY --from=builder /app/server/scripts ./server/scripts

# Entrypoint to run migrations first, then launch Nuxt
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Optional: run as non-root for a bit more safety
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 3000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", ".output/server/index.mjs"]
