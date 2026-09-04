import { ConfigModule, ConfigService } from '@nestjs/config';
import { type Env, validate } from './core/config/env.schema';
import { DatabaseModule } from './core/database/database.module';

export const configModule = ConfigModule.forRoot({
	isGlobal: true,
	cache: true,
	expandVariables: true,
	// Relative to process.cwd(), which is apps/backend for both `nest start`
	// and `node dist/main.js` — so these point at the repo root.
	// First file wins, so the test pair is prepended rather than substituted:
	// anything .env.test does not mention still falls through to .env.
	envFilePath:
		process.env.NODE_ENV === 'test'
			? ['../../.env.test.local', '../../.env.test', '../../.env.local', '../../.env']
			: ['../../.env.local', '../../.env'],
	// Containers inject real env vars and cwd is unpredictable there.
	ignoreEnvFile: process.env.NODE_ENV === 'production',
	validate,
});

export const databaseModule = DatabaseModule.forRootAsync({
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
});
