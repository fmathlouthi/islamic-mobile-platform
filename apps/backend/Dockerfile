# Stage 1: Prune monorepo
FROM oven/bun:1.1.20-alpine AS builder
RUN apk add --no-cache libc6-compat npm
WORKDIR /app
COPY . .
RUN bun x turbo prune @tariq/backend --docker

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
RUN bun x turbo build --filter=@tariq/backend

# Stage 4: Production runner
FROM oven/bun:1.1.20-alpine AS runner
RUN apk add --no-cache libstdc++
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Create the directory and set permissions
RUN mkdir -p /app && chown nestjs:nodejs /app

USER nestjs

COPY --from=sourcer --chown=nestjs:nodejs /app/package.json .
COPY --from=sourcer --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=sourcer --chown=nestjs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=sourcer --chown=nestjs:nodejs /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=sourcer --chown=nestjs:nodejs /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=sourcer --chown=nestjs:nodejs /app/packages/shared/dist ./packages/shared/dist

EXPOSE 3000

CMD ["bun", "apps/backend/dist/main.js"]
