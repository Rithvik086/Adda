FROM node:24-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

#################################################

FROM base AS deps

COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY package.json .
COPY turbo.json .

COPY apps/web/package.json apps/web/package.json

COPY packages/ui/package.json packages/ui/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

RUN pnpm install --frozen-lockfile

#################################################

FROM deps AS builder

ARG NEXT_PUBLIC_SOCKET_URL

ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL

COPY . .

RUN pnpm --filter web build

#################################################

FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["node","apps/web/server.js"]
