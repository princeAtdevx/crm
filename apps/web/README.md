# @crm/web

Vite + React 19 front end, running on **Bun**.

```bash
pnpm --filter @crm/web dev      # bun --bun vite
pnpm --filter @crm/web build
pnpm --filter @crm/web preview
```

Dependencies are installed by **pnpm** (one lockfile, one catalog for the
whole monorepo); Bun is only the runtime that executes Vite, matching
`apps/backend`.

- UI components and every design token come from [`@crm/ui`](../../packages/ui)
  — `src/index.css` is a single `@import` of its stylesheet.
- TypeScript options come from `@crm/ts-config/react-app.json`.
- Linting and formatting are Biome (`biome.jsonc` extends the repo root). There
  is no ESLint, Prettier or oxlint anywhere in this repo.
