import { UserModel, UserTable } from '../src/index';
import { createTestDb } from './test-db';
import { withRollback } from './with-rollback';

/**
 * Seam: UserModel's query methods, reached the way apps do -- through the
 * package's public entry point, against a real Postgres.
 *
 * The model is constructed on the transaction handle rather than reached
 * through `db.users`, which is bound to the pool: it would take a different
 * connection and could not see rows the open transaction has not committed.
 * Same class, same method, same public constructor -- just pointed at the
 * connection this test is writing on.
 */
describe('UserModel (integration)', () => {
	const db = createTestDb();

	afterAll(async () => {
		await db.close();
	});

	it('reads back a user by id', async () => {
		await withRollback(db, async (tx) => {
			await tx.insert(UserTable).values({
				id: 'usr_int_ada',
				name: 'Ada Lovelace',
				email: 'ada.integration@example.com',
			});

			const [user] = await new UserModel(tx).getUserById('usr_int_ada');

			expect(user).toMatchObject({
				id: 'usr_int_ada',
				name: 'Ada Lovelace',
				email: 'ada.integration@example.com',
				// Column default, not something the insert supplied.
				emailVerified: false,
			});
		});
	});

	it('returns nothing for an id that is not there', async () => {
		await withRollback(db, async (tx) => {
			const rows = await new UserModel(tx).getUserById('usr_does_not_exist');

			expect(rows).toEqual([]);
		});
	});

	it('leaves no trace once the transaction rolls back', async () => {
		// The guarantee the whole suite rests on. If this fails, tests are
		// leaking rows into crm_test and every later run is suspect.
		const rows = await db.users.getUserById('usr_int_ada');

		expect(rows).toEqual([]);
	});
});
