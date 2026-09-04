/**
 * Runs `fn` inside a transaction that is always rolled back.
 *
 * The suite shares one migrated crm_test database with the committed seed rows
 * (usr_seed_ada and friends). Rolling back means a test can insert whatever it
 * likes without colliding with those fixtures, without ordering constraints
 * between tests, and without a truncate step that would delete them.
 */
import type { DrizzleTransaction } from '../src/client';
import type { DrizzleDb } from '../src/drizzle.init';

/** Thrown to force the rollback, caught below, never seen by a test. */
class Rollback extends Error {
	constructor() {
		super('rollback');
		this.name = 'Rollback';
	}
}

export async function withRollback<T>(
	db: DrizzleDb,
	fn: (tx: DrizzleTransaction) => Promise<T>,
): Promise<T> {
	// Boxed rather than a bare `let`: the callback's return value can legally
	// be undefined, so "did it run" and "what did it return" are two questions.
	let captured: { value: T } | undefined;

	try {
		await db.client.transaction(async (tx) => {
			captured = { value: await fn(tx) };
			// drizzle commits unless the callback throws.
			throw new Rollback();
		});
	} catch (error) {
		if (!(error instanceof Rollback)) throw error;
	}

	if (!captured) {
		throw new Error('withRollback: the transaction ended without running the callback');
	}

	return captured.value;
}
