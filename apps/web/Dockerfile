# Stage 1: Prune monorepo
FROM oven/bun:1.1.20-alpine AS builder
RUN apk add --no-cache libc6-compat npm
WORKDIR /app
COPY . .
RUN bun x turbo prune @tariq/web --docker

# Stage 2: Install dependencies
FROM oven/bun:1.1.20-alpine AS installer
RUN apk add --no-cache libstdc++ python3 make g++ npm
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lock ./bun.lock
RUN bun install --frozen-lockfile

# Stage 3: Build the application
FROM oven/bun:1.1.20-alpine AS sourcer
RUN apk add --no-cache libc6-compat npm
WORKDIR /app
COPY --from=installer /app .
COPY --from=builder /app/out/full/ .
COPY tsconfig.base.json tsconfig.base.json
COPY turbo.json turbo.json
RUN bun x turbo build --filter=@tariq/web

# Stage 4: Production runner
FROM oven/bun:1.1.20-alpine AS runner
RUN apk add --no-cache libstdc++
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permissions for nextjs user
RUN chown -R nextjs:nodejs /app

USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=sourcer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=sourcer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=sourcer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "apps/web/server.js"]
