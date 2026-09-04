import { Module } from '@nestjs/common';
import { observeImports } from './core/observe/observe';
import { HealthModule } from './modules/health/health.module';
import { configModule, databaseModule } from './modules.init';

@Module({
	imports: [
		configModule,
		databaseModule,
		HealthModule,

		// Positionally dependent: reads credentials out of process.env, which
		// ConfigModule.forRoot above has just populated from the .env files.
		// See the contract in core/observe/observe.ts before reordering.
		...observeImports(),
	],

	controllers: [],

	providers: [],
})
export class AppModule {}
