import {
  Global,
  Logger,
  Module,
  type DynamicModule,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { DrizzleDb } from '@crm/db';
import { DatabaseHealth } from './database.health';
import type {
  DatabaseModuleAsyncOptions,
  DatabaseModuleOptions,
} from './database.module-options';

/**
 * Owns the single `DrizzleDb` (and therefore the single pg pool) for the
 * process, and drains it on shutdown.
 *
 * `@Global()` because the database is ambient infrastructure that nearly every
 * feature module needs — the same shape as `TypeOrmModule.forRoot`. Call
 * `forRoot`/`forRootAsync` ONLY in `AppModule`: a second call creates a second
 * pool. Tests should use `.overrideProvider(DrizzleDb)`.
 */
@Global()
@Module({})
export class DatabaseModule implements OnApplicationShutdown {
  private static readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly db: DrizzleDb) {}

  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        // `useFactory`, not `useClass`: Nest never reflects on DrizzleDb's
        // constructor, so `@crm/db` stays framework-agnostic — no
        // `@Injectable()`, no `reflect-metadata`, no `@nestjs/common`.
        { provide: DrizzleDb, useFactory: () => new DrizzleDb(options) },
        DatabaseHealth,
      ],
      exports: [DrizzleDb],
    };
  }

  static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: options.imports ?? [],
      providers: [
        {
          provide: DrizzleDb,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) =>
            new DrizzleDb(await options.useFactory(...args)),
        },
        DatabaseHealth,
      ],
      exports: [DrizzleDb],
    };
  }

  /**
   * `onApplicationShutdown`, not `beforeApplicationShutdown`: Nest's order is
   * onModuleDestroy -> beforeApplicationShutdown -> HTTP server closes ->
   * onApplicationShutdown. Closing earlier would yank the pool out from under
   * requests still draining.
   *
   * Requires `app.enableShutdownHooks()` in main.ts to fire at all.
   */
  async onApplicationShutdown(signal?: string): Promise<void> {
    DatabaseModule.logger.log(
      `Closing database pool (signal: ${signal ?? 'n/a'})`,
    );

    try {
      await this.db.close();
    } catch (err) {
      DatabaseModule.logger.error('Error closing database pool', err as Error);
    }
  }
}
