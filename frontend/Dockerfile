FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

ARG VITE_STRAPI_URL=http://localhost:1337
ARG VITE_SITE_URL=http://localhost:3000
ARG VITE_GTM_ID=
ENV VITE_STRAPI_URL=$VITE_STRAPI_URL
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_GTM_ID=$VITE_GTM_ID

COPY . .
RUN npm run build

# ---

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV ORIGIN=http://localhost:3000

EXPOSE 3000

CMD ["node", "build"]
