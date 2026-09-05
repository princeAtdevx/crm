import node from '@crm/vitest-config/node';
import { defineConfig, mergeConfig } from 'vitest/config';

// Schemas only for now. A zod `.refine()` or a `.transform()` is real logic and
// belongs in a src/**/*.spec.ts next to it.
export default mergeConfig(
	node,
	defineConfig({
		test: {
			// See packages/db/vitest.config.ts: off in the preset on purpose.
			// Delete this line with the first spec.
			passWithNoTests: true,
		},
	}),
);
