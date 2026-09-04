/**
 * Runs once before the integration suite. Without it, an unreachable database
 * shows up as every test timing out on connect, which says nothing useful
 * about what to do next.
 */
import { createTestDb, resolveTestDatabaseUrl } from './test-db';

export async function setup() {
	const db = createTestDb();

	try {
		await db.ping();
	} catch (cause) {
		throw new Error(
			`Cannot reach the test database at ${resolveTestDatabaseUrl()}.\n\n` +
				'  pnpm dev:db:start && pnpm dev:db:migrate:test\n\n' +
				'If the database exists but the `user` table does not, the migration step is the one you skipped.',
			{ cause },
		);
	} finally {
		await db.close();
	}
}
