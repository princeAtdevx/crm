# crm

Turborepo monorepo, pnpm workspaces, **Bun** as the runtime.

## Apps and packages

| Workspace          | What it is                                                    |
| ------------------ | ------------------------------------------------------------- |
| `apps/backend`     | NestJS 12 API, run directly from TypeScript by Bun            |
| `apps/web`         | Vite 8 + React 19 front end, also run by Bun                  |
| `packages/db`      | `@crm/db` — Drizzle ORM schema and client, shipped as source  |
| `packages/ui`      | `@crm/ui` — React components + Tailwind v4 tokens, as source  |
| `packages/ts-config`| `@crm/ts-config` — the shared `tsconfig` presets             |

Nothing except `apps/web` has a build step: Bun executes TypeScript directly,
and the shared packages export raw `src/*.ts(x)` that the consumer's bundler
compiles. That is why editing `@crm/ui` hot-reloads inside `apps/web`.

## Getting started

Needs Node >= 24, pnpm >= 11.23, Bun >= 1.4 and a running Docker daemon.

```sh
pnpm install
cp .env.example .env
pnpm dev:db:start               # Postgres in Docker, waits until it is healthy
pnpm db:migrate                 # apply migrations to crm
pnpm dev:db:migrate:test        # ...and to crm_test, which the test suites use
pnpm dev:db:seed                # three fixture users, safe to re-run
pnpm dev
```

`pnpm dev` refuses to start when Postgres is unreachable rather than failing
several seconds later inside Nest's bootstrap. Front-end-only work does not
need the database: `pnpm --filter @crm/web dev`.

## Commands

```sh
pnpm dev                        # every app (checks Postgres first)
pnpm --filter @crm/web dev      # just the front end, no database needed
pnpm build                      # only apps/web produces output today
pnpm check-types
pnpm test                       # unit suites, every workspace, no database
pnpm test:integration           # @crm/db, needs Postgres
pnpm test:e2e                   # @crm/backend, needs Postgres
pnpm --filter @crm/ui test      # one workspace on its own
pnpm run ci                     # biome ci . — what pre-push runs
pnpm check:fix                  # biome check --write . across the repo
```

### Local database

One Postgres container, defined in `docker/compose.yml`, holding two databases:
`crm` for development and `crm_test` for the test suites, so a test run cannot
truncate the data you have been clicking through all morning.

```sh
pnpm dev:db:start               # up -d --wait (blocks on the healthcheck)
pnpm dev:db:stop                # keeps the volume
pnpm dev:db:logs
pnpm dev:db:tools               # pgweb on http://localhost:8081
pnpm dev:db:migrate:test        # migrate crm_test — do this before the DB suites
pnpm dev:db:reset               # DESTROYS the volume, then migrate + seed
pnpm db:studio                  # drizzle studio against DATABASE_URL
```

`pnpm dev:db:reset` is the only thing that re-runs `docker/postgres/init`, so it
is what you need after editing anything in there.

Port 5432 already taken? Publish another one and match it in `.env`:

```sh
POSTGRES_PORT=5433 pnpm dev:db:start
```

Schema changes go through `pnpm db:generate` (writes SQL into
`packages/db/drizzle/migrations`) and then `pnpm db:migrate`. `pnpm db:push`
exists for throwaway experiments — never point it at a database anyone else
uses, since it skips the migration history entirely.

## Tooling

- **pnpm** installs everything (one lockfile). Bun is the *runtime*, not the
  package manager.
- [Biome](https://biomejs.dev/) for linting, formatting and import sorting — the
  only linter/formatter (ESLint, Prettier and oxlint were removed). Root
  `biome.jsonc` plus a per-workspace `biome.jsonc` that `extends: "//"` and
  holds only that workspace's deltas.
- [Tailwind CSS v4](https://tailwindcss.com), configured in CSS. There is no
  `tailwind.config.js`: `packages/ui/src/styles.css` owns the tokens, and
  `apps/web` imports it.
- [lefthook](https://lefthook.dev/) for the pre-commit/pre-push hooks.
- A [pnpm catalog](https://pnpm.io/catalogs) in `pnpm-workspace.yaml` pinning
  the versions shared across workspaces (typescript, react, biome, tailwind,
  vitest, `@types/*`).
- [TypeScript](https://www.typescriptlang.org/) everywhere; every workspace
  extends a preset from `packages/ts-config` rather than repeating options.
- [Docker Compose](https://docs.docker.com/compose/) for local dependencies
  only — `docker/compose.yml`. The production image is
  `docker/Dockerfile.backend` and shares nothing with it.
- Telemetry via [NestJS Observe](https://observe.nestjs.com), registered only
  when `OBSERVE_APP_KEY` and `OBSERVE_APP_SECRET` are set. Unset is the
  supported default.
