# syntax=docker/dockerfile:1.7

# ── 1. builder: build the admin panel ───────────────────────────────
FROM node:20-alpine AS builder

# Build deps for sharp (vips), node-gyp, etc.
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# ── 2. prod-deps: install ONLY production deps ──────────────────────
FROM node:20-alpine AS prod-deps

# Need vips-dev at install time so sharp builds against the system lib.
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ── 3. runner: minimal runtime image ────────────────────────────────
FROM node:20-alpine AS runner

# vips is the runtime lib; vips-dev is build-only and not needed here.
RUN apk add --no-cache vips

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/config ./config
COPY --from=builder --chown=node:node /app/database ./database
COPY --from=builder --chown=node:node /app/src ./src
COPY --from=builder --chown=node:node /app/types ./types
COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/package-lock.json* ./
COPY --from=builder --chown=node:node /app/tsconfig.json ./
COPY --from=builder --chown=node:node /app/favicon.png ./

# Uploads directory must be writable by the `node` user.
RUN mkdir -p /app/public/uploads && chown -R node:node /app/public

USER node

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:1337/_health || exit 1

CMD ["npm", "run", "start"]
