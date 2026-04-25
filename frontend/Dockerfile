# syntax=docker/dockerfile:1.7

# ── 1. deps: install ALL deps (dev + prod) for the build ────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ── 2. builder: produce the SvelteKit Node bundle ───────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Vite freezes these into the client bundle at build time.
ARG VITE_STRAPI_URL=http://localhost:1337
ARG VITE_SITE_URL=http://localhost:3000
ARG VITE_GTM_ID=
ENV VITE_STRAPI_URL=$VITE_STRAPI_URL
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_GTM_ID=$VITE_GTM_ID

RUN npm run build

# ── 3. prod-deps: install ONLY production deps ──────────────────────
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ── 4. runner: minimal image ────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# wget exists in base image; install nothing.

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder --chown=node:node /app/build ./build
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "build"]
