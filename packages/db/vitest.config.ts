import node from '@crm/vitest-config/node';
import { defineConfig, mergeConfig } from 'vitest/config';

// Unit suite: no database, no Docker, safe to run anywhere. Everything this
// package does is I/O, so its real coverage lives in the integration suite --
// see vitest.config.integration.ts.
export default mergeConfig(
	node,
	defineConfig({
		test: {
			// The preset leaves this off deliberately, so that a package which
			// HAS unit tests cannot silently lose them to a broken glob. This
			// package has none yet. Delete this line with the first one.
			passWithNoTests: true,
		},
	}),
);
