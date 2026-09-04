/**
 * Server-side and framework-free packages: @crm/utils, @crm/db, apps/backend.
 *
 *   // vitest.config.ts
 *   export { default } from '@crm/vitest-config/node';
 */

import { base } from '@crm/vitest-config/base';
import { defineConfig, mergeConfig, type ViteUserConfig } from 'vitest/config';

export const node: ViteUserConfig = mergeConfig(
	base,
	defineConfig({
		resolve: {
			// Native as of Vite 8, replacing the vite-tsconfig-paths plugin that
			// apps/backend used to carry. No workspace declares tsconfig `paths`
			// yet; this is here so the first one to do so needs no config change.
			tsconfigPaths: true,
		},
		test: {
			environment: 'node',
		},
	}),
);

export default node;
