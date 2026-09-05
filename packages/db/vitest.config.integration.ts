import node from '@crm/vitest-config/node';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
	node,
	defineConfig({
		test: {
			include: ['test/**/*.integration-spec.ts'],

			// Fails the run with a usable message when Postgres is unreachable,
			// instead of letting every test time out on connect.
			globalSetup: ['./test/global-setup.ts'],

			// Every test wraps itself in a transaction it rolls back. Two files
			// interleaving on one database would deadlock on the same rows, so
			// files run one at a time. Within a file, tests are sequential
			// anyway.
			fileParallelism: false,

			// pg's native bindings and pool teardown behave predictably in a
			// forked process; threads leave the pool open often enough to hang
			// the run.
			pool: 'forks',

			// A cold pool plus a migration check is slower than the 5s default.
			testTimeout: 20_000,
			hookTimeout: 30_000,
		},
	}),
);
