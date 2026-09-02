// Value import (not `import type`): with `emitDecoratorMetadata` the ctor
// param type is emitted as a runtime reference for Nest to resolve.
import { DrizzleDb } from '@crm/db';
import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common';

/**
 * `pg.Pool` connects lazily, so a bad DATABASE_URL would let the app boot
 * "healthy" and 500 on the first request. Ping once at bootstrap so a broken
 * connection fails the boot instead. Bounded by `connectionTimeoutMillis`.
 */
@Injectable()
export class DatabaseHealth implements OnApplicationBootstrap {
	private readonly logger = new Logger(DatabaseHealth.name);

	constructor(private readonly db: DrizzleDb) {}

	async onApplicationBootstrap(): Promise<void> {
		await this.db.ping();
		this.logger.log('Database connection verified');
	}
}
