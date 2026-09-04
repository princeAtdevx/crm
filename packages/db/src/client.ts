import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import type { CreateDrizzleClient } from './types';

export function createDrizzleClient({
	connectionString,
	maxConnections = 10,
	idleTimeoutMillis = 30_000,
	connectionTimeoutMillis = 10_000,
}: CreateDrizzleClient) {
	const pool = new Pool({
		connectionString,
		max: maxConnections,
		idleTimeoutMillis,
		connectionTimeoutMillis,
	});

	const db = drizzle({ client: pool });

	return db;
}

export type DrizzleClient = ReturnType<typeof createDrizzleClient>;

/** The handle drizzle passes to a `transaction()` callback. */
export type DrizzleTransaction = Parameters<Parameters<DrizzleClient['transaction']>[0]>[0];

/**
 * Anything a query can be issued on: the pooled client, or an open
 * transaction. Models take this rather than DrizzleClient, whose extra
 * `$client` (the pg Pool itself) is a connection-lifecycle concern that no
 * model touches -- and that a transaction handle does not have.
 */
export type DrizzleQueryable = DrizzleClient | DrizzleTransaction;
