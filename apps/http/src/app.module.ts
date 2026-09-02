import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { type Env, validate } from './core/config/env.schema';
import { DatabaseModule } from './core/database/database.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			expandVariables: true,
			// Relative to process.cwd(), which is apps/http for both `nest start`
			// and `node dist/main.js` — so these point at the repo root.
			envFilePath:
				process.env.NODE_ENV === 'test'
					? ['.env.test', '../../.env.local', '../../.env']
					: ['../../.env.local', '../../.env'],
			// Containers inject real env vars and cwd is unpredictable there.
			ignoreEnvFile: process.env.NODE_ENV === 'production',
			validate,
		}),

		DatabaseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<Env, true>) => ({
				connectionString: config.get('DATABASE_URL', { infer: true }),
				maxConnections: config.get('DATABASE_MAX_CONNECTIONS', { infer: true }),
				idleTimeoutMillis: config.get('DATABASE_IDLE_TIMEOUT_MS', {
					infer: true,
				}),
				connectionTimeoutMillis: config.get('DATABASE_CONNECTION_TIMEOUT_MS', {
					infer: true,
				}),
			}),
		}),

		ObserveModule.forRoot({
			appKey: 'YOUR_APP_KEY',
			appSecret: 'YOUR_APP_SECRET',
			serviceId: 'http',
		}),
	],

	controllers: [AppController],

	providers: [AppService],
})
export class AppModule {}
