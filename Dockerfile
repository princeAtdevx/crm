# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# apps/http runs on Bun straight from TypeScript source — there is no build
# step for the app. `@crm/db` is resolved through its "bun" export condition,
# so the container runs exactly the files you edit.
#
# Dependencies are installed with pnpm (to honour pnpm-lock.yaml) on a Node
# image, then the tree is copied into a Bun runtime image. Every production
# dependency here is pure JS, so no native rebuild is involved.
# ---------------------------------------------------------------------------
FROM node:24-alpine AS deps-base
RUN corepack enable
WORKDIR /app

# --- Stage 1: prune the monorepo down to http + its workspace deps ---------
FROM deps-base AS pruner
COPY . .
RUN pnpm dlx turbo@2 prune http --docker

# --- Stage 2: install (cached on manifests alone) --------------------------
FROM deps-base AS installer
COPY --from=pruner /app/out/json/ ./
# --prod: nothing is compiled, so devDependencies are never needed at runtime
# (and it avoids pnpm's unapproved-build-script gate for esbuild et al).
RUN pnpm install --frozen-lockfile --prod

# --- Stage 3: Bun runtime -------------------------------------------------
FROM oven/bun:1-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# node_modules (with pnpm's symlink layout intact) + the pruned sources.
COPY --from=installer /app ./
COPY --from=pruner /app/out/full/ ./

WORKDIR /app/apps/http
EXPOSE 3000
# ConfigModule sets ignoreEnvFile in production: DATABASE_URL and PORT come
# from the real environment.
CMD ["bun", "src/main.ts"]
