FROM node:24-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

##############################################

FROM base AS deps

COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY package.json .
COPY turbo.json .

COPY apps/api/package.json apps/api/package.json

COPY packages/types/package.json packages/types/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

RUN pnpm install --frozen-lockfile

##############################################

FROM deps AS builder

COPY . .

RUN pnpm --filter api build

##############################################

FROM base AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/packages ./packages

WORKDIR /app/apps/api

EXPOSE 8080

CMD ["pnpm","start"]
