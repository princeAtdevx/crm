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

`@crm/db` and `@crm/utils` ship raw TypeScript from `src/` with no build step.
Consumers must list them in vitest's `ssr.noExternal`.
