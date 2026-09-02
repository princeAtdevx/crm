import { eq } from 'drizzle-orm';
import { UserTable } from '../schema/schema';
import { Model } from './base.model';

export class UserModel extends Model {
	getUserById(id: string) {
		return this.drizzle.select().from(UserTable).where(eq(UserTable.id, id));
	}
}
