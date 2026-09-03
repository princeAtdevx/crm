import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tsconfigPaths()],
	// @crm/db and @crm/utils are published as TypeScript source (no build), so
	// Vite must transform them rather than externalising them to Node's
	// resolver.
	ssr: { noExternal: ['@crm/db', '@crm/utils'] },
	test: {
		globals: true,
		root: './',
		include: ['**/*.e2e-spec.ts'],
	},
});
