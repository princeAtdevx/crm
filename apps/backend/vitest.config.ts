import node from '@crm/vitest-config/node';
import { defineConfig, mergeConfig } from 'vitest/config';

// Unit suite. ssr.noExternal for the raw-TS @crm packages, tsconfig paths and
// coverage all come from the shared preset now.
export default mergeConfig(
	node,
	defineConfig({
		test: {
			// See packages/db/vitest.config.ts: off in the preset on purpose,
			// on here because the only suite this app has today is test:e2e.
			// Delete this line with the first src/**/*.spec.ts.
			passWithNoTests: true,
		},
	}),
);
