/**
 * Connection details for the integration suite.
 *
 * Reads the repo-root .env.test -- the same file apps/backend's ConfigModule
 * and `pnpm dev:db:migrate:test` read, so the test database is defined exactly
 * once. Nothing is hardcoded here.
 *
 * dotenv never overwrites a variable that is already set, so an explicit
 * DATABASE_URL (CI job env, or `DATABASE_URL=... pnpm test:integration`) still
 * wins over the file. That is what the guard below is for.
 */
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { DrizzleDb } from '../src/drizzle.init';

const fromRoot = (name: string) => fileURLToPath(new URL(`../../../${name}`, import.meta.url));

// Same order and precedence as the backend's envFilePath: first file wins.
config({ path: [fromRoot('.env.test.local'), fromRoot('.env.test')], quiet: true });

export function resolveTestDatabaseUrl(): string {
	const url = process.env.DATABASE_URL;

	if (!url) {
		throw new Error('DATABASE_URL is not set (expected the repo-root .env.test to supply it)');
	}

	let name: string;
	try {
		// pathname is '/crm_test'.
		name = new URL(url).pathname.replace(/^\//, '');
	} catch {
		throw new Error(`DATABASE_URL is not a valid URL: ${url}`);
	}

	// The whole safety mechanism. These tests write, so a DATABASE_URL left
	// over from a dev shell must stop the run rather than be trusted.
	if (!name.endsWith('_test')) {
		throw new Error(
			`Refusing to run integration tests against database "${name}": the name must end in _test. ` +
				'The repo-root .env.test names the right one; unset any DATABASE_URL your shell exports.',
		);
	}

	return url;
}

/** One pool per test file. Close it in afterAll. */
export function createTestDb(): DrizzleDb {
	return new DrizzleDb({
		connectionString: resolveTestDatabaseUrl(),
		// A rolled-back transaction only ever occupies one connection, and a
		// small pool makes a leaked one obvious instead of merely slow.
		maxConnections: 2,
	});
}
