import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './database.health-indicator';
import { HealthController } from './health.controller';

/**
 * `errorLogStyle: 'pretty'` keeps failed-check output readable in container
 * logs. `DrizzleDb` needs no import here — `DatabaseModule` is `@Global()`.
 */
@Module({
	imports: [TerminusModule.forRoot({ errorLogStyle: 'pretty' })],
	controllers: [HealthController],
	providers: [DatabaseHealthIndicator],
})
export class HealthModule {}
