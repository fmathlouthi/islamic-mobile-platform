# Stage 1: Prune monorepo
FROM oven/bun:1.1.20-alpine AS builder
RUN apk add --no-cache libc6-compat npm
WORKDIR /app
COPY . .
RUN bun x turbo prune @tariq/frontend --docker

# Stage 2: Install dependencies
FROM oven/bun:1.1.20-alpine AS installer
RUN apk add --no-cache libc6-compat python3 make g++ npm
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
ENV NODE_ENV=production
ENV EXPO_NO_TELEMETRY=1
ENV CI=1
# Ensure bun is used and recognized by turbo
RUN bun x turbo build --filter=@tariq/frontend

# Stage 4: Production runner
FROM nginx:alpine AS runner
RUN apk add --no-cache libstdc++

# Create a custom nginx config for SPA routing and running on port 8080
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Set up permissions for non-root user
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

USER nginx

COPY --from=sourcer --chown=nginx:nginx /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
