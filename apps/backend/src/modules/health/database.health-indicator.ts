// Value import (not `import type`): with `emitDecoratorMetadata` the ctor param
// type is emitted as a runtime reference for Nest to resolve.
import { DrizzleDb } from '@crm/db';
import { withCatch } from '@crm/utils';
import { Injectable } from '@nestjs/common';
import { type HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus';

/**
 * Terminus indicator wrapping `DrizzleDb.ping()` (a `select 1`).
 *
 * Terminus ships `TypeOrmHealthIndicator`/`MongooseHealthIndicator` but nothing
 * for Drizzle, so the check goes through `HealthIndicatorService` — the v11+
 * API that replaced extending the deprecated `HealthIndicator` base class.
 */
@Injectable()
export class DatabaseHealthIndicator {
	constructor(
		private readonly healthIndicatorService: HealthIndicatorService,
		private readonly db: DrizzleDb,
	) {}

	async isHealthy(key: string): Promise<HealthIndicatorResult> {
		const indicator = this.healthIndicatorService.check(key);

		// Catch everything: any failure to reach the database means "not ready",
		// so there is no error class worth letting through to a 500.
		const [error] = await withCatch(this.db.ping());

		// Report the message only -- never the connection string, which pg
		// errors can carry.
		return error ? indicator.down({ message: error.message }) : indicator.up();
	}
}
