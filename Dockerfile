FROM node:20-bullseye AS base
WORKDIR /srv
RUN corepack enable

FROM base AS build
COPY application/package*.json ./
COPY application/pnpm-lock.yaml ./
RUN pnpm install
COPY application/. .

FROM base as dev
CMD pnpm run start

FROM base AS prod
RUN groupadd -g 1001 nodejs
RUN useradd -m -u 1001 -g 1001 nextjs
USER nextjs
WORKDIR /srv
COPY --from=build --chown=nextjs:nodejs /srv/. ./
CMD pnpm run start
