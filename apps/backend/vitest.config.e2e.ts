import node from '@crm/vitest-config/node';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
	node,
	defineConfig({
		test: {
			// Scoped to test/ rather than the old '**/*.e2e-spec.ts', which
			// walked the whole workspace on every run.
			include: ['test/**/*.e2e-spec.ts'],

			// Boots the real AppModule against the crm_test database.
			// `pnpm dev:db:start && pnpm dev:db:migrate:test` first.
			fileParallelism: false,
			pool: 'forks',
			testTimeout: 30_000,
			hookTimeout: 30_000,
		},
	}),
);
