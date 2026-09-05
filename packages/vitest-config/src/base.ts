/**
 * Options every workspace shares. Not usable on its own -- it sets no
 * `environment`. Consumers take ./node.ts or ./react.ts instead, or compose
 * this with Vitest's `mergeConfig` for a one-off.
 *
 * IMPORTANT: the presets import each other by package self-reference
 * (`@crm/vitest-config/base`), not by relative path. Vite externalises bare
 * specifiers when it bundles a config file, so these modules are loaded
 * *natively* by Node -- whose ESM resolver rejects the extensionless `./base`
 * that the rest of the repo writes. Going through this package's own exports
 * map satisfies both Node and tsc, and keeps consumers from having to set
 * allowImportingTsExtensions just to type-check their vitest.config.ts.
 */
import type { ViteUserConfig } from 'vitest/config';

/**
 * The @crm packages ship raw TypeScript with no build step, so Vite has to
 * transform them instead of handing them to Node as-is. Declaring it once here
 * is the whole reason this package exists -- previously every consumer had to
 * remember it, and forgetting it fails at import time with a syntax error.
 */
export const workspaceSources = ['@crm/db', '@crm/types', '@crm/ui', '@crm/utils'];

export const base: ViteUserConfig = {
	ssr: {
		noExternal: workspaceSources,
	},
	test: {
		// Matches apps/backend, and Biome's `domains.test` rules assume it.
		globals: true,

		// Unit tests sit next to the code they describe. Suites that need
		// something external live in test/ under a longer suffix
		// (*.integration-spec.ts, *.e2e-spec.ts) so that `test` stays runnable
		// with nothing installed but node_modules.
		include: ['src/**/*.spec.{ts,tsx}'],

		// Deliberately NOT passWithNoTests: a glob that stops matching should
		// fail the run, not report success over zero tests.

		clearMocks: true,
		mockReset: true,
		restoreMocks: true,

		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			reportsDirectory: './coverage',
			exclude: [
				'**/node_modules/**',
				'**/dist/**',
				'**/coverage/**',
				'**/*.config.{ts,js,mts,mjs}',
				// Re-export barrels have no branches to cover.
				'**/src/index.ts',
				// Scripts, not library code.
				'**/src/seed/**',
				'**/drizzle/**',
				'**/test/**',
				'**/*.spec.{ts,tsx}',
			],
		},
	},
};
