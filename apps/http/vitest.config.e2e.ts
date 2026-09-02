import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  // @crm/db is published as TypeScript source (no build), so Vite must
  // transform it rather than externalising it to Node's resolver.
  ssr: { noExternal: ['@crm/db'] },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
});
