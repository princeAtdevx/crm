import type { DrizzleQueryable } from '../client';

export class Model {
	protected drizzle: DrizzleQueryable;

	constructor(drizzle: DrizzleQueryable) {
		this.drizzle = drizzle;
	}
}
