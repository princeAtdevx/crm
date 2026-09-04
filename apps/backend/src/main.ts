import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { Env } from './core/config/env.schema';
import { assertRuntime } from './core/config/runtime.guard';
import { ObserveInstrument } from './core/observe/observe';

// Before Nest, the pg driver, or anything else that would fail less legibly on
// an unsupported runtime. `engines.bun` is not enforced by pnpm or `bun run`.
assertRuntime();

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		instrument: ObserveInstrument,
	});

	// Required for DatabaseModule.onApplicationShutdown to fire on SIGTERM —
	// which both `node --watch` restarts and container stops send. Without it
	// the pg pool is never drained and dev restarts leak connections.
	app.enableShutdownHooks();

	const config = app.get(ConfigService<Env, true>);
	await app.listen(config.get('PORT', { infer: true }));
}

await bootstrap();
