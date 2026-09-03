import type { DynamicModule } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import type { Env } from '../config/env.schema';

/**
 * Created once, at module scope. `ObserveInstrument` is passed to
 * `NestFactory.create` in main.ts and `ObserveModule` is registered by
 * `observeImports()` below — both must come from the SAME `createObserveModule`
 * call, which is why this lives in its own file rather than in app.module.ts.
 */
export const { ObserveModule, ObserveInstrument } = createObserveModule();

const logger = new Logger('Observe');

/**
 * Spread into `AppModule`'s `imports`. Returns the ObserveModule registration
 * when credentials are present and an empty array when they are not, so an
 * unconfigured environment runs with no agent at all instead of one that 401s
 * against the collector on every flush.
 *
 * MUST be called positionally AFTER `ConfigModule.forRoot(...)` in the same
 * `imports` array. Array elements evaluate left to right, and `forRoot` is
 * synchronous: it reads the .env files and assigns them into `process.env`
 * before returning. Move this call above it and the credentials are invisible
 * in development (where they come from a file) while continuing to work in
 * production (where the platform injects them as real env vars) — the worst
 * shape of bug this repo can have.
 *
 * The `process.env` read is the one sanctioned exception to the
 * "always read config through ConfigService" rule in env.schema.ts. Whether a
 * module is registered is decided while the imports array is being built, which
 * is strictly before any provider — ConfigService included — can be injected.
 * The values themselves still come from the validated store, below.
 */
export function observeImports(): DynamicModule[] {
	if (!process.env.OBSERVE_APP_KEY || !process.env.OBSERVE_APP_SECRET) {
		// Reached in two cases: neither variable set (the normal local default),
		// or exactly one set — which the both-or-neither check in env.schema.ts
		// then fails the boot over, a few lines later.
		logger.log('OBSERVE_APP_KEY / OBSERVE_APP_SECRET not both set — telemetry disabled');
		return [];
	}

	return [
		ObserveModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<Env, true>) => {
				const appKey = config.get('OBSERVE_APP_KEY', { infer: true });
				const appSecret = config.get('OBSERVE_APP_SECRET', { infer: true });

				// Unreachable via the guard above; here so the optional schema
				// fields narrow to `string` without an assertion.
				if (!appKey || !appSecret) {
					throw new Error('Observe credentials vanished between boot and DI');
				}

				return {
					appKey,
					appSecret,
					serviceId: config.get('OBSERVE_SERVICE_ID', { infer: true }),
					serviceVersion: config.get('OBSERVE_SERVICE_VERSION', { infer: true }),
				};
			},
		}),
	];
}
