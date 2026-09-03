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

## Commands

```sh
pnpm install
pnpm dev                        # every app
pnpm --filter @crm/web dev      # just the front end
pnpm build                      # only apps/web produces output today
pnpm check-types
pnpm ci                         # biome ci . — what pre-push runs
pnpm check:fix                  # biome check --write . across the repo
```

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
