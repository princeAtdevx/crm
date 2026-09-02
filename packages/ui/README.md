# @crm/ui

Shared React components for the CRM, styled with Tailwind CSS v4.

Shipped as **raw TypeScript source** — no build step, same as `@crm/db`. The
consuming app's bundler compiles `src/*.tsx` directly, so edits hot-reload
across package boundaries.

## Usage

```jsonc
// package.json
"dependencies": { "@crm/ui": "workspace:*" }
```

```css
/* the app's entry CSS — imports Tailwind and every design token */
@import "@crm/ui/styles.css";
```

```tsx
import { Button, Card, cn } from '@crm/ui';
```

## Design tokens

`src/styles.css` is the single source of truth. There is no
`tailwind.config.js`: v4 is configured in CSS via `@theme`, and dark mode
works by overriding token *values* under `prefers-color-scheme`, so no
component carries a `dark:` variant.

## Adding a component

1. Create `src/components/<name>.tsx`.
2. Compose classes through `cn()` so callers can override via `className`.
3. Use `cva` for variant maps; export the variants alongside the component.
4. Re-export from `src/index.ts` (type exports need `export type` —
   `verbatimModuleSyntax` is on).
