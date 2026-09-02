import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import type { Env } from './core/config/env.schema';

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
