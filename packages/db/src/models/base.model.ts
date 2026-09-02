import type { DrizzleClient } from '../client';

export class Model {
	protected drizzle: DrizzleClient;

	constructor(drizzle: DrizzleClient) {
		this.drizzle = drizzle;
	}
}
