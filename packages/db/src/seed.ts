/**
 * Idempotent development seed. `pnpm db:seed` from the repo root.
 *
 * Run against a migrated database — it inserts, it does not create tables.
 * `pnpm db:reset` does the whole sequence (recreate volume, migrate, seed).
 *
 * Rows carry FIXED ids rather than generated ones, so re-running is a no-op
 * instead of accumulating near-duplicate records, and so a fixture id can be
 * hardcoded in a test or pasted into a URL and still be there tomorrow.
 */
import { config } from 'dotenv';
import { sql } from 'drizzle-orm';
import { createDrizzleClient } from './client';
import { UserTable } from './schema/schema';

// Same file and precedence as drizzle.config.ts.
config({ path: ['../../.env.local', '../../.env'] });

const url = process.env.DATABASE_URL;
if (!url) {
	throw new Error('DATABASE_URL is not set (looked in <repo>/.env.local, <repo>/.env)');
}

// Guard rail, not a security boundary: catches the classic
// `DATABASE_URL=<prod> pnpm db:seed` slip. Set SEED_ALLOW_PRODUCTION=1 to
// deliberately seed a production-ish database.
if (process.env.NODE_ENV === 'production' && process.env.SEED_ALLOW_PRODUCTION !== '1') {
	throw new Error('Refusing to seed with NODE_ENV=production (set SEED_ALLOW_PRODUCTION=1)');
}

const users = [
	{
		id: 'usr_seed_ada',
		name: 'Ada Lovelace',
		email: 'ada@example.com',
		emailVerified: true,
	},
	{
		id: 'usr_seed_alan',
		name: 'Alan Turing',
		email: 'alan@example.com',
		emailVerified: true,
	},
	{
		id: 'usr_seed_grace',
		name: 'Grace Hopper',
		email: 'grace@example.com',
		emailVerified: false,
	},
];

const db = createDrizzleClient({ connectionString: url, maxConnections: 1 });

try {
	// onConflictDoUpdate, not DoNothing: editing a fixture above and re-running
	// should move the database to match the file.
	const inserted = await db
		.insert(UserTable)
		.values(users)
		.onConflictDoUpdate({
			target: UserTable.id,
			set: {
				name: sql`excluded.name`,
				email: sql`excluded.email`,
				emailVerified: sql`excluded.email_verified`,
			},
		})
		.returning({ id: UserTable.id });

	console.log(`seeded ${inserted.length} user(s): ${inserted.map((u) => u.id).join(', ')}`);
} finally {
	await db.$client.end();
}
