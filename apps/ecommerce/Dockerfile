FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /medusa-app
# COPY . .
COPY package.json .
RUN corepack enable

FROM base AS builder
# Set working directory
WORKDIR /medusa-app
# RUN pnpm add -g turbo
COPY . .
RUN pnpm install -g turbo@2
RUN turbo prune ecommerce --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /medusa-app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /medusa-app/out/json/ .
COPY --from=builder /medusa-app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --filter ecommerce...

# Build the project and its dependencies
COPY --from=builder /medusa-app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN


RUN pnpm install --frozen-lockfile --filter ecommerce...

ENV NODE_ENV=production
RUN pnpm exec turbo build --filter=ecommerce...

FROM base AS runner
WORKDIR /medusa-app

# Don't run production as root
# RUN addgroup --system --gid 1001 runner
# RUN adduser --system --uid 1001 runner
# USER runner
COPY --from=installer /medusa-app .



RUN corepack enable
RUN corepack install

EXPOSE 9000

CMD pnpm run --dir apps/ecommerce predeploy && pnpm run --dir apps/ecommerce start
