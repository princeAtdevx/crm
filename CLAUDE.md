# CLAUDE.md

Conventions for this repo. Add to it as we settle on more.

## Error handling

Use `withCatch` from `@crm/utils` only where you explicitly handle the error —
map it to a response, log it, fall back. Otherwise don't wrap: let it propagate
to the outer error boundary.

```ts
const [error, data] = await withCatch(promise);
const [error, user] = await withCatch(findUser(id), [NotFoundError]); // rethrows the rest
```

## Workspace packages

`@crm/db`, `@crm/utils`, `@crm/types` and `@crm/ui` ship raw TypeScript from
`src/` with no build step. Vite has to transform them rather than hand them to
Node, which is what `ssr.noExternal` does — declared once in
`@crm/vitest-config/base`, not per package. Add any new source-only package to
that list.

## Testing

Vitest everywhere. Every workspace's `vitest.config.ts` re-exports a preset:

```ts
export { default } from '@crm/vitest-config/node';   // or /react
```

The presets live in `packages/vitest-config` and own the environment, coverage,
`globals: true`, and the `ssr.noExternal` list above. Compose with `mergeConfig`
when a workspace needs a delta — see `packages/db/vitest.config.integration.ts`.

| Suffix | Location | Script | Needs a database |
| --- | --- | --- | --- |
| `*.spec.ts(x)` | next to the code | `test` | no |
| `*.integration-spec.ts` | `test/` | `test:integration` | yes |
| `*.e2e-spec.ts` | `test/` | `test:e2e` | yes |

`test` must stay runnable with nothing but `pnpm install` — that is what lets CI
run one workspace on its own. Anything needing Postgres goes in the other two.

Database-backed suites want a migrated `crm_test`:

```
pnpm dev:db:start && pnpm dev:db:migrate:test
```

The repo-root `.env.test` is the single definition of that database — committed,
no secrets, read by the backend's `ConfigModule`, by `@crm/db`'s integration
suite and by `dev:db:migrate:test`. Put anything you cannot commit in
`.env.test.local`, which is loaded first. Nothing hardcodes the URL, and
`packages/db/test/test-db.ts` refuses any database whose name does not end in
`_test`, so a stray `DATABASE_URL` stops the run instead of truncating your dev
data.

`@crm/db`'s suite runs each test in a transaction it rolls back (`withRollback`
in `packages/db/test/`), so it shares one database with the committed seed rows
without leaking.

New tests go through the `tdd` skill: agree the seam first, then one red → green
slice at a time. Test through the public interface — for `@crm/ui` that means
the rendered DOM, not the `cva` variants behind it.
