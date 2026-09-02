import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	// Resolves the path aliases declared in tsconfig.json, including the ones
	// added by `nest g library`.
	plugins: [tsconfigPaths()],
	// @crm/db is published as TypeScript source (no build), so Vite must
	// transform it rather than externalising it to Node's resolver.
	ssr: { noExternal: ['@crm/db'] },
	test: {
		globals: true,
		root: './',
		include: ['**/*.spec.ts'],
	},
});
